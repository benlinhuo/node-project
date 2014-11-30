/*
	下载中间件
*/

var path = require('path');
var fs = require('fs');

//dir是下载的路径(/upload/)
module.exports = function(dir) {
	return function(req, res, next) { console.log(res.end.toString(), 'before');
		res.download = function(filename) {
			var filepath = path.normalize(dir + filename);
			console.log(filepath, 'filepath');
			filepath = '/Users/benlinhuo/node-project/music/public/style/style.css';
			var stream = fs.createReadStream(filepath);
			var dataArr = [], len = 0, data;
			stream.on('data', function(chunk) {
				console.log('11111daata')
				dataArr.push(chunk);
				len += chunk.length;
			});

			stream.on('end', function() {
				data = Buffer.concat(dataArr, len);
				console.log('22222222end');
				data = new Buffer('sfdsdfsdfsdf');
				// res.writeHead(200, {
				// 	'Content-disposition': 'attachment; filename=' + 'xxx.css',
				// 	'Content-Type': 'application/octet-stream',//二进制类型
				// 	'Content-Length': len
				// });
				res.writeHead(200, {
				//设置下载文件名称
				'Content-disposition': 'attachment; filename=' + 'xxx.css',
				//保证是二进制类型，这样浏览器可用下载方式
				'Content-Type': 'application/octet-stream',
				//设置buf大小
				'Content-Length': len 
			});
				console.log(data.toString());
				console.log('######################################################################')
				console.log(res.end.toString(), 'after')
				res.end(data);
			});

		}
		next();
	}
}

// module.exports = function(req, res, next) {
// 	res.download = function(filename, buf) {
// 		//判断buf是否是Buffer对象
// 		if (Buffer.isBuffer(buf)) {
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

// 	}
// 	next();
// }



