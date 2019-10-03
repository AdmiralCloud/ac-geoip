const _ = require('lodash')
const async = require('async')

const WebServiceClient = require('@maxmind/geoip2-node').WebServiceClient;

const acgeoip = () => {
  
  let geoip = {
    userId: 'userId',
    licenseKey: 'licenseKey',
    environment: 'development',
    redis: {
      // instance of redis
    },
    cacheTime: 7 * 86400, // cache GEOIP response for 1 week
    mapping: [
      { response: 'iso2', geoIP: 'country.iso_code' },
      { response: 'city', geoIP: 'city.names.en' },
      { response: 'region', geoIP: 'subdivisions[0].names.en' },
      { response: 'isp', geoIP: 'traits.isp' },
      { response: 'organization', geoIP: 'traits.organization' },
      { response: 'domain', geoIP: 'traits.domain' },
      { response: 'location', geoIP: 'location' },
    ]
  }

  const init = (params) => {
    if (_.get(params, 'userId')) _.set(geoip, 'userId', _.get(params, 'userId'))
    if (_.get(params, 'licenseKey')) _.set(geoip, 'licenseKey', _.get(params, 'licenseKey'))
    if (_.get(params, 'env')) _.set(geoip, 'environment', _.get(params, 'env'))
  }

  const lookup = (params, cb) => {
    const ip = _.get(params, 'ip')
    const refresh = _.get(params, 'refresh')
    const redisKey = _.get(geoip, 'environment') + ':geoip:' + ip

    let response = {
      ip
    }
    let geoipResponse
    async.series({
      checkCache: (done) => {
        if (refresh) return done()
        if (!_.isFunction(geoip.redis)) return done()
        geoip.redis.get(redisKey, (err, result) => {
          if (err) return done(err)
          try {
            geoipResponse = JSON.parse(result)
          }
          catch (e) {
            console.error('ACGeoIP | Parsing JSON failed %j', e)
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
          if (!_.isFunction(geoip.redis)) return done()
          geoip.redis.setex(redisKey, geoip.cacheTime, JSON.stringify(result), done)
        })
      },
      prepareResponse: (done) => {
        _.forEach(geoip.mapping, item => {
          if (_.get(geoipResponse, item.geoIP)) _.set(response, item.response, _.get(geoipResponse, item.geoIP))
        })
        return done()
      }
    }, (err) => {
      return cb(err, response)
    })   
  }


  return {
    init,
    lookup
  }
}

module.exports = acgeoip()


