/*
 解析get请求中的参数
*/

var url = require('url');
var qs = require('querystring');

module.exports = function(req, res, next) {
	var query = url.parse(req.url).query;
	req.query = {};//重置
	query && (req.param = qs.parse(query));
	next();
}