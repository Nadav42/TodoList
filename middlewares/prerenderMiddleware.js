var request = require('request');
var url = require('url');
var zlib = require('zlib');

function isValidRemoteIp(ipAddress) {
	const IP_REGEX = /^.*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	return IP_REGEX.test(ipAddress);
}

var prerender = module.exports = function (req, res, next) {
	if (!prerender.shouldShowPrerenderedPage(req)) return next();

	try {
		prerender.getPrerenderedPageResponse(req, function (err, prerenderedResponse) {
			if (err || !prerenderedResponse) {
				console.log("prerender error", err);
				return next();
			}

			if (prerenderedResponse && prerenderedResponse.statusCode != 200) {
				console.log("prerender ignoring status code", prerenderedResponse.statusCode);
				return next();
			}

			// console.log("cachedRender", prerenderedResponse);
			res.writeHead(prerenderedResponse.statusCode, prerenderedResponse.headers);
			return res.end(prerenderedResponse.body);
		});
	} catch (err) {
		console.log("prerender try / catch error", err);
		return next();
	}
};

prerender.crawlerUserAgents = [
	'googlebot',
	'Yahoo! Slurp',
	'bingbot',
	'yandex',
	'baiduspider',
	'facebookexternalhit',
	'twitterbot',
	'rogerbot',
	'linkedinbot',
	'embedly',
	'quora link preview',
	'showyoubot',
	'outbrain',
	'pinterest/0.',
	'developers.google.com/+/web/snippet',
	'slackbot',
	'vkShare',
	'W3C_Validator',
	'redditbot',
	'Applebot',
	'WhatsApp',
	'flipboard',
	'tumblr',
	'bitlybot',
	'SkypeUriPreview',
	'nuzzel',
	'Discordbot',
	'Google Page Speed',
	'Qwantify',
	'pinterestbot',
	'Bitrix link preview',
	'XING-contenttabreceiver',
	'Chrome-Lighthouse'
];


prerender.extensionsToIgnore = [
	'.js',
	'.css',
	'.xml',
	'.less',
	'.png',
	'.jpg',
	'.jpeg',
	'.gif',
	'.pdf',
	'.doc',
	'.txt',
	'.ico',
	'.rss',
	'.zip',
	'.mp3',
	'.rar',
	'.exe',
	'.wmv',
	'.doc',
	'.avi',
	'.ppt',
	'.mpg',
	'.mpeg',
	'.tif',
	'.wav',
	'.mov',
	'.psd',
	'.ai',
	'.xls',
	'.mp4',
	'.m4a',
	'.swf',
	'.dat',
	'.dmg',
	'.iso',
	'.flv',
	'.m4v',
	'.torrent',
	'.woff',
	'.ttf',
	'.svg',
	'.webmanifest'
];


prerender.whitelisted = function (whitelist) {
	prerender.whitelist = typeof whitelist === 'string' ? [whitelist] : whitelist;
	return this;
};


prerender.blacklisted = function (blacklist) {
	prerender.blacklist = typeof blacklist === 'string' ? [blacklist] : blacklist;
	return this;
};


prerender.shouldShowPrerenderedPage = function (req) {
	var userAgent = req.headers['user-agent']
		, bufferAgent = req.headers['x-bufferbot']
		, isRequestingPrerenderedPage = false;

	if (!userAgent) return false;
	if (req.method != 'GET' && req.method != 'HEAD') return false;
	if (req.headers && req.headers['x-prerender']) return false;

	//if it contains _escaped_fragment_, show prerendered page
	var parsedQuery = url.parse(req.url, true).query;
	if (parsedQuery && parsedQuery['_escaped_fragment_'] !== undefined) isRequestingPrerenderedPage = true;

	//if it is a bot...show prerendered page
	if (prerender.crawlerUserAgents.some(function (crawlerUserAgent) { return userAgent.toLowerCase().indexOf(crawlerUserAgent.toLowerCase()) !== -1; })) isRequestingPrerenderedPage = true;

	//if it is BufferBot...show prerendered page
	if (bufferAgent) isRequestingPrerenderedPage = true;

	//if it is a bot and is requesting a resource...dont prerender
	if (prerender.extensionsToIgnore.some(function (extension) { return req.url.toLowerCase().indexOf(extension) !== -1; })) return false;

	//if it is a bot and not requesting a resource and is not whitelisted...dont prerender
	if (Array.isArray(this.whitelist) && this.whitelist.every(function (whitelisted) { return (new RegExp(whitelisted)).test(req.url) === false; })) return false;

	//if it is a bot and not requesting a resource and is not blacklisted(url or referer)...dont prerender
	if (Array.isArray(this.blacklist) && this.blacklist.some(function (blacklisted) {
		var blacklistedUrl = false
			, blacklistedReferer = false
			, regex = new RegExp(blacklisted);

		blacklistedUrl = regex.test(req.url) === true;
		if (req.headers['referer']) blacklistedReferer = regex.test(req.headers['referer']) === true;

		return blacklistedUrl || blacklistedReferer;
	})) return false;

	return isRequestingPrerenderedPage;
};


