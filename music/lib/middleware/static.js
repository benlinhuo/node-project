/*
读取静态文件（通过url，也可以通过script标签）
原理：通过请求的url获取具体该文件路径，读起该文件并返回。（都是静态文件）
静态资源，我们在引用的时候，只需要写public下面的路径即可。
*/

var url = require('url');
var fs = require('fs');


module.exports = function(dir) { 

	return function(req, res, next) {
		var pathname = (dir + url.parse(req.url).pathname).replace(/\/$/, '');
		fs.readFile(pathname, function(err, data) { 
			//如果有错的话，表示请求的不是静态文件，可能是个接口
			if (err) {
				next();
				return;
			} 

			//如果正确读取到了数据data，则可以返回该请求，结束它了
			res.writeHead(200, {
				'Vary':'Accept-Encoding'
			})
			res.write(data);
			res.end();
		});

	}	

}






