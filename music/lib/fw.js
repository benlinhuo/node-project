/*
  框架
*/
module.exports = App; 

/*
处理内容：
1. 中间件的顺序执行
2. get/post的route执行

*/
function App() {
	//中间件
	this.midList = [];
	var index = 0;//中间件执行的顺序
	this.server = http.createSever(hanlder);

	//路由
	this.getHandlers = {};
	this.postHanlers = {};

	function handler(req, res) {
		//默认执行第一个middleware，由next带动执行下一个middleware
		if (!!this.midList.length) {
			index++;
			this.midList[0](req, res, next);
			return;
		}

		function next() {
			if (index < this.midList.length) {
				this.midList[index](req, res, next);
				index++:
			}
		}

		//处理route
		var pathname = url.parse(req.url).pathname;
		var isexist = false;
		if (req.method == 'GET') {
			this.getHandlers[pathname] && (this.getHandlers[pathname](req, res), isexist = true);

		} else if (req.method == 'POST') {
			this.postHanlers[pathname] && (this.postHanlers[pathname](req, res), isexist = true);
		}
		if (!isexist) {
			res.statusCode = 404;
			res.end();
		}
	}
}

App.prototype.use = function(middleWare) {
	this.midList.push(middleWare);
}

App.prototype.get = function(route, fn) {
	this.getHandlers[route] = fn;
}

App.prototype.post = function(route, fn) {
	this.postHanlers[route] = fn;
}

App.prototype.listen = function(port) {
	this.server.listen.call(this.server, port);
}