//构造我们的播放对象(以key-value形式定义)
var audioPlayer = {
	//属性
	audioObj: null, 
	currIndex: -1, //当前播放的歌曲索引值
	playList: [], //歌曲播放列表，每首歌曲有name（展示）和url（播放src）属性
	//方法
	init: function() {
		//因浏览器的兼容性，我们使用chrome（或者safari，不支持ogg格式）测试，所以只允许上传.mp3格式的音频
		this.audioObj = $('<audio id="player"></audio>')[0];//转成原生对象
		this.currIndex = -1;
	},

	//播放指定歌曲
	play: function(index) {
		//歌曲库为空
		if (!this.playList.length) {
			return;
		}
		if (index < 0) {
			index = this.playList.length - 1;
		} else if (index >= this.playList.length) {
			index = 0;
		}
		//如果指定歌曲是正在播放的歌曲，则不做处理
		if (index == this.currIndex) {
			return;
		}
		//否则，需要先停止当前歌曲的播放，设置index指向的歌曲url进行播放
		this.audioObj.stop();
		this.audioObj.src = this.playList[index].url;
		//歌曲已经载入完全完成
		$(this.audioObj).on('canplaythrough', function() {
			this.audioObj.play();
		});
		currIndex = index;
	},

	//暂停
	pause: function() {
		this.audioObj.pause();
	},

	//下一首
	palyNext: function() {
		this.play(this.currIndex + 1);
	},

	//上一首
	playPrev: function() {
		this.play(this.currIndex - 1);
	},

	//添加一首新歌
	add: function(name, url) {
		this.playList.push({'name': name, 'url': url});
	},

	//删除一首
	delete: function(index) {
		this.playList.splice(index, 1)
		// delete this.playList[index];
	},

	//清除所有歌曲
	clearAll: function() {
		this.playList.length = 0;
		this.currIndex = -1;
	}

}