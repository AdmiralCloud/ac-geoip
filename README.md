# AC GEOIP
Lookup IP addresses at Maxmind GEOIP services or local Maxmind (Geolite) database and prepare the response with custom field mapping. Optionally, you can store the response in Redis to improve performance (of your app).

GEOIP web service requires an account at Maxmind.

You can also use the Geolite2 database from Maxmind: https://dev.maxmind.com/geoip/geoip2/geolite2/

## Usage

### Using Webservice
```
const acgeoip = require('./index')

let geoip = {
  userId: 123456778,
  licenseKey: 'abc-licensekey'
}
acgeoip.init(geoip)

// ASYNC/AWAIT
async() {
  let response = await acgeoip.lookup({ ip: '1.2.3.4' })
}
```

### Using local (Geolite) database
```
const acgeoip = require('./index')

let geoip = {
  geolite: { 
    enabled: true,
    path: '/path/to/GeoLite2-City.mmdb'
  }
}
acgeoip.init(geoip)

// ASYNC/AWAIT
async() {
  let response = await acgeoip.lookupLocal({ ip: '1.2.3.4' })
}
```

### Combined usage
```
const acgeoip = require('./index')

let geoip = {
  userId: 123456778,
  licenseKey: 'abc-licensekey',
  geolite: {
    enabled: true,
    path: '/path/to/GeoLite2-City.mmdb'
  }
}
acgeoip.init(geoip)

// lookup using web service
async() {
  let response = await acgeoip.lookup({ ip: '1.2.3.4' })
}

// lookup using local database
async() {
  let response = await acgeoip.lookupLocal({ ip: '1.2.3.4' })
}
```

### Using callbacks
We recommend using modern async/await approach, but you can also use classic callbacks.
```
// TRADITONAL CALLBACK is available for lookup and lookupLocal 
acgeoip.lookup({
  ip: '8.8.8.8'
}, (err, response) => {
  console.log(response)
})

```

## Init Parameters
**Required**   
Initiate the function with the required "userId" and "licenseKey" if you want to use the webservice. If you want to use local database, make sure to set geolite.enabled to true and provide the location of the database.

**Mapping**   
Define how your response looks like using a mapping array. The array contains objects with properties "response" which is the property name in the response and "geoIP" which is the path to the GeoIP response. 

See this default setup as example
```
 mapping: [
      { response: 'iso2', geoIP: 'country.iso_code' },
      { response: 'city', geoIP: 'city.names.en' },
      { response: 'region', geoIP: 'subdivisions[0].names.en' },
      // the following properties are only available using the paid webservice
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
[MIT License](https://opensource.org/licenses/MIT) Copyright © 2009-present, AdmiralCloud AG, Mark Poepping