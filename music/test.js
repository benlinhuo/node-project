var fs = require('fs');
var rs = fs.createReadStream('/Users/benlinhuo/node-project/music/public/upload/mp3%20is%20here', {highWaterMark: 5});
var dataArr = [], len = 0, data;

rs.on('data', function(chunk) {
	dataArr.push(chunk);//Buffer
	len += chunk.length;		
});

rs.on('end', function() {
	data = Buffer.concat(dataArr, len).toString();		
	console.log(data);
});



