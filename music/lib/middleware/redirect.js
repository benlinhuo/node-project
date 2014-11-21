
//重定向
module.exports = function(req, res, next) {//中间件模式
	//当引用该中间件后，res就有了redirect
	res.redirect = function(url) {
		res.writeHead(302, {
			Location: getUrl(url, res);
		});
		res.end();
	}
}


function getUrl(url, res) {
	
}