prerender.prerenderServerRequestOptions = {};

prerender.getPrerenderedPageResponse = function (req, callback) {
	var options = {
		uri: url.parse(prerender.buildApiUrl(req)),
		followRedirect: false,
		headers: {}
	};
	for (var attrname in this.prerenderServerRequestOptions) { options[attrname] = this.prerenderServerRequestOptions[attrname]; }
	if (this.forwardHeaders === true) {
		Object.keys(req.headers).forEach(function (h) {
			// Forwarding the host header can cause issues with server platforms that require it to match the URL
			if (h == 'host') {
				return;
			}
			options.headers[h] = req.headers[h];
		});
	}
	options.headers['User-Agent'] = req.headers['user-agent'];
	options.headers['Accept-Encoding'] = 'gzip';
	if (this.prerenderToken || process.env.PRERENDER_TOKEN) {
		options.headers['X-Prerender-Token'] = this.prerenderToken || process.env.PRERENDER_TOKEN;
	}

	// save original request ip
	let xForwardedClientIp = req.headers['x-forwarded-for'];

	if (xForwardedClientIp) {
		xForwardedClientIp = req.headers['x-forwarded-for'].split(',')[0]; 	 // x-forwarded-for: client, proxy1, proxy2, proxy3 - we want the original client
	}

	const cloudflareIp = req.headers['cf-connecting-ip'];
	const originalIp = req.query.gl || cloudflareIp || xForwardedClientIp || req.connection.remoteAddress; // store original ip

	console.log("req.query.gl", req.query.gl);
	console.log("cloudflareIp", cloudflareIp);
	console.log("xForwardedClientIp", xForwardedClientIp);
	console.log("req.connection.remoteAddress", req.connection.remoteAddress);

	console.log(originalIp)

	if (originalIp && isValidRemoteIp(originalIp)) {
		// console.log("Injecting originalIp header =", originalIp);
		options.headers["prerender-original-ip"] = originalIp;
	}

	// get html from the prerender server
	try {
		request.get(options).on('response', function (response) {
			if (response.headers['content-encoding'] && response.headers['content-encoding'] === 'gzip') {
				prerender.gunzipResponse(response, callback);
			} else {
				prerender.plainResponse(response, callback);
			}
		}).on('error', function (err) {
			callback(err);
		});
	} catch (err) {
		callback(err);
	}
};

prerender.gunzipResponse = function (response, callback) {
	var gunzip = zlib.createGunzip()
		, content = '';

	gunzip.on('data', function (chunk) {
		content += chunk;
	});
	gunzip.on('end', function () {
		response.body = content;
		delete response.headers['content-encoding'];
		delete response.headers['content-length'];
		callback(null, response);
	});
	gunzip.on('error', function (err) {
		callback(err);
	});

	response.pipe(gunzip);
};

prerender.plainResponse = function (response, callback) {
	var content = '';

	response.on('data', function (chunk) {
		content += chunk;
	});
	response.on('end', function () {
		response.body = content;
		callback(null, response);
	});
};


prerender.buildApiUrl = function (req) {
	var prerenderUrl = prerender.getPrerenderServiceUrl();
	var forwardSlash = prerenderUrl.indexOf('/', prerenderUrl.length - 1) !== -1 ? '' : '/';

	var protocol = req.connection.encrypted ? "https" : "http";
	if (req.headers['cf-visitor']) {
		var match = req.headers['cf-visitor'].match(/"scheme":"(http|https)"/);
		if (match) protocol = match[1];
	}
	if (req.headers['x-forwarded-proto']) {
		protocol = req.headers['x-forwarded-proto'].split(',')[0];
	}
	if (this.protocol) {
		protocol = this.protocol;
	}
	var fullUrl = protocol + "://" + (this.host || req.headers['x-forwarded-host'] || req.headers['host']) + req.url;
	return prerenderUrl + forwardSlash + fullUrl;
};

prerender.getPrerenderServiceUrl = function () {
	return this.prerenderServiceUrl || process.env.PRERENDER_SERVICE_URL || 'https://service.prerender.io/';
};

prerender.set = function (name, value) {
	this[name] = value;
	return this;
};