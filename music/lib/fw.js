/*
  框架
*/
var http = require('http');
var url = require('url');

module.exports = App; 

/*
处理内容：
1. 中间件的顺序执行
2. get/post的route执行

*/
function App() {
	//中间件
	this.midList = [];
	this.server = http.createServer(handler);

	//路由
	this.getHandlers = {};
	this.postHanlers = {};
	var self = this;

	function handler(req, res) {
		console.log(req.url, '1111111111')
		var index = 0;//中间件执行的顺序
		//默认执行第一个middleware，由next带动执行下一个middleware
		if (!!self.midList.length) {
			self.midList[0](req, res, next);
		}

		function next() {
			if (index < (self.midList.length - 1)) {
				index++;
				self.midList[index](req, res, next);
			} else {
				/*
				  以下对于处理route的部分，如果直接放在next之外，则在中间件中出现异步的情况，执行“处理route”部分代码。
				  这时会出现在异步执行之前，因为执行该部分代码，就直接res.statusCode = 404; res.end()了。
				*/
				//处理route
				var pathname = url.parse(req.url).pathname;
				var isexist = false;
				if (req.method == 'GET') {
					self.getHandlers[pathname] && (self.getHandlers[pathname](req, res), isexist = true);

				} else if (req.method == 'POST') {
					self.postHanlers[pathname] && (self.postHanlers[pathname](req, res), isexist = true);
				}
				if (!isexist) {
					res.statusCode = 404;
					res.end();
				}
			}
		}

		//处理route
		// var pathname = url.parse(req.url).pathname;
		// var isexist = false;
		// if (req.method == 'GET') {
		// 	self.getHandlers[pathname] && (self.getHandlers[pathname](req, res), isexist = true);

		// } else if (req.method == 'POST') {
		// 	self.postHanlers[pathname] && (self.postHanlers[pathname](req, res), isexist = true);
		// }
		// if (!isexist) {
		// 	res.statusCode = 404;
		// 	res.end();
		// }
	
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


