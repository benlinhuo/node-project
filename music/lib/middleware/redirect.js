var path = require('path');
//重定向
module.exports = function(req, res, next) {//中间件模式
	//当引用该中间件后，res就有了redirect
	res.redirect = function(redUrl) {
		var geturl = getUrl(redUrl, req);
		res.writeHead(302, {
			Location: geturl
		});
		
		res.end();
	}
	next();
}


function getUrl(url, req) {
	var host = req.headers.host;
	host = /^http/.test(host) ? host : 'http://' + host;
	if (/^http:/.test(url)) {
		return url;
	} else if (/^\//.test(url)) {//绝对路径
		return host + path.normalize('/' + url);
	} else {//相对路径
		return host + path.normalize('/' + req.url + '/' + url);
	}
}