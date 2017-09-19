var obj = {
	// dataPointer
	// dataPointer: [
	//     [100.340417, 27.376994],
	//     [113.392174, 31.208439],
	//     [124.905846, 42.232876],
	//     [108.426354, 37.827452],
	//     [100.340417, 27.376994],
	// ]
	datalist: {},
	weilanlist: {
		gd: {
			data: null,
			isshow: false
		},
		xnc: {
			data: null,
			isshow: false
		},
		jq: {
			data: null,
			isshow: false
		},
		xsq: {
			data: null,
			isshow: false
		},
	},
}
$(function() {
	gaodemap.init();

	$.fn.datetimepicker.dates['zh'] = {  
                days:       ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六","星期日"],  
                daysShort:  ["日", "一", "二", "三", "四", "五", "六","日"],  
                daysMin:    ["日", "一", "二", "三", "四", "五", "六","日"],  
                months:     ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月","十二月"],  
                monthsShort:  ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],  
                meridiem:    ["上午", "下午"],  
                //suffix:      ["st", "nd", "rd", "th"],  
                today:       "今天"  
        };  
	$(".form_datetime-meridian").datetimepicker({
		language:  'zh',  
		format: "yyyy-mm-dd hh:ii",
		showMeridian: true,
		autoclose: true,
		todayBtn: true,
		pickerPosition: "bottom-left"
	});
	$("#searchbody").niceScroll({
		styler: "fb",
		cursorcolor: "#e8403f",
		cursorwidth: '6',
		cursorborderradius: '10px',
		background: '#404040',
		spacebarenabled: false,
		cursorborder: '',
		zindex: '1000'
	});
	$('body').on('click', '#mapsearchbtn', function(event) { //搜索
		var dt1 = $('#dt1');
		var dt2 = $('#dt2');
		var cph = $('#cph');
		if (dt1.val().length <= 0) {
			return;
		} else if (dt2.val().length <= 0) {
			return;
		} else if (cph.val().length <= 0) {
			return;
		}
		$('#searchcontext').css({ 'height': '200px' }).fadeIn();
		// 搜索内容返回
		$("#searchbody").empty();
		$("#searchbody").append($(`
            <div class="searchloading">
                <img src="img/loadingimage.gif" />
            </div>
        `));
		$.ajax({
			url: traceData.path,
			data: { stime: dt1.val(), etime: dt2.val(), veNo: cph.val() },
			type: traceData.type,
			dataType: 'json',
			// async: false,
			success: function(data) {
				console.log(data);
				if (data.result) {
					obj.datalist = [];
					setTimeout(function() {
						$("#searchbody").empty();
						var html = "";
						for (var i = 0; i < data.data.length; i++) {
							obj.datalist[data.data[i].id] = data.data[i];
							html += `
                        <div attr-id=${data.data[i].id} class="resultbody form-horizontal">
                            <div class="resultcontext">
                                <div class="resultleft">
                                    <div class="resultinput"><span class="resultnumber">${i + 1}.</span><span class="resulttite">${data.data[i].cph}</span></div>
                                    <div class="resultinput"><span class="left">${data.data[i].ptname1}</span><span class="sep"><i class="fa fa-arrow-right"></i></span><span class="right">${data.data[i].ptname2}</span></div>
                                    <div class="resultinput"><span class="left">${data.data[i].ptname2}</span><span class="sep"><i class="fa fa-arrow-right"></i></span><span class="right">${data.data[i].ptname3}</span></div>
                                    <div class="resultinput"><span class="date">${data.data[i].dt1}</span><span class="date"> - </span><span class="date">${data.data[i].dt2}</span></div>
                                </div>
                                <div class="resultright">
                                    <div class="resultplaybtn"><i class="fa fa-play-circle"></i></div>
                                </div>
                            </div>
                        </div>
                        `
						}
						$("#searchbody").append($(html));
						$('#searchcontext').removeAttr('style').css({ 'display': 'block' });
					}, 500);
				}
			},
			error: function(res) {
				console.log(traceData.path, res);
			}
		})
		// getData('json/车辆轨迹地图/获取搜索数据.json', {
		//     time: '2017-10-01'
		// });


	}).on('click', '#gongdi', function() {
		getweilanpt('gd');
	}).on('click', '#xiaonachang', function() {
		getweilanpt('xnc');
	}).on('click', '#jinqu', function() {
		getweilanpt('jq');
	}).on('click', '#xiansuquan', function() {
		getweilanpt('xsq');
	}).on('click', '.closeresultbody', function() {
		$('#searchcontext').fadeOut();
	}).on('click', '.resultplaybtn', function() {
		if (mapobj.pathSimplifierInses.length <= 10) {
			var dt1 = $('#dt1');
			var dt2 = $('#dt2');
			var cph = $('#cph');
			if (dt1.val().length <= 0) {
				return;
			} else if (dt2.val().length <= 0) {
				return;
			} else if (cph.val().length <= 0) {
				return;
			}
			var $this = $(this);
			var activeId = $this.parents('.resultbody').attr('attr-id');
			var $loadingimage = $('#loadingimage');
			var $zzjz = $(`<div style="font-size: 5px;margin-left: -9px;">正在加载</div>`);
			if ($this.find('div').length <= 0) {
				$this.append($zzjz);
			}
			if (mapobj.pathSimplifierInses.length <= 0)
				$loadingimage.fadeIn();
			$.ajax({
				url: tracePoint.path,
				data: { stime: dt1.val(), etime: dt2.val(), veNo: cph.val() },
				type: tracePoint.type,
				dataType: 'json',
				// async: false,
				success: function(data) { //ajax返回的数据
					console.log(data);
					if (data.result) {
						if (mapobj.pathSimplifierInses.length <= 10) {
							gaodemap.addpathSimplifierIns(obj.datalist[activeId], data.data);
						} else { 
							var $alertmessage = $('#alertmessage');
							gaodemap.showalert('播放失败，播放队列最多只允许10个。', 2);
							if (clkztimeout)
								clearTimeout(clkztimeout);
							clkztimeout = setTimeout(function() {
								$alertmessage.fadeOut();
							}, 3000);
						}
					}
					$loadingimage.fadeOut();
					$zzjz.remove();
				},
				error: function(res) {
					console.log(tracePoint.path, res);
					$loadingimage.fadeOut();
					$zzjz.remove();
				}
			})
		} else {
			var $alertmessage = $('#alertmessage');
			gaodemap.showalert('播放失败，播放队列最多只允许10个。', 2);
			if (clkztimeout)
				clearTimeout(clkztimeout);
			clkztimeout = setTimeout(function() {
				$alertmessage.fadeOut();
			}, 3000);
		}
	});

	// 
	$("#goStart").colorTip({ color: 'white', direction: 'left' });
	$("#goStop").colorTip({ color: 'white', direction: 'right' });
	$("#playSpeed1").colorTip({ color: 'white', direction: 'up' });
	$("#playSpeed2").colorTip({ color: 'white', direction: 'up' });
	$("#playSpeed3").colorTip({ color: 'white', direction: 'up' });

	// 消纳厂，限速圈等点击事件
	function getweilanpt(wltype) {
		if (mapobj.localist[wltype] && mapobj.localist[wltype].isshow) {
			mapobj.localist[wltype].isshow = false;
			gaodemap.rmoveandupdateMarkers(null, wltype, false);
		} else {
			var $loadingimage = $('#loadingimage');
			$loadingimage.fadeIn();
			$.ajax({
				url: areaPoint.path+wltype,
				// data: {},
				type: areaPoint.type,
				dataType: 'json',
				// async: false,
				success: function(data) { //ajax返回的数据
					console.log(data);
					if (data.result) {
						if (!mapobj.localist[wltype])
							mapobj.localist[wltype] = {};
						mapobj.localist[wltype].isshow = true;
						gaodemap.rmoveandupdateMarkers(data.data, wltype, true);
					}
					$loadingimage.fadeOut();
				},
				error: function(res) {
					console.log(areaPoint.path,res);
					$loadingimage.fadeOut();
				}
			})
		}
	}
});

function mergeJsonObject(jsonbject1, jsonbject2, jsonbject3, jsonbject4) {
	var resultJsonObject = [];
	for (var attr in jsonbject1) {
		resultJsonObject.push(jsonbject1[attr]);
	}
	for (var attr in jsonbject2) {
		resultJsonObject.push(jsonbject2[attr]);
	}
	for (var attr in jsonbject3) {
		resultJsonObject.push(jsonbject3[attr]);
	}
	for (var attr in jsonbject4) {
		resultJsonObject.push(jsonbject4[attr]);
	}

	return resultJsonObject;
};
// 请求数据方法
function getData(url, params) {
	$.ajax({
		type: 'get',
		url: url,
		data: params,
		dataType: 'json',
		success: function(res) {
			// console.dir(res);
			return res;
		},
		error: function(res) {

		}
	})
}