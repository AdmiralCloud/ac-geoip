// Unit tests: MaxMind (webservice + reader), Redis and the filesystem are faked.
// Real-world tests live in integration.js
const fs = require('fs')
const { expect } = require('chai')

const maxmindPath = require.resolve('@maxmind/geoip2-node')
const indexPath = require.resolve('../index')

const ip = '35.184.130.59'
const geolitePath = '/fake/GeoLite2-City.mmdb'

const cityResponse = () => ({
  country: { isoCode: 'US' },
  city: { names: { en: 'Council Bluffs' } },
  subdivisions: [{ names: { en: 'Iowa' } }],
  traits: { isp: 'Google Cloud', organization: 'Google Cloud', domain: 'googleusercontent.com' },
  location: { latitude: 41.26, longitude: -95.86 }
})

const expectedValue = {
  ip,
  iso2: 'US',
  city: 'Council Bluffs',
  region: 'Iowa',
  isp: 'Google Cloud',
  organization: 'Google Cloud',
  domain: 'googleusercontent.com',
  latitude: 41.26,
  longitude: -95.86
}

// behaviour of the fakes, reset before each test
const fake = {}

class FakeReader {
  static open(path) {
    fake.readerOpenCalls.push(path)
    return fake.readerOpen(path)
  }
  static openBuffer(buffer) {
    fake.openBufferCalls.push(buffer)
    return new FakeReader()
  }
  city(lookupIp) {
    fake.readerCityCalls.push(lookupIp)
    return fake.readerCity(lookupIp)
  }
}

class FakeWebServiceClient {
  constructor(userId, licenseKey) {
    fake.webClients.push({ userId, licenseKey })
  }
  city(lookupIp) {
    fake.webCityCalls.push(lookupIp)
    return fake.webCity(lookupIp)
  }
}

class FakeRedis {
  constructor() {
    this.store = {}
    this.ttl = {}
    this.failGet = false
  }
  async get(key) {
    if (this.failGet) { throw Error('redis_get_failed') }
    return this.store[key] === undefined ? null : this.store[key]
  }
  async setex(key, ttl, value) {
    this.store[key] = value
    this.ttl[key] = ttl
  }
}

const resetFake = () => {
  fake.webClients = []
  fake.webCityCalls = []
  fake.readerOpenCalls = []
  fake.openBufferCalls = []
  fake.readerCityCalls = []
  fake.webCity = async () => cityResponse()
  fake.readerCity = () => cityResponse()
  fake.readerOpen = async () => new FakeReader()
}

const load = () => {
  delete require.cache[indexPath]
  return require(indexPath)
}

const tick = () => new Promise(resolve => setImmediate(resolve))

const catchError = async (promise) => {
  try { await promise }
  catch (e) { return e }
}

