module.exports = {
	tabCreated: (req, res, next) => {
		const headersToPass = ['prerender-original-ip'];

		// add header that marks it as prerender
		let tabHeaders = {
			'X-Prerender': '1'
		}

		// copy whitelisted headers from original request
		headersToPass.forEach(headerKey => {
			if (req.headers[headerKey]) {
				tabHeaders[headerKey] = req.headers[headerKey];
			}
		});

		// add the headers to the tab network request
		req.prerender.tab.Network.setExtraHTTPHeaders({
			headers: tabHeaders
		});

		next();
	}
}