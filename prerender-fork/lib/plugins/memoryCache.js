var cacheManager = require('cache-manager');
const util = require('../util.js');

/*
available methods:
#### `init()`
#### `requestReceived(req, res, next)`
#### `tabCreated(req, res, next)`
#### `pageLoaded(req, res, next)`
#### `beforeSend(req, res, next)`
*/

const CACHE_TIME_SECONDS = 2 * 60 * 60; // 2 hours

module.exports = {
	init: function () {
		this.cache = cacheManager.caching({
			store: 'memory', max: process.env.CACHE_MAXSIZE || 100, ttl: process.env.CACHE_TTL || CACHE_TIME_SECONDS /*seconds*/
		});
	},

	// check if url exists in cache and if it does return the cached response.
	requestReceived: function (req, res, next) {
		this.cache.get(req.prerender.url, function (err, result) {
			if (!err && result) {
				util.log(`getting ${req.prerender.url} - returning cached response`);
				req.prerender.cacheHit = true;
				res.send(200, result);
			} else {
				next();
			}
		});
	},

	// the server rendered the page because the url was not in cache, store the response for next time.
	beforeSend: function (req, res, next) {
		if (!req.prerender.cacheHit && req.prerender.statusCode == 200) {
			this.cache.set(req.prerender.url, req.prerender.content);
		}
		next();
	}
};