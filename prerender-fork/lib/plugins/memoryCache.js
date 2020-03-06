var cacheManager = require('cache-manager');
var geoip = require('geoip-lite');
const util = require('../util.js');

const CACHE_TIME_SECONDS = 12 * 60 * 60; // X hours

function getCacheKeyForRequest(req) {
	let requestCountry = "";

	const ipAddresses = [
		req.headers["prerender-original-ip"],
		req.headers['x-forwarded-for']
	];

	if (req.connection) {
		ipAddresses.push(req.connection.remoteAddress);
	}

	if (req.socket) {
		ipAddresses.push(req.socket.remoteAddress);
	}

	if (req.connection.socket) {
		ipAddresses.push(req.connection.socket.remoteAddress);
	}

	// try finding geo location from different sources, keep trying until success or tried all.
	ipAddresses.forEach((ip) => {
		if (ip) {
			const geo = geoip.lookup(ip);

			if (!requestCountry && geo && geo.country) {
				requestCountry = geo.country;
			}
		}
	})

	return `${requestCountry}${req.prerender.url}`; // cache by (country, url) key.
}

/* 
middleware available methods:

#### `init()`
#### `requestReceived(req, res, next)`
#### `tabCreated(req, res, next)`
#### `pageLoaded(req, res, next)`
#### `beforeSend(req, res, next)`
*/

module.exports = {
	init: function () {
		this.cache = cacheManager.caching({
			store: 'memory', max: process.env.CACHE_MAXSIZE || 100, ttl: process.env.CACHE_TTL || CACHE_TIME_SECONDS /*seconds*/
		});
	},

	// check if url exists in cache and if it does return the cached response.
	requestReceived: function (req, res, next) {
		this.cache.get(getCacheKeyForRequest(req), function (err, result) {
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
			this.cache.set(getCacheKeyForRequest(req), req.prerender.content);
		}
		next();
	}
};