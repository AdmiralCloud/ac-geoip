<a name="2.0.0"></a>
 
# [2.0.0](https://github.com/admiralcloud/ac-geoip/compare/v1.4.2..v2.0.0) (2022-01-29 11:56:17)


### Bug Fix

* **App:** Open geolite DB during initialisation | VD | [37b6981913f08798c1b764021d528497f8cc238f](https://github.com/admiralcloud/ac-geoip/commit/37b6981913f08798c1b764021d528497f8cc238f)    
Open geolite DB during initialisation  
Related issues: [undefined/undefined#AC-2500](undefined/browse/AC-2500)
* **App:** Cache geoip2 Reader object | VD | [54a67bb2d186ccf10ec72e8b370ce9a51c2ab89c](https://github.com/admiralcloud/ac-geoip/commit/54a67bb2d186ccf10ec72e8b370ce9a51c2ab89c)    
Store object to re-use instead of opening DB file each time it's needed.  
Related issues: [undefined/undefined#AC-2500](undefined/browse/AC-2500)
* **App:** Remove callbacks from async functions | VD | [6c4a6ecd0ce8f8350eb206b41be0d90ddaf09ee5](https://github.com/admiralcloud/ac-geoip/commit/6c4a6ecd0ce8f8350eb206b41be0d90ddaf09ee5)    
Mixing async and callback functions makes code read hard, misunderstand the results and make function behave unpredictably.  
Related issues: [undefined/undefined#AC-2500](undefined/browse/AC-2500)
### Style

* **App:** Get rid of semicollons, code re-aligning | VD | [e27005f2001a0da06d12fe272a3e007937f1604b](https://github.com/admiralcloud/ac-geoip/commit/e27005f2001a0da06d12fe272a3e007937f1604b)    
Get rid of semicollons, code re-aligning
### Chores

* **App:** Updated packages | MP | [49f68ab1575163f6b9e9a845a23cd779195d9a41](https://github.com/admiralcloud/ac-geoip/commit/49f68ab1575163f6b9e9a845a23cd779195d9a41)    
Updated packages
## BREAKING CHANGES
* **App:** * lookupLocal, lookup functions fully async and doesn't have callback parameters
<a name="1.4.2"></a>

## [1.4.2](https://github.com/admiralcloud/ac-geoip/compare/v1.4.1..v1.4.2) (2021-10-09 10:25:40)


### Bug Fix

* **App:** Package updates | MP | [08dd237ecc7274cfb083f3f6279036fa94d17398](https://github.com/admiralcloud/ac-geoip/commit/08dd237ecc7274cfb083f3f6279036fa94d17398)    
Package updates
<a name="1.4.1"></a>

## [1.4.1](https://github.com/mmpro/ac-geoip/compare/v1.4.0..v1.4.1) (2021-05-02 09:42:55)


### Bug Fix

* **App:** Improved debug log | MP | [e5985e0a10d08979ab2f1ddadcc51217f43e0342](https://github.com/mmpro/ac-geoip/commit/e5985e0a10d08979ab2f1ddadcc51217f43e0342)    
Improved debug log
### Tests

* **App:** Minor fix | MP | [42f5ffec32d0fa9d54306ddc1281feef7ef6e3df](https://github.com/mmpro/ac-geoip/commit/42f5ffec32d0fa9d54306ddc1281feef7ef6e3df)    
Minor fix
### Chores

* **App:** Updated packages | MP | [39b1e855d0d8b7419868f84038163f142f5a4b26](https://github.com/mmpro/ac-geoip/commit/39b1e855d0d8b7419868f84038163f142f5a4b26)    
Updated packages
<a name="1.4.0"></a>
 
# [1.4.0](https://github.com/mmpro/ac-geoip/compare/v1.3.0..v1.4.0) (2021-04-12 09:36:41)


### Feature

* **App:** Use node-cache per default | MP | [1a5481a30245fc53ccb6333a60f4ae38a8245eb5](https://github.com/mmpro/ac-geoip/commit/1a5481a30245fc53ccb6333a60f4ae38a8245eb5)    
If Redis is not defined, use node-cache (memory) to improve performance.
### Bug Fix

* **App:** Allow Redis usage when using local database | MP | [943ab0cf914245cceab0c23da1e03078783a1b66](https://github.com/mmpro/ac-geoip/commit/943ab0cf914245cceab0c23da1e03078783a1b66)    
To improve performance it makes sense to use Redis even for local database. Lookup is a little slow and consumes a lot of CPU
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



