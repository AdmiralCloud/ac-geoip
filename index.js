const _ = require('lodash')
const async = require('async')
const ipPackage = require('ip')

const WebServiceClient = require('@maxmind/geoip2-node').WebServiceClient;

const acgeoip = () => {
  
  let geoip = {
    userId: 'userId',
    licenseKey: 'licenseKey',
    environment: 'development',
    // redis, // instance of redis
    cacheTime: 7 * 86400, // cache GEOIP response for 1 week
    mapping: [
      { response: 'iso2', geoIP: 'country.isoCode' },
      { response: 'city', geoIP: 'city.names.en' },
      { response: 'region', geoIP: 'subdivisions[0].names.en' },
      { response: 'isp', geoIP: 'traits.isp' },
      { response: 'organization', geoIP: 'traits.organization' },
      { response: 'domain', geoIP: 'traits.domain' }
    ]
  }

  const init = (params) => {
    if (_.get(params, 'userId')) _.set(geoip, 'userId', _.get(params, 'userId'))
    if (_.get(params, 'licenseKey')) _.set(geoip, 'licenseKey', _.get(params, 'licenseKey'))
    if (_.get(params, 'env')) _.set(geoip, 'environment', _.get(params, 'env'))
    if (_.get(params, 'redis')) _.set(geoip, 'redis', _.get(params, 'redis'))
  }

  const lookup = (params, cb) => {
    const ip = _.get(params, 'ip')
    if (ipPackage.isPrivate(ip)) return cb()

    const refresh = _.get(params, 'refresh')
    const redisKey = _.get(geoip, 'environment') + ':geoip:' + ip
    const mapping = _.get(params, 'mapping', geoip.mapping)
    const debug = _.get(params, 'debug')

    let response = {
      ip
    }
    let geoipResponse
    async.series({
      checkCache: (done) => {
        if (refresh) return done()
        if (!geoip.redis) return done()
        geoip.redis.get(redisKey, (err, result) => {
          if (err) return done(err)
          try {
            geoipResponse = JSON.parse(result)
          }
          catch (e) {
            console.error('ACGeoIP | Parsing JSON failed %j', e)
          }
          if (debug) {
            console.log('AC-GEOIP | From Cache | %j', geoipResponse)
          }
          return done()
        })
      },
      getFresh: (done) => {
        if (!_.isEmpty(geoipResponse)) return done() // using cached value
        const client = new WebServiceClient(geoip.userId, geoip.licenseKey)
        client.city(ip).then(result => {
          if (!result) return done({ message: 'noResultFromGeoIP' })
          geoipResponse = result
          if (debug) {
            console.log('AC-GEOIP | From Maxmind | %j', result)
          }
          if (!geoip.redis) return done()
          geoip.redis.setex(redisKey, geoip.cacheTime, JSON.stringify(result), done)
        })
      },
      prepareResponse: (done) => {
        if (_.isEmpty(mapping)) {
          response = geoipResponse
          return done()
        }
        _.forEach(mapping, item => {
          if (_.get(geoipResponse, item.geoIP)) _.set(response, item.response, _.get(geoipResponse, item.geoIP))
        })
        return done()
      }
    }, (err) => {
      if (debug) {
        console.log('AC-GEOIP | Response| %j', response)
      }
      return cb(err, response)
    })   
  }


  return {
    init,
    lookup
  }
}

module.exports = acgeoip()


