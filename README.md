# AC GEOIP
Lookup IP addresses at Maxmind GEOIP services and prepare the response with custom field mapping. OPtionally, you can store the response in Redis to improve performance (of your app).

GEOIP service requires an account at Maxmind.

## Usage

```
const acgeoip = require('./index')

let geoip = {
  userId: 123456778,
  licenseKey: 'abc-licensekey'
}

acgeoip.init(geoip)

acgeoip.lookup({
  ip: '8.8.8.8'
}, (err, result) => {
  console.log(result)
})

```

## Init Parameters
**Required**   
Initiate the function with the required "userId" and "licenseKey".

**Mapping**   
Define how your response looks like using a mapping array. The array contains objects with properties "response" which is the property name in the response and "geoIP" which is the path to the GeoIP response. 

See this default setup as example
```
 mapping: [
      { response: 'iso2', geoIP: 'country.iso_code' },
      { response: 'city', geoIP: 'city.names.en' },
      { response: 'region', geoIP: 'subdivisions[0].names.en' },
      { response: 'isp', geoIP: 'traits.isp' },
      { response: 'organization', geoIP: 'traits.organization' },
      { response: 'domain', geoIP: 'traits.domain' },
      { response: 'location', geoIP: 'location' },
    ]
```

**Caching**   
In order to cache the data, you need to provide:
+ redis - a redis instance (from ioredis)
+ environment - prefix (default development) for the redisKey (e.g development:geoip:8.8.8.8)
+ cacheTime - seconds to cache the GeoIP response (default 7 days)


## Links
- [Website](https://www.admiralcloud.com/)
- [Twitter (@admiralcloud)](https://twitter.com/admiralcloud)
- [Facebook](https://www.facebook.com/MediaAssetManagement/)

## Thanks
Thanks to https://github.com/maxmind/GeoIP2-node

## License
[MIT License](https://opensource.org/licenses/MIT) Copyright © 2009-present, AdmiralCloud, Mark Poepping