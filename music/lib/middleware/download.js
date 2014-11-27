/*
	下载中间件
*/

var path = require('path');
var fs = require('fs');

//dir是下载的路径(/upload/)
module.exports = function(dir) {
	return function(req, res, next) {
		res.download = function(filename) {
			var filepath = path.normalize(dir + filename);
			fs.readFile(filepath, function(err, data) {
				//因未指定编码，所以data是原生buffer
				data = new Buffer(data);
				if (err || Buffer.isBuffer(data)) {
					//json是中间件
					res.json({status: 'err'});
				} else {
					res.writeHead(200, {
						'Content-disposition': 'attachment; filename=' + filename,
						'Content-Type': 'application/octet-stream',//二进制类型
						'Content-Length': data.length
					});
					res.end(data);
				}
			});
		}
		next();
	}
}


// if (Buffer.isBuffer(buf)) {
// 			//设置头
// 			res.writeHead(200, {
// 				//设置下载文件名称
// 				'Content-disposition': 'attachment; filename=' + filename,
// 				//保证是二进制类型，这样浏览器可用下载方式
// 				'Content-Type': 'application/octet-stream',
// 				//设置buf大小
// 				'Content-Length': buf.length 
// 			});
// 			//响应
// 			res.end(buf);
// 		} else {
// 			res.end();
// 		}