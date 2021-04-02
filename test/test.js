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

  it('Shoud be tested with callback', function(done) {
    this.timeout(5000)
    acgeoip.lookup({
      ip,
      debug: false
    }, (err, result) => {
      if (err) return done(err)
      //console.log(51, result)
      _.forOwn(expectedValue, (val, key) => {
        expect(result).to.have.property(key, val)
      })
      return done()
    })
  })

  it('Shoud be tested with async/await', async function() {
    this.timeout(5000)
    const result = await acgeoip.lookup({ ip, debug: false })     
    _.forOwn(expectedValue, (val, key) => {
      expect(result).to.have.property(key, val)
    })
    return
  })

  it('Shoud be tested with async/await - should be from cache', async function() {
    this.timeout(5000)
    const result = await acgeoip.lookup({ ip, debug: false })
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
      redis: undefined,
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
      const result = await acgeoip.lookupLocal({ ip, debug: false })    
      let fields = ['iso2', 'city', 'region']
      _.forEach(fields, key => {
        let val = _.get(expectedValue, key)
        expect(result).to.have.property(key, val)
      })
      return 
  })
})

