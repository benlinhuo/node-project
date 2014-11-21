var url = require('url');

//重定向
module.exports = function(req, res, next) {//中间件模式
	//当引用该中间件后，res就有了redirect
	res.redirect = function(url) {
		res.writeHead(302, {
			Location: getUrl(url, req);
		});
		res.end();
	}
}


function getUrl(url, req) {
	var host = req.headers.host;
	
	if (/^http:/.test(url)) {
		return url;
	} else if (/^\//.test(url)) {//绝对路径
		return host + url;
	} else {//相对路径
		return host + req.url + '/' + url;
	}
}