/*
读取静态文件（通过url，也可以通过script标签）
原理：通过请求的url获取具体该文件路径，读起该文件并返回。（都是静态文件）
静态资源，我们在引用的时候，只需要写public下面的路径即可。
*/

var url = require('url');
var fs = require('fs');
var domain = require('domain');
var emitter = require('events').EventEmitter;


module.exports = function(dir) { 

	return function(req, res, next) {
		var pathname = decodeURI(dir + url.parse(req.url).pathname).replace(/\/$/, '');
		var d = domain.create();
		d.on('error', function() {
			console.log('read file error!');
			next();
		});
		d.add(fs);
		d.run(function() {
			var stream = fs.createReadStream(pathname);
			if (stream && stream.pipe) {
				stream.pipe(res);
			} else {
				next();
			}
		});
	}	

}

/// express框架send.js
// SendStream.prototype.stream = function(path, options){
//   // TODO: this is all lame, refactor meeee
//   var self = this;
//   var res = this.res;
//   var req = this.req;

//   // pipe
//   var stream = fs.createReadStream(path, options);
//   this.emit('stream', stream);
//   stream.pipe(res);

//   // socket closed, done with the fd
//   req.on('close', stream.destroy.bind(stream));

//   // error handling code-smell
//   stream.on('error', function(err){
//     // no hope in responding
//     if (res._header) {
//       console.error(err.stack);
//       req.destroy();
//       return;
//     }

//     // 500
//     err.status = 500;
//     self.emit('error', err);
//   });

//   // end
//   stream.on('end', function(){
//     self.emit('end');
//   });
// };







//读取大文件，当是大文件时，使用readFile读取会抛出err。思路：使用流读取
// function readBigFile(pathname, res, next) {
// 	console.log(pathname)
// 	var d = domain.create();
// 	d.on('error', function() {
// 		console.log('read file error!');
// 		next();
// 	});
// 	d.add(fs);
// 	d.run(function() {
// 		var rs = fs.createReadStream(pathname, {highWaterMark: 5});
// 		var dataArr = [], len = 0, data;
// 		rs.on('data', function(chunk) {
// 			dataArr.push(chunk);
// 			len +=  chunk.length;
// 		});

// 		rs.on('end', function() {
// 			data = Buffer.concat(dataArr, len);
// 			console.log(data.toString());
// 			res.writeHead(200, {
// 				'Vary':'Accept-Encoding'
// 			});
// 			res.end(data);
// 		});
// 	});
// }
