describe('ac-geoip (unit)', () => {
  let originalMaxmind
  let originalWarn
  let originalError
  let logs
  let geoip
  let redis

  before(() => {
    require(maxmindPath)
    originalMaxmind = require.cache[maxmindPath].exports
    require.cache[maxmindPath].exports = { WebServiceClient: FakeWebServiceClient, Reader: FakeReader }
  })

  after(() => {
    require.cache[maxmindPath].exports = originalMaxmind
    delete require.cache[indexPath]
  })

  beforeEach(() => {
    resetFake()
    logs = { warn: [], error: [] }
    originalWarn = console.warn
    originalError = console.error
    console.warn = (...args) => logs.warn.push(args)
    console.error = (...args) => logs.error.push(args)
    geoip = load()
    redis = new FakeRedis()
  })

  afterEach(() => {
    console.warn = originalWarn
    console.error = originalError
  })

  describe('lookup (webservice)', () => {
    it('throws if licenseKey is missing', async () => {
      geoip.init()
      const e = await catchError(geoip.lookup({ ip }))
      expect(e).to.be.instanceOf(Error)
      expect(e.message).to.eql('acgeoip_licenseKey_missing')
    })

    it('returns undefined for special IPs', async () => {
      geoip.init({ userId: 'user', licenseKey: 'key' })
      const result = await geoip.lookup({ ip: '127.0.0.1' })
      expect(result).to.be.undefined
      expect(fake.webCityCalls).to.have.length(0)
    })

    it('fetches from webservice and maps the response', async () => {
      geoip.init({ userId: 'user', licenseKey: 'key' })
      const result = await geoip.lookup({ ip })
      expect(result).to.deep.include(expectedValue)
      expect(result).to.have.property('origin', 'webservice')
      expect(fake.webClients).to.eql([{ userId: 'user', licenseKey: 'key' }])
    })

    it('serves the second lookup from memory cache', async () => {
      geoip.init({ userId: 'user', licenseKey: 'key' })
      await geoip.lookup({ ip })
      const result = await geoip.lookup({ ip })
      expect(result).to.deep.include(expectedValue)
      expect(fake.webCityCalls).to.have.length(1)
    })

    it('returns the raw response with empty mapping', async () => {
      geoip.init({ userId: 'user', licenseKey: 'key' })
      const result = await geoip.lookup({ ip, mapping: [] })
      expect(result).to.have.nested.property('country.isoCode', 'US')
      expect(result).to.have.property('origin', 'webservice')
    })

    it('uses a custom mapping', async () => {
      geoip.init({ userId: 'user', licenseKey: 'key' })
      const result = await geoip.lookup({ ip, mapping: [{ response: 'country', geoIP: 'country.isoCode' }] })
      expect(result).to.have.property('country', 'US')
      expect(result).to.not.have.property('city')
    })

    it('logs debug and performance output', async () => {
      geoip.init({ userId: 'user', licenseKey: 'key' })
      await geoip.lookup({ ip, debug: true, debugPerformance: true })
      const messages = logs.warn.map(args => args[0])
      expect(messages).to.include('AC-GEOIP | From Maxmind | %j')
      expect(messages).to.include('%s | getFromCache %d')
      expect(messages).to.include('%s | readFromWebservice %d')
      expect(messages).to.include('%s | storeInCache %d')
    })

    it('returns no data and does not cache if the webservice fails', async () => {
      fake.webCity = async () => { throw Error('webservice_down') }
      geoip.init({ userId: 'user', licenseKey: 'key' })
      const result = await geoip.lookup({ ip })
      expect(result).to.have.property('ip', ip)
      expect(result.origin).to.be.undefined
      expect(logs.error).to.have.length(1)

      await geoip.lookup({ ip })
      expect(fake.webCityCalls).to.have.length(2)
    })

    it('returns undefined with empty mapping if the webservice fails', async () => {
      fake.webCity = async () => { throw Error('webservice_down') }
      geoip.init({ userId: 'user', licenseKey: 'key' })
      const result = await geoip.lookup({ ip, mapping: [] })
      expect(result).to.be.undefined
    })

    describe('with redis', () => {
      beforeEach(() => {
        geoip.init({ userId: 'user', licenseKey: 'key', redis, env: 'test' })
      })

      it('stores in redis and serves from redis afterwards', async () => {
        const first = await geoip.lookup({ ip })
        expect(first).to.have.property('origin', 'webservice')
        expect(first).to.not.have.property('fromCache')
        expect(redis.store).to.have.property('test:geoip:' + ip)
        expect(redis.ttl['test:geoip:' + ip]).to.eql(7 * 86400)

        const second = await geoip.lookup({ ip, debug: true })
        expect(second).to.deep.include(expectedValue)
        expect(second).to.have.property('fromCache', true)
        expect(fake.webCityCalls).to.have.length(1)
        expect(logs.warn.map(args => args[0])).to.include('AC-GEOIP | From Cache | %j')
      })

      it('refresh skips the cache', async () => {
        await geoip.lookup({ ip })
        const result = await geoip.lookup({ ip, refresh: true })
        expect(result).to.not.have.property('fromCache')
        expect(fake.webCityCalls).to.have.length(2)
      })

      it('falls back to the webservice if redis get fails', async () => {
        redis.failGet = true
        const result = await geoip.lookup({ ip })
        expect(result).to.have.property('origin', 'webservice')
        expect(logs.error.map(args => args[0])).to.include('AC-GEOIP | From Cache | Failed | %j')
      })

      it('falls back to the webservice if the cached value is not valid JSON', async () => {
        redis.store['test:geoip:' + ip] = 'no json'
        const result = await geoip.lookup({ ip })
        expect(result).to.have.property('origin', 'webservice')
        expect(logs.error).to.have.length(1)
      })
    })
  })

  describe('lookupLocal (geolite)', () => {
    it('throws if geolite is not enabled', async () => {
      geoip.init()
      const e = await catchError(geoip.lookupLocal({ ip }))
      expect(e).to.be.instanceOf(Error)
      expect(e.message).to.eql('acgeoip_geolite_notEnabled')
    })

    it('returns undefined for special IPs', async () => {
      geoip.init({ geolite: { enabled: true, path: geolitePath } })
      const result = await geoip.lookupLocal({ ip: '127.0.0.1' })
      expect(result).to.be.undefined
    })

    it('reads from the reader opened during init', async () => {
      geoip.init({ geolite: { enabled: true, path: geolitePath } })
      await tick()
      const result = await geoip.lookupLocal({ ip })
      expect(result).to.deep.include(expectedValue)
      expect(result).to.have.property('origin', 'db')
      expect(fake.readerOpenCalls).to.eql([geolitePath])
    })

    it('opens the reader lazily if init has not finished yet', async () => {
      geoip.init({ geolite: { enabled: true, path: geolitePath } })
      const result = await geoip.lookupLocal({ ip })
      expect(result).to.deep.include(expectedValue)
      expect(fake.readerOpenCalls).to.eql([geolitePath, geolitePath])
    })

    it('serves the second lookup from memory cache', async () => {
      geoip.init({ geolite: { enabled: true, path: geolitePath } })
      await tick()
      await geoip.lookupLocal({ ip })
      const result = await geoip.lookupLocal({ ip })
      expect(result).to.deep.include(expectedValue)
      expect(fake.readerCityCalls).to.have.length(1)
    })

    it('returns the raw response with empty mapping', async () => {
      geoip.init({ geolite: { enabled: true, path: geolitePath } })
      await tick()
      const result = await geoip.lookupLocal({ ip, mapping: [] })
      expect(result).to.have.nested.property('country.isoCode', 'US')
      expect(result).to.have.property('origin', 'db')
    })

    it('logs debug and performance output', async () => {
      geoip.init({ geolite: { enabled: true, path: geolitePath } })
      await tick()
      await geoip.lookupLocal({ ip, debug: true, debugPerformance: true })
      const messages = logs.warn.map(args => args[0])
      expect(messages).to.include('AC-GEOIP | From Geolite | %j')
      expect(messages).to.include('%s | getFromCache %d')
      expect(messages).to.include('%s | readFromDB %d')
      expect(messages).to.include('%s | storeInCache %d')
      expect(messages).to.include('%s | Finished %d')
    })

    it('returns no data if the reader fails to open', async () => {
      geoip.init({ geolite: { enabled: true, path: geolitePath } })
      fake.readerOpen = async () => { throw Error('open_failed') }
      const result = await geoip.lookupLocal({ ip })
      expect(result).to.have.property('ip', ip)
      expect(result.origin).to.be.undefined
      expect(logs.error.map(args => args[0])).to.include('AC-GEOIP | From Geolite | Failed | %j')
    })

    it('returns no data if the IP is not in the database', async () => {
      geoip.init({ geolite: { enabled: true, path: geolitePath } })
      await tick()
      fake.readerCity = () => { throw Error('AddressNotFoundError') }
      const result = await geoip.lookupLocal({ ip })
      expect(result.origin).to.be.undefined
      expect(logs.error).to.have.length(1)
    })

    describe('with useBuffer', () => {
      let originalReadFileSync
      let readFiles

      beforeEach(() => {
        readFiles = []
        originalReadFileSync = fs.readFileSync
        fs.readFileSync = (file) => {
          readFiles.push(file)
          return Buffer.from('fake database')
        }
      })

      afterEach(() => {
        fs.readFileSync = originalReadFileSync
      })

      it('reads the database into a buffer and uses it', async () => {
        geoip.init({ geolite: { enabled: true, useBuffer: true, path: geolitePath } })
        const result = await geoip.lookupLocal({ ip, debugPerformance: true })
        expect(result).to.deep.include(expectedValue)
        expect(result).to.have.property('origin', 'db')
        expect(readFiles).to.eql([geolitePath])
        expect(fake.openBufferCalls).to.have.length(1)
        expect(fake.readerOpenCalls).to.have.length(0)
        expect(logs.warn.map(args => args[0])).to.include('%s | readFromBuffer %d')
      })
    })

    describe('with redis', () => {
      beforeEach(async () => {
        geoip.init({ redis, env: 'test', geolite: { enabled: true, path: geolitePath } })
        await tick()
      })

      it('stores in redis and serves from redis afterwards', async () => {
        const first = await geoip.lookupLocal({ ip })
        expect(first).to.have.property('origin', 'db')
        expect(first).to.not.have.property('fromCache')
        expect(redis.store).to.have.property('test:geoip:' + ip)

        const second = await geoip.lookupLocal({ ip })
        expect(second).to.deep.include(expectedValue)
        expect(second).to.have.property('fromCache', true)
        expect(fake.readerCityCalls).to.have.length(1)
      })

      it('refresh skips the cache', async () => {
        await geoip.lookupLocal({ ip })
        await geoip.lookupLocal({ ip, refresh: true })
        expect(fake.readerCityCalls).to.have.length(2)
      })

      it('falls back to the database if redis get fails', async () => {
        redis.failGet = true
        const result = await geoip.lookupLocal({ ip })
        expect(result).to.have.property('origin', 'db')
        expect(logs.error.map(args => args[0])).to.include('AC-GEOIP | From Cache | Failed | %j')
      })
    })
  })
})
