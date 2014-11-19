var request = require('request'),
	cheerio = require('cheerio'),
	fs = require('fs'),
	http = require('http');

/*
  配置文件名	
  其中的每行数据，文件名除去后缀名之后，最好都是由数字或字母组成（后面会作为函数名，所以需要符合函数名命名规范）
*/
var configName = 'config.txt';
//每隔多长时间爬取一次（针对每个页面）
var intervalTime = 5 * 60 * 1000;

crawler();
http.createServer(function(req, res) {
	//只有node app.js部分的代码执行完成了，才会返回给客户端（res.end）
	res.end('Complete!');
}).listen(3002);


//爬虫的总函数
function crawler() {
	var configArr = readConfig(configName);
	// setInterval(function() {
		configArr.forEach(function(line, index) {
			distributeFn(line.url, line.saveName);
		});

	// }, intervalTime);
}

/*
  根据不同的页面，分配不同的处理函数抓取数据。
  当我们需要增加页面的抓取数据时，不仅需要在config配置文件中，增加对应内容，还需要增加该页面的处理函数
  @param fnName 函数名字（用文件名命名）
*/
function distributeFn(url, fnName) {
	request(url, function(err, res, body) {   
		if (!err && res.statusCode == 200) { 
			var fn = fnName.split('.').length ? fnName.split('.')[0] : fnName;
			switch(fn) {
				case 'sale':
					saleajk(body, fnName);
					break;
				case 'rent':
					rentajk(body, fnName);
					break;
				default: 
					saleajk(body, fnName);
			}
		}
	});

	/*
	 以下为不同页面的处理函数
	*/
	//二手房列表页（ajk）
	function saleajk(body, filename) {
		var $ = cheerio.load(body);
		var lineStr = '', data = [];
		//经过cheerio中间件的转换，我们可以像前台一样操作返回的body数据

		$('.pL .list li').each(function(i) {
			lineStr += 'title:' + $(this).find($('.t')).text();
			lineStr += ';   des:' + $(this).find($('.details')).find('div').eq(1).remove('span').text().replace(/\n/g, '');
			lineStr += ';   address:' + $(this).find($('.community_name')).text().replace(/\n/g, '');
			data.push(lineStr);
			//重置
			lineStr = '';
		});
		writeData(data.join('\n'), filename);
	}

	//租房列表页（ajk）
	function rentajk(body, filename) {
		var $ = cheerio.load(body);
		var lineStr = '', data = [];

		$('.dd_info').each(function(i) {
			lineStr += 'title:' + $(this).find('h3').find('a').text();
			lineStr += ';  address:' + $(this).find('address').text();
			lineStr += ';  des:' + $(this).find($('.p_tag')).remove('span').text().replace(/\n/g, '');
			data.push(lineStr);
			//重置
			lineStr = '';
		});
		
		writeData(data.join('\n'), filename);
	}
}

/*
  读取配置文件
  该配置文件内容的形式为：要抓取的页面url||要存储的文件名
  @param configName 配置文件的名字
  @return 以{url, saveName}数组形式返回该配置文件的内容
*/
function readConfig(configName) {
	var data = fs.readFileSync(configName, {encoding: 'utf8'});
	if (data) {
		var lines = data.split(/\n/gi);
		var config = [];
		lines.forEach(function(line, index) {
			if (line) {
				//一行数据之间用“||”符号间隔页面url和该页面抓取的数据存储的文件名
				var vals = line.split('||');
				config.push({
					url: vals[0],
					saveName: vals[1]
				});
			}
		});
		return config;
	}
	return null;
}

/*
  将指定内容写入到指定文件中
  @param data 需要写入文件中的数据
  @param filename 被写入数据的文件名
  @return flag true表示成功，false表示失败
*/
function writeData(data, filename) {
	filename = 'data/' + filename;
	fs.appendFile(filename, data, function(err) {
		if (err) {
			return false;
		} else {
			return true;
		}
	});
}




