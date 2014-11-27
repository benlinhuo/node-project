//dom ready
$(function() {
	var listContainer = $('#songContainer');
	(function() {
		init();
		bindEvent();
	})();

	function init() {
		//audioPlayer可以直接使用
		audioPlayer.init();
		//请求歌曲接口
		$.ajax({
			type: 'GET',
			url: '/getSongs',
			data: {
				r: Math.random()
			},
			success: addSongs
		});

		//添加歌曲
		/*
		后台返回的data数据格式：{
			status: 'ok',
			result: []
		}
		*/
		function addSongs(data) {
			if (data.status == 'ok') {
				var results = data.result;
				if (!results.length) {
					return;
				}
				var str = '';
				results.forEach(function(v, i) {
					//数据保存至内存中
					//因为midstatic中间件默认的文件路径是.../music ，所以我们从public开始.此处我们自己构造url
					audioPlayer.add(v, '/public/upload' + v);
					str += '<li class="song-list" index="' + i + '">' + 
					        '<a href="javascript:void(0);" class="song-name">' + (i + 1) + '.  ' + v + '</a>' + 
					        '<a href="javascript:void(0);" class="song-download iconfont">&#xe64c;</a>' +
					        '<a href="javascript:void(0);" class="song-delete iconfont">&#xf003f;</a>';
				});
				listContainer.html(str);
			} else {
				alert('获取歌曲库失败');
			}
			
		}
	}
	
	//各类事件绑定
	function bindEvent() {
		downloadSong();
		deleteSong();
		uploadSong();
		clearAllSongs();
		playPrev();
		playNext();
		pauseOrPlay();
		controlProcess();
	}

	//每首歌曲的下载［后台交互］
	function downloadSong() {
		listContainer.delegate('.song-download', 'click', function() {
			var index = $(this).parent('.song-list').attr('index');
			//下载歌曲，通过歌曲名称匹配
			var name = audioPlayer.playList[index].name;
			//后台下载
			$.ajax({
				type: 'GET',
				url: '/downloadSong',
				data: {name: name},
				success: function(data) {
					if (data && data.status == 'err') {
						alert('下载失败!');
					}
				}
			});
			
		});
	}

	//单首歌曲的删除[后台交互]
	function deleteSong() {
		listContainer.delegate('.song-delete', 'click', function() {
			var index = $(this).parent('.song-list').attr('index');
			//删除歌曲，通过歌曲名称匹配
			var name = audioPlayer.playList[index].name;
			var _this = this;
			//后台删除
			$.ajax({
				type: 'GET',
				url: '/deleteSong',
				data: {name: name},
				success: function(data) {
					if (data.status == 'ok') {
						audioPlayer.delete(index);
						$(_this).parent('.song-list').remove();
						updateSongs();
						alert('删除成功！');
					} else {
						alert('删除失败！');
					}
				}
			});
		});

		//更新每首歌曲的index
		function updateSongs() {
			$('.song-list').each(function(i, v) {
				$(this).attr('index', i);
			});
		}
	}

	//上传歌曲，添加到播放列表。每次只能上传一首[后台交互]
	function uploadSong() {
		$('#fileUpload').on('click', function() {
			//后面再处理
		});	
	}

	//清空所有歌曲库［后台交互］
	function clearAllSongs() {
		$('#clearAll').on('click', function() {
			$.ajax({
				type: 'GET',
				url: '/clearAll',
				success: function(data) {
					if (data.status == 'ok') {
						listContainer.html('');
						audioPlayer.clearAll();
						alert('清空成功!');
					} else {
						alert('清空失败!');
					}
				}
			})
		});
	}

	//上一首歌曲
	function playPrev() {
		$('#btn-prev').on('click', function() {
			audioPlayer.playPrev();
			switchChange();
		});
	}

	//下一首歌曲
	function playNext() {
		$('#btn-next').on('click', function() {
			audioPlayer.playNext();
			switchChange();
		});
	}

	//暂停/播放
	function pauseOrPlay() {
		$('#btn-playpause').on('click', function() {
			if (audioPlayer.currIndex == -1) {
				audioPlayer.play(0);
				switchChange();
			}
			//暂停
			if (audioPlayer.paused) {
				//播放
				audioPlayer.play();
				$(this).removeClass('iconfont2').addClass('iconfont').html('&#xe662;');
			} else {
				audioPlayer.pause();
				$(this).removeClass('iconfont').addClass('iconfont2').html('&#xe6ac;');
			}
		});
	}

	//进度条的控制
	function controlProcess() {
		//timeupdate，当当前的播放时间发生改变的时候触发该事件
		var audioObj = audioPlayer.audioObj;
		var processPlay = $('#progressPlay');
		var processSlide = $('#progressSlider');
		var width = $('.progress').width();
		$(audioObj).on('timeupdate', function() {
			var curT = audioObj.currentTime;
			var allT = audioObj.duration;
			var pos = curT / allT * width;
			processPlay.width(pos);
			processSlide.css('left', pos);	
			if (curT >= allT) {
				//自动播放下一首
				audioPlayer.playNext();
				switchChange();
			}
			
		});
	}

	//设置切换，界面的变化
	var title = $('#songTitle');
	function switchChange() {
		title.html(audioPlayer.playList[audioPlayer.currIndex].name);
		var listSongs = listContainer.find('.song-list');
		listContainer.removeClass('list-current');
		listContainer.eq(audioPlayer.currIndex).addClass('list-current');
	}
});