const _ = require('lodash')
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
      { response: 'domain', geoIP: 'traits.domain' },
    ]
  }

  const init = (params) => {
    if (_.get(params, 'userId')) _.set(geoip, 'userId', _.get(params, 'userId'))
    if (_.get(params, 'licenseKey')) _.set(geoip, 'licenseKey', _.get(params, 'licenseKey'))
    if (_.get(params, 'env')) _.set(geoip, 'environment', _.get(params, 'env'))
    if (_.get(params, 'redis')) _.set(geoip, 'redis', _.get(params, 'redis'))
  }

  const lookup = async(params, cb) => {
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

    // try redis
    if (geoip.redis && !refresh) {
      try {
        geoipResponse = await geoip.redis.get(redisKey)
        geoipResponse = JSON.parse(geoipResponse)
        if (_.isPlainObject(geoipResponse)) {
          geoipResponse.fromCache = true
        }
        if (debug) {
          console.log('AC-GEOIP | From Cache | %j', geoipResponse)
        }
      }
      catch(e) {
        console.error('AC-GEOIP | From Cache | Failed | %j', e)
      }
    }

    // fetch fresh
    if (refresh || !_.get(geoipResponse, 'country')) {
      try {
        const client = new WebServiceClient(geoip.userId, geoip.licenseKey)
        geoipResponse = await new Promise((resolve, reject) => {
            client.city(ip).then(result => {
              return resolve(result)
          }).catch(reject)
        })
        if (debug) {
          console.log('AC-GEOIP | From Maxmind | %j', geoipResponse)
        }
        if (geoip.redis) {
          await geoip.redis.setex(redisKey, geoip.cacheTime, JSON.stringify(geoipResponse))
        }      
      }
      catch(e) {
        console.error('AC-GEOIP | From Maxmind | Failed | %j', e)
      }
    }

    // prepare response
    if (!_.isEmpty(mapping)) {
      _.forEach(mapping, item => {
        if (_.get(geoipResponse, item.geoIP)) _.set(response, item.response, _.get(geoipResponse, item.geoIP))
      })
    }
    else {
      response = geoipResponse
    }
    if (_.get(geoipResponse, 'fromCache')) _.set(response, 'fromCache', true)

    if (_.isFunction(cb)) return cb(null, response)
    return response
  }


  return {
    init,
    lookup
  }
}

module.exports = acgeoip()


