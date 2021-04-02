<a name="1.3.0"></a>
 
# [1.3.0](https://github.com/mmpro/ac-geoip/compare/v1.2.1..v1.3.0) (2021-04-02 09:52:27)


### Feature

* **App:** LookupLocal for local database lookup | MP | [d6821229d6475e6bd2bb83822bee01bf474f1219](https://github.com/mmpro/ac-geoip/commit/d6821229d6475e6bd2bb83822bee01bf474f1219)    
LookupLocal is now available as dedicated function to lookup a local geolite database. Lookup only uses webservice. You can use both functions in parallel (e.g. to compare results).
<a name="1.2.1"></a>

## [1.2.1](https://github.com/mmpro/ac-geoip/compare/v1.2.0..v1.2.1) (2021-04-02 06:49:54)


### Bug Fix

* **App:** Improved logging | MP | [7d664460d4109fc078e656a0fe264a23c7e2cf9d](https://github.com/mmpro/ac-geoip/commit/7d664460d4109fc078e656a0fe264a23c7e2cf9d)    
Improved logging
### Tests

* **App:** Added tests for geolite database | MP | [f6da987068a63c4cb43fb84729e4816875de9283](https://github.com/mmpro/ac-geoip/commit/f6da987068a63c4cb43fb84729e4816875de9283)    
Added tests for geolite database
### Chores

* **App:** Updated packages | MP | [66e8056c2dab7377b6040cb35551ee3bf352e98d](https://github.com/mmpro/ac-geoip/commit/66e8056c2dab7377b6040cb35551ee3bf352e98d)    
Updated packages
<a name="1.2.0"></a>
 
# [1.2.0](https://github.com/mmpro/ac-geoip/compare/v1.1.0..v1.2.0) (2021-03-21 07:35:20)


### Feature

* **App:** You can now use geolite2 local database | MP | [dd671ab0b6bcc19cee5aefeb3cf421c15974e864](https://github.com/mmpro/ac-geoip/commit/dd671ab0b6bcc19cee5aefeb3cf421c15974e864)    
It is now possible to use geolite2 downloadble database instead of web service.
### Chores

* **App:** Do not commit folder geolite2 | MP | [8e20cbba069222d9f25abe79111d604bc827b3e6](https://github.com/mmpro/ac-geoip/commit/8e20cbba069222d9f25abe79111d604bc827b3e6)    
Do not commit folder geolite2
### Chores

* **App:** Updated packages | MP | [8c44382bb0f0c60973fccd6f7e25feb01993e32b](https://github.com/mmpro/ac-geoip/commit/8c44382bb0f0c60973fccd6f7e25feb01993e32b)    
Updated packages
<a name="1.1.0"></a>
 
# [1.1.0](https://github.com/mmpro/ac-geoip/compare/v1.0.4..v1.1.0) (2020-12-12 14:43:41)


### Feature

* **App:** Function now supports async/await | MP | [f6b65c568ed34fb8149ee9e00d23b8946cb83256](https://github.com/mmpro/ac-geoip/commit/f6b65c568ed34fb8149ee9e00d23b8946cb83256)    
You can use async/await in addition to classic callback
### Chores

* **App:** Remove husky | MP | [cb52b5d3f8c38c6e8a9437725b5aeba35cf6de33](https://github.com/mmpro/ac-geoip/commit/cb52b5d3f8c38c6e8a9437725b5aeba35cf6de33)    
Remove husky
* **App:** Package cleanup and updates | MP | [f661f118bd7897bce87de6c862d8497a19ec72f8](https://github.com/mmpro/ac-geoip/commit/f661f118bd7897bce87de6c862d8497a19ec72f8)    
Package cleanup and updates
* **App:** Use ac-semantic-release | MP | [66c9797b3db0072559d62f16dcaa93acdad6859a](https://github.com/mmpro/ac-geoip/commit/66c9797b3db0072559d62f16dcaa93acdad6859a)    
Use ac-semantic-release
<a name="1.0.4"></a>
## [1.0.4](https://github.com/mmpro/ac-geoip/compare/v1.0.3...v1.0.4) (2019-10-13 06:40)


### Bug Fixes

* **GeoIP:** Only log if debug parameter is set | MP ([b5466de](https://github.com/mmpro/ac-geoip/commit/b5466de))    
  Only log if debug parameter is set



<a name="1.0.3"></a>
## [1.0.3](https://github.com/mmpro/ac-geoip/compare/v1.0.2...v1.0.3) (2019-10-06 09:57)


### Bug Fixes

* **GeoIP:** Minor fixes: Redis, debugging | MP ([d692f62](https://github.com/mmpro/ac-geoip/commit/d692f62))    
  Fixed using Redis, added debug option per request



<a name="1.0.2"></a>
## [1.0.2](https://github.com/mmpro/ac-geoip/compare/v1.0.1...v1.0.2) (2019-10-06 09:10)


### Bug Fixes

* **GeoIP:** Improved functionality | MP ([000654f](https://github.com/mmpro/ac-geoip/commit/000654f))    
  Check for private IP, fixed using Redis as cache, allow mapping per request.



<a name="1.0.1"></a>
## [1.0.1](https://github.com/mmpro/ac-geoip/compare/v1.0.0...v1.0.1) (2019-10-03 11:09)


### Bug Fixes

* **GeoIP:** Removed location from default mapping | MP ([6c25ed4](https://github.com/mmpro/ac-geoip/commit/6c25ed4))    
  Removed location from default mapping



<a name="1.0.0"></a>
# 1.0.0 (2019-10-03 08:36)


### Features

* **GeoIP:** Initial version | MP ([89771ac](https://github.com/mmpro/ac-geoip/commit/89771ac))    
  Initial version



