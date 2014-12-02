####介绍
这是一个用于爬取页面上有用信息数据的小工具。如果我们需要爬取某个页面，只需要在config.txt文件中加入对应页面的url和文件名（具体格式是：url||文件名），同时app.js代码片段中加入对应该页面的处理程序。爬取到的数据会以指定的文件名放入data文件夹下。

####问题
1. nodejs中使用request来获取网页内容的中文乱码问题

如果一个网页使用的是UTF-8编码的话（也就是这样：<meta charset="utf-8" />）是没有什么问题的，如下代码：
```javascript
var request = require('request');
request('http://news.dbanotes.net/', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
})
```

但如果页面使用的是其他request不支持的编码的话，如GBK（如最开始打算爬取的网站是搜房的，但是他们的列表页都是GBK编码）。从request出来的数据data都是乱码，就没法对其进行解析。所以我们可以通过以下方法进行解决：设置encoding属性为null，这样返回的就是Buffer,然后我们自己来编码转换（以下也是通过一个模块iconv-lite来实现），如：
```javascript
var request = require('request');
var iconv = require('iconv-lite');

request({url:'http://news.163.com/', encoding: null}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var str = iconv.decode(body, 'GBK');
        console.log(str);
    }
})
```