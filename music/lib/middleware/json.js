/*
	res.json()
*/

module.exports = function(req, res, next) {
	res.json = function(retData) {
		res.writeHead(200, {
			'Content-Type': 'application/json; charset=utf-8'
		});
		res.end(JSON.stringify(retData));
	}
	next();
}
