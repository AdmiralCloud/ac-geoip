const acgeoip = require('../index')
const _ = require('lodash')

const { expect } = require('chai');



const Redis = require("ioredis");
const redis = new Redis()

const credentials = require('./../credentials');


const ip = '35.184.130.59'
const expectedValue = {
  ip: '35.184.130.59',
  iso2: 'US',
  city: 'Council Bluffs',
  region: 'Iowa',
  isp: 'Google Cloud',
  organization: 'Google Cloud',
  domain: 'googleusercontent.com'
}


describe('Test Geolite2 without Redis (NodeCache)', () => {

  it('Init geolite without redis', done => {
    acgeoip.init({
      env: 'development',    // covers L39: _.has(params, 'env') true branch
      geolite: {
        enabled: true,
        path: './geolite2/GeoLite2-City.mmdb'
      }
    })
    return done()
  })

  it('Lookup local - no cache hit (stores in NodeCache)', async function() {
    this.timeout(5000)
    const result = await acgeoip.lookupLocal({ ip, debugPerforance: true })
    const fields = ['iso2', 'city', 'region']
    _.forEach(fields, key => {
      const val = _.get(expectedValue, key)
      expect(result).to.have.property(key, val)
    })
    expect(result).to.have.property('origin', 'db')
  })

  it('Lookup local - from NodeCache', async function() {
    this.timeout(5000)
    const result = await acgeoip.lookupLocal({ ip })
    const fields = ['iso2', 'city', 'region']
    _.forEach(fields, key => {
      const val = _.get(expectedValue, key)
      expect(result).to.have.property(key, val)
    })
    // NodeCache path does not set fromCache (only Redis path does via checkRedis)
    expect(result).to.have.property('origin', 'db')
  })

  it('Init geolite with useBuffer', done => {
    // covers L43: geolite.enabled && geolite.useBuffer true branch
    // env change ensures cache miss on next lookup (different storage key)
    acgeoip.init({
      env: 'buffer-test',
      geolite: {
        enabled: true,
        useBuffer: true,
        path: './geolite2/GeoLite2-City.mmdb'
      }
    })
    return done()
  })

  it('Lookup local with useBuffer - no cache hit', async function() {
    this.timeout(5000)
    // covers L94-96: geolite.useBuffer && geoip.reader true branch
    const result = await acgeoip.lookupLocal({ ip })
    const fields = ['iso2', 'city', 'region']
    _.forEach(fields, key => {
      const val = _.get(expectedValue, key)
      expect(result).to.have.property(key, val)
    })
    expect(result).to.have.property('origin', 'db')
  })

  it('Lookup local with empty mapping', async function() {
    this.timeout(5000)
    // covers L139: else branch when mapping is empty (cache hit from previous test)
    const result = await acgeoip.lookupLocal({ ip, mapping: [] })
    expect(result).to.have.property('country')
  })
})


describe('Test Webservice without Redis', () => {

  it('Init webservice without redis', done => {
    // No redis key → uses NodeCache; credentials set for webservice calls
    acgeoip.init({
      env: 'development',
      userId: credentials.userId,
      licenseKey: credentials.licenseKey
    })
    return done()
  })

  it('Special IP returns undefined', async function() {
    this.timeout(5000)
    // covers L158: isSpecialIP true branch in lookup()
    const result = await acgeoip.lookup({ ip: '127.0.0.1' })
    expect(result).to.be.undefined
  })

  it('Fresh webservice lookup without Redis', async function() {
    this.timeout(10000)
    // covers L175: else branch (getFromMemory) when no redis
    // covers L190: debug logging after webservice call
    // covers L203: else branch (storeInMemory) when no redis
    const result = await acgeoip.lookup({ ip, debug: true })
    _.forOwn(expectedValue, (val, key) => {
      expect(result).to.have.property(key, val)
    })
  })

  it('Lookup with empty mapping', async function() {
    this.timeout(5000)
    // covers L215: else branch when mapping is empty (returns raw geoipResponse)
    const result = await acgeoip.lookup({ ip, mapping: [] })
    expect(result).to.have.property('country')
  })
})


describe('Test Webservice', () => {

  it('Webservice is not yet enabled - should fail', async function() {
    this.timeout(5000)
    try {
      await acgeoip.lookup({ ip, debug: false })
    }
    catch (e) {
      expect(e).to.be.instanceOf(Error)
      expect(e.message).to.eql('acgeoip_licenseKey_missing')
    }
  })

  it('Init', done => {
    const geoip = {
      redis,
      userId: credentials.userId,
      licenseKey: credentials.licenseKey
    }
    acgeoip.init(geoip)
    return done()
  })

  it('Shoud be tested with async/await', async function() {
    this.timeout(5000)
    const result = await acgeoip.lookup({ ip, debug: true, refresh: true, debugPerforance: true })
    _.forOwn(expectedValue, (val, key) => {
      expect(result).to.have.property(key, val)
    })
    return
  })

  it('Shoud be tested with async/await - should be from cache', async function() {
    this.timeout(5000)
    const result = await acgeoip.lookup({ ip, debug: true })
    _.forOwn(expectedValue, (val, key) => {
      expect(result).to.have.property(key, val)
    })
    expect(result).to.have.property('fromCache', true)
    return
  })

  it('End', done => {
    return done()
  })
})


describe('Test Geolite2 local database', () => {

  it('Geolite local is not yet enabled - should fail', async function() {
    this.timeout(5000)
    // Re-init with geolite disabled to test the guard
    acgeoip.init({ geolite: { enabled: false, path: './geolite2/GeoLite2-City.mmdb' } })
    try {
      await acgeoip.lookupLocal({ ip, debug: false })
    }
 catch (e) {
      expect(e).to.be.instanceOf(Error)
      expect(e.message).to.eql('acgeoip_geolite_notEnabled')
    }
  })

  it('Init geolite', done => {
    const geoip = {
      redis,
      userId: undefined,
      licenseKey: undefined,
      geolite: {
        enabled: true,
        path: './geolite2/GeoLite2-City.mmdb'
      }
    }
    acgeoip.init(geoip)
    return done()
  })

  it('Test local ip async/await', async function() {
    this.timeout(5000)
    const result = await acgeoip.lookupLocal({ ip: '127.0.0.1', debug: false })
    expect(result).to.be.undefined
  })

  it('Shoud be tested with async/await', async function() {
      this.timeout(5000)
      // covers L111: debug logging after reading from local DB
      const result = await acgeoip.lookupLocal({ ip, debug: true, refresh: true, debugPerforance: true })
      const fields = ['iso2', 'city', 'region']
      _.forEach(fields, key => {
        const val = _.get(expectedValue, key)
        expect(result).to.have.property(key, val)
      })
      expect(result).to.have.property('origin', 'db')
      return
  })

  it('Test again - should be from cache', async function() {
    this.timeout(5000)
    const result = await acgeoip.lookupLocal({ ip, debug: true })
    const fields = ['iso2', 'city', 'region']
    _.forEach(fields, key => {
      const val = _.get(expectedValue, key)
      expect(result).to.have.property(key, val)
    })
    expect(result).to.have.property('origin', 'db')
    expect(result).to.have.property('fromCache', true)
    return
  })
})
