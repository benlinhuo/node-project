var http = require('http');

http.createServer(function(req, res) {

	var fs = require('fs');
	var stream = fs.createReadStream('/Users/benlinhuo/node-project/music/public/upload/郁可唯 - 远方 [mqms2].mp3');
	if (stream && stream.pipe) {
		stream.pipe(res);
	}
	console.log('end');

}).listen(3200);

console.log('is listening at port: 3200');


