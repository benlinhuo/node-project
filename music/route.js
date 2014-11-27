//处理该应用程序的所有接口
var path = require('path');
var fs = require('fs');

module.exports = function(app) {
	//获取所有歌曲库内容
	app.get('/getSongs', function(req, res) {  
		var pathname = path.normalize(__dirname + '/public/upload');
		fs.readdir(pathname, function(err, files) {
			if (err) {
				res.json({status: 'err'});
			} else {
				
				//此处没有传音频文件的路径，理论上是需要后台传，不过多了一层循环
				res.json({
					status: 'ok',
					result: files
				});
			}
		});
	});

	//下载歌曲
	app.get('/downloadSong', function(req, res) {
		res.download(req.param.name);
	});

	//歌曲删除
	app.get('/deleteSong', function(req, res) {
		var filepath = path.join(__dirname, 'public/upload', req.param.name);
		fs.unlink(filepath, function(err) {
			if (err) {
				res.json({status: 'err'});
			} else {
				res.json({status: 'ok'});
			}
		});
	});

	//上传歌曲


	//清空歌曲库
	app.get('/clearAll', function(req, res) {
		var dirpath = path.join(__dirname, 'public/upload');
		//先删除该目录，再重建该目录(因为该目录不为空，所以不可以删除。err。可以测试一个空目录)
		fs.readdir(dirpath, function(err, files) {
			if (err) {
				res.json({status: 'err'});
			} else {
				var filepath;
				files.forEach(function(v, i) {
				    filepath = path.join(dirpath, v);
				    fs.unlinkSync(filepath);
				});
				fs.readdir(dirpath, function(err, fls) {
					if (err) {
						res.json({status: 'err'});
					} else {
						fls.length == 0 ? res.json({status: 'ok'}) : res.json({status: 'err'});
					}
				});

			}
		})
	});
}