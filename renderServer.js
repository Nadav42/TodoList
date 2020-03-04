// documentation about all options:
// https://github.com/prerender/prerender/blob/master/README.md

const prerender = require('prerender');
const server = prerender(options = {
    port: 8000
});
server.start();