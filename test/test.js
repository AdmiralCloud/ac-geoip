const acgeoip = require('../index')
const expect = require('expect')
const { forOwn } = require('lodash')

const Redis = require("ioredis");
const redis = new Redis() 

const credentials = require('./../credentials')
const geoip = {
  redis,
  userId: credentials.userId,
  licenseKey: credentials.licenseKey
}

const ip = '212.45.111.17'
const expectedValue = {
  ip: '212.45.111.17',
  iso2: 'DE',
  city: 'Berlin',
  region: 'Land Berlin',
  isp: 'The Unbelievable Machine Company GmbH',
  organization: 'The Unbelievable Machine Company GmbH',
  domain: 'unbelievable-machine.net'
}

describe('Test', () => {

  it('Init', done => {
    acgeoip.init(geoip)
    return done()
  })

  it('Shoud be tested with callback', done => {
    acgeoip.lookup({
      ip,
      debug: false
    }, (err, result) => {
      if (err) return done(err)
      forOwn(expectedValue, (val, key) => {
        expect(result).toHaveProperty(key, val)
      })
      return done()
    })
  })

  it('Shoud be tested with async/await', async function() {
      this.timeout(5000)
      const result = await acgeoip.lookup({ ip, debug: false })     
      forOwn(expectedValue, (val, key) => {
        expect(result).toHaveProperty(key, val)
      })
      return
  })

  it('Shoud be tested with async/await - should be from cache', async function() {
    this.timeout(5000)
    const result = await acgeoip.lookup({ ip, debug: false })
    forOwn(expectedValue, (val, key) => {
      expect(result).toHaveProperty(key, val)
    })
    expect(result).toHaveProperty('fromCache', true)
    return
})

  it('Snd', done => {
    return done()
  })
})

