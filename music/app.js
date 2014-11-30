var fw = require('./lib');
	app = new fw.App(),
	midstatic = fw.midstatic,
	download = fw.download,
	json = fw.json,
	param = fw.param,
	post = fw.post,
	redirect = fw.redirect;
var url = require('url'),
	fs = require('fs');

var route = require('./route');

app.use(param);
//app.use(post);//文件上传（req.files）以及其他post请求（req.body）
app.use(json);//download之前，download使用了json方法
app.use(redirect);	
app.use(midstatic(__dirname));
app.use(download(__dirname + '/public/upload/'));


//让“／”重定向到"/views/index.html"
app.get('/', function(req, res) {
	res.redirect('views/index.html');
});

//redirect
app.get('/views/index.html', function(req, res) {
	var pathname = url.parse(req.url).pathname;
	var path = __dirname + pathname;
	fs.readFile(path, function(err, data) {
		if (err) {
			res.statusCode = 404;
			res.end();
		} else {
			res.end(data);
		}
	});
});

//关于接口的所有路由都在route中
route(app);

app.listen('3001');
console.log('listening at port: 3001');


// 待做：
// 1. 小图标：favicon
// 2. form表单上传文件
// 3. 下载文件（读取出来的文件内容，如何转化为buffer）

//CMD:Common Module Definition

