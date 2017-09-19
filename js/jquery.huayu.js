$(function() {
	gaodemap.init();
	getinit();
	setInterval(function() {
		getupdate();
	}, 5 * 60 * 1000);
	var clkztimeout;

	$('body').on('click', '#gongdi', function() {
		getweilanpt('gd');
	}).on('click', '#xiaonachang', function() {
		getweilanpt('xnc');
	}).on('click', '#jinqu', function() {
		getweilanpt('jq');
	}).on('click', '#xiansuquan', function() {
		getweilanpt('xsq');
	}).on('click', '#clkzbtn', function(event) { //车辆控制
		var $clkzcontext = $('#clkzcontext');
		$clkzcontext.empty();
		$clkzcontext.append($(`
		<div class="loadingimage">
		    <img src="img/loadingimage.gif" />
		</div>
		`));
		$.ajax({
			url: "json/车辆定位地图/通过车辆id获取车辆控制.json",
			// data: {},
			// type: 'POST',
			dataType: "json",
			// async: false,
			success: function(data) { //ajax返回的数据
				console.log(data);
				if (data.result) {
					setTimeout(function() {
						$clkzcontext.empty();
						$clkzcontext.append($(`
                            <table class="clkzcontext">
                                <tr>
                                    <td class="clkzcontext-td">
                                        <button type="button" class="btn btn-shadow btn-danger" id="clkz_sj" title="远程把车锁了" data-toggle="modal" href="#myModal6">锁机</button>
                                    </td>
                                    <td class="clkzcontext-td">
                                        <button type="button" class="btn btn-shadow btn-success" id="clkz_js">解锁</button>
                                    </td>
                                    <td class="clkzcontext-td"> </td>
                                    <td class="clkzcontext-td"> </td>
                                    <td class="clkzcontext-td"> </td>
                                </tr>
                                <tr>
                                    <td>
                                        <button type="button" class="btn btn-shadow btn-danger" id="clkz_xzjs">限制举升</button>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-shadow btn-success" id="clkz_jcxzjs">解除限制举升</button>
                                    </td>
                                    <td></td><td></td><td></td>
                                </tr>
                                <tr>
                                    <td>
                                        <button type="button" class="btn btn-shadow btn-danger" id="clkz_qyzw">启用指纹</button>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-shadow btn-success" id="clkz_tyzw">停用指纹</button>
                                    </td>
                                    <td></td><td></td><td></td>
                                </tr>
                                <tr>
                                    <td>
                                        <button type="button" class="btn btn-shadow btn-danger" id="clkz_qygk1">启用管控(1)</button>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-shadow btn-success" id="clkz_qygk2">启用管控(2)</button>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-shadow btn-danger" id="clkz_qygk3">启用管控(3)</button>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-shadow btn-success" id="clkz_qygk7">启用管控(7)</button>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-shadow btn-danger" id="clkz_tygk">停用管控</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <button type="button" class="btn btn-shadow btn-warning" style="width: 215px;" id="clkz_pz">拍照</button>
                                    </td>
                                    <td></td><td></td><td></td><td></td>
                                </tr>
                                <tr>
                                    <td>
                                        <button type="button" class="btn btn-shadow btn-danger" id="clkz_clxs">车辆限速</button>
                                    </td>
                                    <td colspan="2">
                                        <div style="float: left;width: 70%;"><input id="title" type="text" class="form-control"  placeholder="限速的最大速度"></div>
                                        <div style="float: left;width: 30%;height: 37px;line-height: 35px;padding: 0 0 0 10px;"><span>km/h</span></div>
                                    </td>
                                    <td></td><td></td>
                                </tr>
                                <tr>
                                    <td>
                                        <button type="button" class="btn btn-shadow btn-danger" id="clkz_xxts">信息提示</button>
                                    </td>
                                    <td colspan="2">
                                        <textarea class="form-control" id="message" rows="3" placeholder="需要提示的信息内容" ></textarea>
                                    </td>
                                    <td></td><td></td>
                                </tr>
                                <tr>
                                    <td colspan="5">
                                        <div style="float: left;width: 20%;">设置命令状态：</div>
                                        <div style="float: left;width: 80%;">${data.data.mlzz}</div>
                                    </td>
                                </tr>
                            </table>
                        `));
						$('#clkz_sj').colorTip({ color: 'white', direction: 'down' });
					}, 400);
				}
			},
			error: function(res) {
				//console.log(tracePoint.path, res);
				console.log( res);
			}
		});
	}).on('click', '#quanpingbtn button', function(event) {
		fullScreen();
	}).on('click', '#huanyuanbtn button', function(event) {
		exitFullScreen();
	}).on('click', 'table .hzzshow', function(event) { //核准证
		var $hzzcontext = $('#hzzcontext');
		$hzzcontext.empty();
		$hzzcontext.append($(`
		<div class="loadingimage">
		    <img src="img/loadingimage.gif" />
		</div>
		`));
		$.ajax({
			url: CLcreet.path + $(this).attr('ref'),
			// data: {},
			type: CLcreet.type,
			dataType: "json",
			// async: false,
			success: function(data) { //ajax返回的数据
				console.log(data);
				if (data.result) {
					setTimeout(function() {
						$hzzcontext.empty();
						$hzzcontext.append($(`
                            <table class="hzzcontext">
                                <tr>
                                    <td class="hzzcontext-td">工地名称：</td><td>${data.data.gdmc}</td>
                                </tr>
                                <tr>
                                    <td>工程名称：</td><td>${data.data.gcmc}</td>
                                </tr>
                                <tr>
                                    <td>线路描述：</td><td>${data.data.xlms}</td>
                                </tr>
                                <tr>
                                    <td>消纳厂名称：</td><td>${data.data.xncmc}</td>
                                </tr>
                                <tr>
                                    <td>开始日期：</td><td>${data.data.ksrq}</td>
                                </tr>
                                <tr>
                                    <td>结束日期：</td><td>${data.data.jsrq}</td>
                                </tr>
                                <tr>
                                    <td>开始时间：</td><td>${data.data.kssj}</td>
                                </tr>
                                <tr>
                                    <td>结束时间：</td><td>${data.data.jssj}</td>
                                </tr>
                            </table>
                        `));
					}, 400);
				}
			},
			error: function(res) {
				console.log(CLcreet.path, res);
			}
		});
	}).on('click', '#mapsearchbtn', function(event) { //搜索
		var veNo = $('#searchinput').val(); //搜索输入值
		$.ajax({
			url: searchPath.path,
			data: {param:veNo},
			type: searchPath.type,
			dataType: "json",
			// async: false,
			success: function(data) { //ajax返回的数据
				console.log(data)
				if (data.result) {
					// mapobj.alllist[data.data.id].click();
					gaodemap.showinfoWindow(data.data.id);
					// gaodemap.showMarker(data.data.id, 'cl');
				}
			},
			error: function(res) {
				console.log(tracePoint.path, res);
			}
		});
	}).on('keyup','#searchinput',function(){
		$("#searchContent").css('display','block')
		var vNo = $('#searchinput').val();
		if(vNo){
			$.post(
				"http://zbusmgr.huayusoft.com:9888/busPlat/rest/mapData/queryVe",
				"veNo="+ vNo,
				function(data){
					var str = '';
					for(var i = 0;i<data.length;i++){
						str += '<li><a href="#">'+data[i].veNo+'</a></li>';
					}
					$("#searchContent").html(str);
				},
				"json"
			);
		}else{
			$("#searchContent").css('display','none')
		}


	}).on('click','#searchContent li a',function(){
		//console.log($(this).html()+'哈哈123')
		$('#searchinput').val($(this).html());
		$("#searchContent").css('display','none');

	}).on('click', '#clkz_sj', function(event) { //锁机
		$('#confirmcontext').html('确定进行远程锁车操作？').attr({ 'data-ref': 'clkz_sj' });
	}).on('click', '#clkz_js', function(event) { //解锁
		var $alertmessage = $('#alertmessage');
		showalert('解锁', 1);
		if (clkztimeout)
			clearTimeout(clkztimeout);
		clkztimeout = setTimeout(function() {
			$alertmessage.fadeOut();
		}, 3000);
	}).on('click', '#clkz_xzjs', function(event) { //限制举升
		var $alertmessage = $('#alertmessage');
		showalert('限制举升', 1);
		if (clkztimeout)
			clearTimeout(clkztimeout);
		clkztimeout = setTimeout(function() {
			$alertmessage.fadeOut();
		}, 3000);
	}).on('click', '#clkz_jcxzjs', function(event) { //解除限制举升
		var $alertmessage = $('#alertmessage');
		showalert('解除限制举升', 1);
		if (clkztimeout)
			clearTimeout(clkztimeout);
		clkztimeout = setTimeout(function() {
			$alertmessage.fadeOut();
		}, 3000);
	}).on('click', '#clkz_qyzw', function(event) { //启用指纹
		var $alertmessage = $('#alertmessage');
		showalert('启用指纹', 1);
		if (clkztimeout)
			clearTimeout(clkztimeout);
		clkztimeout = setTimeout(function() {
			$alertmessage.fadeOut();
		}, 3000);
	}).on('click', '#clkz_tyzw', function(event) { //停用指纹
		var $alertmessage = $('#alertmessage');
		showalert('停用指纹', 1);
		if (clkztimeout)
			clearTimeout(clkztimeout);
		clkztimeout = setTimeout(function() {
			$alertmessage.fadeOut();
		}, 3000);
	}).on('click', '#clkz_qygk1', function(event) { //启用管控(1)
		var $alertmessage = $('#alertmessage');
		showalert('启用管控(1)', 1);
		if (clkztimeout)
			clearTimeout(clkztimeout);
		clkztimeout = setTimeout(function() {
			$alertmessage.fadeOut();
		}, 3000);
	}).on('click', '#clkz_qygk2', function(event) { //启用管控(2)
		var $alertmessage = $('#alertmessage');
		showalert('启用管控(2)', 1);
		if (clkztimeout)
			clearTimeout(clkztimeout);
		clkztimeout = setTimeout(function() {
			$alertmessage.fadeOut();
		}, 3000);
	}).on('click', '#clkz_qygk3', function(event) { //启用管控(3)
		var $alertmessage = $('#alertmessage');
		showalert('启用管控(3)', 1);
		if (clkztimeout)
			clearTimeout(clkztimeout);
		clkztimeout = setTimeout(function() {
			$alertmessage.fadeOut();
		}, 3000);
	}).on('click', '#clkz_qygk7', function(event) { //启用管控(7)
		var $alertmessage = $('#alertmessage');
		showalert('启用管控(7)', 1);
		if (clkztimeout)
			clearTimeout(clkztimeout);
		clkztimeout = setTimeout(function() {
			$alertmessage.fadeOut();
		}, 3000);
	}).on('click', '#clkz_tygk', function(event) { //停用管控
		var $alertmessage = $('#alertmessage');
		showalert('停用管控', 1);
		if (clkztimeout)
			clearTimeout(clkztimeout);
		clkztimeout = setTimeout(function() {
			$alertmessage.fadeOut();
		}, 3000);
	}).on('click', '#clkz_pz', function(event) { //拍照
		var $alertmessage = $('#alertmessage');
		showalert('拍照', 1);
		if (clkztimeout)
			clearTimeout(clkztimeout);
		clkztimeout = setTimeout(function() {
			$alertmessage.fadeOut();
		}, 3000);
	}).on('click', '#clkz_clxs', function(event) { //车辆限速
		var $alertmessage = $('#alertmessage');
		showalert('车辆限速', 1);
		if (clkztimeout)
			clearTimeout(clkztimeout);
		clkztimeout = setTimeout(function() {
			$alertmessage.fadeOut();
		}, 3000);

	}).on('click', '#clkz_xxts', function(event) { //信息提示
		var $alertmessage = $('#alertmessage');
		showalert('信息提示', 1);
		if (clkztimeout)
			clearTimeout(clkztimeout);
		clkztimeout = setTimeout(function() {
			$alertmessage.fadeOut();
		}, 3000);
	}).on('click', '#confirmok', function(event) { //确定框按钮
		var $confirmcontext_ref = $('#confirmcontext').attr('data-ref');
		switch ($confirmcontext_ref) {
			case 'clkz_sj':
				var $alertmessage = $('#alertmessage');
				showalert('锁机', 1);
				if (clkztimeout)
					clearTimeout(clkztimeout);
				clkztimeout = setTimeout(function() {
					$alertmessage.fadeOut();
				}, 3000);
				$('#myModal6').modal('hide');
				break;
			default:
				break;
		}
	}).on('shown.bs.modal', '#myModal6', function(event) {
		$('#confirmok').focus();
	});

	$(window).on('resize', function(event) {
		if (document.body.scrollHeight == window.screen.height && document.body.scrollWidth == window.screen.width) {
			$('#quanpingbtn').hide();
			$('#huanyuanbtn').show();
		} else {
			$('#huanyuanbtn').hide();
			$('#quanpingbtn').show();
		}
	});

	$('#quanpingbtn button').colorTip({ color: 'white', direction: 'down' });
	$('#huanyuanbtn button').colorTip({ color: 'white', direction: 'down' });

	/**
	 * 显示弹框
	 * @param {字符串：具体的操作} alertval 
	 * @param {数字：1为成功 2为失败} key 
	 */
	function showalert(alertval, key) {
		var $alertmessage = $('#alertmessage');
		$alertmessage.empty();
		switch (key) {
			case 1:
				$alertmessage.append($(`
                    <div class="alert alert-success alert-block fade in">
                        <button data-dismiss="alert" class="close close-sm" type="button">
                            <i class="fa fa-times"></i>
                        </button>
                        <h4><i class="fa fa-ok-sign"></i>操作成功</h4>
                        <p>${alertval}成功，欲想查看更多信息，请到操作日志查看</p>
                    </div>
                `));
				break;
			case 2:
				$alertmessage.append($(`
                    <div class="alert alert-block alert-danger fade in">
                        <button data-dismiss="alert" class="close close-sm" type="button">
                            <i class="fa fa-times"></i>
                        </button>
                        <h4><i class="fa fa-ok-sign"></i>操作失败</h4>
                        <p>${alertval}失败，欲想查看更多信息，请到操作日志查看</p>
                    </div>
                `));
				break;
			default:
				break;
		}
		$alertmessage.fadeIn();
	}

	/**
	 * 获取地图上所有的点
	 */
	function getinit() {
		var $loadingimage = $('#loadingimage');
		$loadingimage.fadeIn();
		$.ajax({
			url: allPoints.path,
			// data: {},
			type: allPoints.type,
			dataType: "json",
			// async: false,
			success: function(data) { //ajax返回的数据
				if (data.result) {

					var $xiaonachang = $('#xiaonachang');
					var $gongdi = $('#gongdi');
					var $jinqu = $('#jinqu');
					var $xiansuquan = $('#xiansuquan');
					gaodemap.addMarkers(data.data);

					data.data.forEach(function(element) {
							if (element.icontype == 2) {
							$xiaonachang.addClass('active');
							mapobj.localist['xnc'].isshow = true;
						} else if (element.icontype == 3) {
							$gongdi.addClass('active');
							mapobj.localist['gd'].isshow = true;
						} else if (element.icontype == 6) {
							$jinqu.addClass('active');
							mapobj.localist['jq'].isshow = true;
						} else if (element.icontype == 7) {
							$xiansuquan.addClass('active');
							mapobj.localist['xsq'].isshow = true;
						}
					}, this);
					mapobj.map.setFitView();
					$loadingimage.fadeOut();
				}
			},
			error: function(res) {
				console.log(allPoints.path, res);
				$loadingimage.fadeOut();
			}
		});
	}

	function getupdate() {
		$.ajax({
			url: allPointstype.path,
			// data: {},
			type: allPointstype.type,
			dataType: "json",
			// async: false,
			success: function(data) { //ajax返回的数据
				console.log(data);
				if (data.result) {
					gaodemap.rmoveandupdateMarkers(data.data, 'cl', true);
				}
			},
			error: function(res) {
				console.log(allPointstype.path, res);
			}
		});
	}

	function fullScreen() {
		var el = document.documentElement;
		var rfs = el.requestFullScreen || el.webkitRequestFullScreen ||
			el.mozRequestFullScreen || el.msRequestFullScreen;
		if (typeof rfs != "undefined" && rfs) {
			rfs.call(el);
		} else if (typeof window.ActiveXObject != "undefined") {
			//for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
			var wscript = new ActiveXObject("WScript.Shell");
			if (wscript != null) {
				wscript.SendKeys("{F11}");
			}
		}
	}

	function exitFullScreen() {
		var el = document;
		var cfs = el.cancelFullScreen || el.webkitCancelFullScreen ||
			el.mozCancelFullScreen || el.exitFullScreen;
		if (typeof cfs != "undefined" && cfs) {
			cfs.call(el);
		} else if (typeof window.ActiveXObject != "undefined") {
			//for IE，这里和fullScreen相同，模拟按下F11键退出全屏
			var wscript = new ActiveXObject("WScript.Shell");
			if (wscript != null) {
				wscript.SendKeys("{F11}");
			}
		}
	}
	// 消纳厂，限速圈等点击事件
	function getweilanpt(wltype) {
		if (mapobj.localist[wltype] && mapobj.localist[wltype].isshow) {
			mapobj.localist[wltype].isshow = false;
			gaodemap.rmoveandupdateMarkers(null, wltype, false);
		} else {
			var $loadingimage = $('#loadingimage');
			$loadingimage.fadeIn();
			$.ajax({
				url: areaPoint.path + wltype,
				// data: {},
				type: areaPoint.type,
				dataType: 'json',
				// async: false,
				success: function(data) { //ajax返回的数据
					console.log(data);
					if (data.result) {
						if (mapobj.localist[wltype]) {
							mapobj.localist[wltype].isshow = true;
							gaodemap.rmoveandupdateMarkers(data.data, wltype, true);
						}
					}
					$loadingimage.fadeOut();
				},
				error: function(res) {
					console.log(areaPoint.path, res);
					$loadingimage.fadeOut();
				}
			})
		}
	}
})