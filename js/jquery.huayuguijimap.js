// navg--巡航器
// features--地图状态控制（背景，道路，建筑物，点标记）
// navg--巡航器实例

var mapobj = {
	map: null,
	features: ['bg', 'road', 'building', 'point'],
	weilanshow: {
		gd: true,
		xnc: true,
		jq: true,
		xsq: true
	},
	rawlength: {
		lengthlist: [],
		allLength: 0
	},
	pathSimplifierInses: [],
	dataPointerobj: null,
	playSpeed: 0,
	customSpeed: 1,
	navg: null,
	canPlay: false,
	pathSimplifierIns: null,
	cluster: {},
	loca: {
		citybounds: null,
		marker: {},
		polygon: {}
	},
	localist: {},
	alllist: {},
	gjlist: [],
	tllist: [],
	polygonbool: false,
	runstate: false
}
var clkztimeout;
var movetimeout;
var gaodemap = {
	init: function() {
		mapobj.map = new AMap.Map('container', {
			resizeEnable: true,
			zoom: 18,
			features: mapobj.features
		});
		mapobj.map.on('zoomend', function(event) {
			var nbool = true;
			console.log(mapobj.map.getZoom());
			if (mapobj.map.getZoom() < 13) {
				nbool = false;
			} else {
				nbool = true;
			}
			if (mapobj.polygonbool !== nbool) {
				console.log('nbool', nbool);
				for (var key in mapobj.weilanshow) {
					console.log(key, mapobj.weilanshow[key]);
					if (nbool && mapobj.weilanshow[key]) {
						gaodemap.addPolygons(mapobj.localist[key], key, false);
					} else {
						gaodemap.removePolygons(mapobj.localist[key], key, false);
					}
				}
				mapobj.polygonbool = nbool;
			}
		});
		gaodemap.listenEvents();
	},
	addPolygon: function(id, polygon, icontype = 1, type = 'cl') {
		if (!mapobj.infoWindow)
			mapobj.infoWindow = new AMap.InfoWindow({
				offset: new AMap.Pixel(0, -20)
			});
		var polygonArr = new Array();
		polygon.forEach(function(element) {
			polygonArr.push([element.lng, element.lat]);
		}, this);
		var stylejson = {
			strokeColor: '#F1D409',
			fillColor: '#F1D409'
		};
		switch (icontype) {
			case 1:
				stylejson = { strokeColor: '#0ea3df', fillColor: '#0ea3df' };
				break;
			case 2:
				stylejson = { strokeColor: '#a85151', fillColor: '#a85151' };
				break;
			case 3:
				stylejson = { strokeColor: '#f2d609', fillColor: '#f2d609' };
				break;
			case 4:
			case 5:
				stylejson = { strokeColor: '#870000', fillColor: '#c70000' };
				break;
			case 6:
				stylejson = { strokeColor: '#ff0000', fillColor: '#ff0000' };
				break;
			case 7:
				stylejson = { strokeColor: '#eb8a00', fillColor: '#eb8a00' };
				break;
		}
		mapobj.loca.polygon = new AMap.Polygon({
			path: polygonArr, //设置多边形边界路径
			strokeColor: stylejson.strokeColor, //线颜色
			strokeOpacity: 0.7, //线透明度
			strokeWeight: 2, //线宽
			fillColor: stylejson.fillColor, //填充色
			fillOpacity: 0.6 //填充透明度
		});
		mapobj.loca.polygon.setMap(mapobj.map);
		return mapobj.loca.polygon;
	},
	addPolygons: function(value, type, weilanshow = true) {
		if (type) {
			for (var key in value) {
				if (key != 'isshow' && value[key].value.item && value[key].value.type == type)
					mapobj.localist[value[key].value.type][value[key].value.id].polygon = gaodemap.addPolygon(key, value[key].value.item, value[key].value.icontype, value[key].value.type);
			}
			if (weilanshow)
				mapobj.weilanshow[type] = true;
		} else {
			for (var key in value) {
				if (key != 'isshow' && value[key].value.item)
					mapobj.localist[value[key].value.type][value[key].value.id].polygon = gaodemap.addPolygon(key, value[key].value.item, value[key].value.icontype, value[key].value.type);
			}
			if (weilanshow)
				for (var key in mapobj.weilanshow) {
					mapobj.weilanshow[key] = true;
				}
		}
        console.log('addPolygons',mapobj.weilanshow[type]);
	},
	removePolygon: function(id, type = 'cl') {
		if (mapobj.localist[type] && mapobj.localist[type][id] && mapobj.localist[type][id].polygon) {
			mapobj.localist[type][id].polygon.setMap(null);
			mapobj.localist[type][id].polygon = null;
		}
	},
	removePolygons: function(value, type, weilanshow = true) {
		if (type) {
			for (var key in value) {
				if (key != 'isshow' && value[key].value.item && value[key].value.type == type)
					gaodemap.removePolygon(key, value[key].value.type);
			}
			if (weilanshow)
				mapobj.weilanshow[type] = false;
		} else {
			for (var key in value) {
				if (key != 'isshow' && value[key].value.item)
					gaodemap.removePolygon(key, value[key].value.type);
			}
			if (weilanshow)
				for (var key in mapobj.weilanshow) {
					mapobj.weilanshow[key] = false;
				}
        }
        console.log('removePolygons',mapobj.weilanshow[type]);
	},
	addMarker: function(id, lng, lat, icontype = 1, direction = 0, type = 'cl') {
		if (!mapobj.infoWindow)
			mapobj.infoWindow = new AMap.InfoWindow({
				offset: new AMap.Pixel(0, -20)
			});
		var mappicon = '<div id="marker_' + id + '" ref="' + id + '" type="' + type + '" direction="' + direction + '" icontype="' + icontype + '" lng="' + lng + '" lat="' + lat + '" class="marker-route marker-route-' + icontype + '">' +
			'<a class="markercontext" >' +
			'<i style="transform:rotate(' + direction + 'deg)"></i>' +
			'</a>' +
			'</div>';
		if (icontype == 4) {
			mapobj.loca.marker = new AMap.Marker({
				map: mapobj.map,
				position: [lng, lat],
				offset: new AMap.Pixel(-20, -20),
				content: mappicon
			});
		} else {
			mapobj.loca.marker = new AMap.Marker({
				map: mapobj.map,
				position: [lng, lat],
				offset: new AMap.Pixel(-20, -20),
				content: mappicon
			});
		}
		mapobj.loca.marker.content = id;
		mapobj.loca.marker.on('click', function(e) {
			//e.target.content  //车辆id
			gaodemap.showinfoWindow(e.target.content);
		});
		return mapobj.loca.marker;
	},
	addMarkers: function(valuejson) {
		mapobj.localist = {};
		mapobj.map.clearMap();
		var markers = {};
		valuejson.forEach(function(element) {
			switch (element.icontype) {
				case 1:
					element.type = 'tcc';
					break;
				case 2:
					element.type = 'xnc';
					break;
				case 3:
					element.type = 'gd';
					break;
				case 4:
				case 5:
					element.type = 'cl';
					break;
				default:
					break;
			}
			if (!markers[element.type])
				markers[element.type] = [];
			if (!mapobj.localist[element.type])
				mapobj.localist[element.type] = {};
			if (!mapobj.localist[element.type][element.id])
				mapobj.localist[element.type][element.id] = {};
			if (!mapobj.alllist[element.id])
				mapobj.alllist[element.id] = {};
			mapobj.alllist[element.id].marker = gaodemap.addMarker(element.id, element.lng, element.lat, element.icontype || 1, element.direction || 0, element.type || 'cl');
			mapobj.alllist[element.id].value = element;
			mapobj.localist[element.type][element.id].marker = mapobj.alllist[element.id].marker;
			mapobj.localist[element.type][element.id].value = element;
			markers[element.type].push(mapobj.localist[element.type][element.id].marker);
		});
		for (var type in markers) {
			if (mapobj.cluster[type]) {
				mapobj.cluster[type].setMap(null);
			}
			mapobj.cluster[type] = new AMap.MarkerClusterer(mapobj.map, markers[type], {
				styles: [{
					url: "img/jh_map_" + type + ".png",
					size: new AMap.Size(32, 32),
					offset: new AMap.Pixel(-16, -16)
				}],
				gridSize: 80
			});
		}
	},
	removeMarker: function(id, type) {
		if (mapobj.localist[type] && mapobj.localist[type][id] && mapobj.localist[type][id].marker) {
			mapobj.map.remove(mapobj.localist[type][id].marker);
			mapobj.localist[type][id].marker = null;
		}
	},
	removeMarkers: function(type = 'cl') {
		for (var key2 in mapobj.localist[type]) {
			gaodemap.removeMarker(key2, type);
		}
	},
	rmoveandupdateMarkers: function(valuejson, type = 'cl', opupdate = true) {
		gaodemap.removeMarkers(type);
		gaodemap.removePolygons(mapobj.alllist, type);
		if (mapobj.cluster[type]) {
			mapobj.cluster[type].setMap(null);
		}
		if (opupdate) {
			var markers = {};
			valuejson.forEach(function(element) {
				switch (element.icontype) {
					case 1:
						element.type = 'tcc';
						break;
					case 2:
						element.type = 'xnc';
						break;
					case 3:
						element.type = 'gd';
						break;
					case 4:
					case 5:
						element.type = 'cl';
						break;
					default:
						break;
				}
				if (!markers[element.type])
					markers[element.type] = [];
				if (!mapobj.localist[element.type])
					mapobj.localist[element.type] = {};
				if (!mapobj.alllist[element.id])
					mapobj.alllist[element.id] = {};
				mapobj.localist[element.type][element.id] = {};
				mapobj.alllist[element.id].marker = gaodemap.addMarker(element.id, element.lng, element.lat, element.icontype || 1, element.direction || 0, element.type || 'cl');
				mapobj.alllist[element.id].value = element;
				mapobj.localist[element.type][element.id].marker = mapobj.alllist[element.id].marker;
				mapobj.localist[element.type][element.id].value = element;
				markers[element.type].push(mapobj.localist[element.type][element.id].marker);
			});
            if (mapobj.polygonbool) {
                gaodemap.addPolygons(mapobj.alllist, type);
            } else { 
				mapobj.weilanshow[type] = true;
            }
			for (var type in markers) {
				if (mapobj.cluster[type]) {
					mapobj.cluster[type].setMap(null);
				}
				mapobj.cluster[type] = new AMap.MarkerClusterer(mapobj.map, markers[type], {
					styles: [{
						url: "img/jh_map_" + type + ".png",
						size: new AMap.Size(32, 32),
						offset: new AMap.Pixel(-16, -16)
					}],
					gridSize: 80
				});
			}
		}
	},
	showMarker: function(id, type) {
		if (type) {
			if (mapobj.localist[type] && mapobj.localist[type][id] && mapobj.localist[type][id].marker) {
				mapobj.map.setZoom(20);
				mapobj.map.setCenter([mapobj.localist[type][id].marker.G.position.lng, mapobj.localist[type][id].marker.G.position.lat]);
			}
		} else {
			if (mapobj.alllist && mapobj.alllist[id] && mapobj.alllist[id].marker) {
				mapobj.map.setZoom(20);
				mapobj.map.setCenter([mapobj.alllist[id].marker.G.position.lng, mapobj.alllist[id].marker.G.position.lat]);
			}
		}
	},
	addpathSimplifierIns: function(clxx, dataobj) {
			mapobj.pathSimplifierInses.push(dataobj);
			var $faWait = $(`
                <div class="waitPlay faWait" title="${clxx.cph}<br\>${clxx.ptname1} - ${clxx.ptname2} - ${clxx.ptname3}<br\>${clxx.dt1} - ${clxx.dt2}">
                    <div class='closeresultbody2'>&times;</div>
                    <i class="fa fa-clock-o"></i><span class="waitplaytext">等待播放</span>
                </div>
            `);
			$('#waitplaybox').append($faWait);
			$faWait.colorTip({
				color: 'white',
				direction: 'left'
			});
			gaodemap.checkpathSimplifierIns(false);
	},
	cancelpathSimplifierIns: function(pindex) {
		mapobj.pathSimplifierInses.splice(pindex, 1);
		$('#waitplaybox .faWait:eq(' + pindex + ')').remove();
		if (pindex == 0) {
			gaodemap.removepathSimplifierIns();
			mapobj.runstate = false;
		}
		gaodemap.checkpathSimplifierIns(false);
	},
	checkpathSimplifierIns: function(nbool = false) {
		if (!mapobj.runstate && mapobj.pathSimplifierInses.length > 0) {
			if (nbool) {
				mapobj.pathSimplifierInses.splice(0, 1);
				$('#waitplaybox .faWait:eq(0)').remove();
			}
			$('#waitplaybox .faWait:eq(0) .waitplaytext').html('正在播放');
			if (mapobj.pathSimplifierInses.length > 0) {
				var temp = [];
				for (var i = 0; i < mapobj.pathSimplifierInses[0].length; i++) {
					var pointer = mapobj.pathSimplifierInses[0][i];
					temp.push([pointer.lng, pointer.lat]);
				}
				gaodemap.setpathSimplifierIns(temp, mapobj.pathSimplifierInses[0]);
			}
		}
	},
	/**
	 * 轨迹回放,设置轨迹线和巡航器（巡航器，此处必须已引入高德地图UI的js文件）
	 */
	setpathSimplifierIns: function(runjson, Simplifier) {
		mapobj.runstate = true;
		gaodemap.getPathSimplifierLength(runjson);
		AMapUI.load(['ui/misc/PathSimplifier', 'lib/$', 'lib/utils'], function(PathSimplifier, $, utils) {
			if (!PathSimplifier.supportCanvas) {
				alert('当前环境不支持 Canvas！');
				return;
			}
			var defaultRenderOptions = {
				pathNavigatorStyle: {
					width: 16,
					height: 16,
					autoRotate: true,
					lineJoin: 'round',
					content: 'defaultPathNavigator',
					fillStyle: '#087EC4',
					strokeStyle: '#116394', //'#eeeeee',
					lineWidth: 1,
					// 巡航器走过后轨迹的样式
					pathLinePassedStyle: {
						lineWidth: 4,
						strokeStyle: 'rgba(8, 126, 196, 0.8)',
						borderWidth: 2,
						borderStyle: '#eee',
						dirArrowStyle: false
					}
				},
				pathLineStyle: {
					lineWidth: 1,
					strokeStyle: 'transparent',
					borderStyle: 'transparent',
					borderWidth: 1,
					dirArrowStyle: false
				},
				pathLineHoverStyle: {
					lineWidth: 1,
					strokeStyle: 'transparent',
					borderStyle: 'transparent',
					borderWidth: 1,
					dirArrowStyle: false
				},
				// startPointStyle: {
				// 	radius: 0,
				// 	fillStyle: 'transparent',
				// 	strokeStyle: 'transparent',
				// 	lineWidth: 0
				// },
				// endPointStyle: {
				// 	radius: 0,
				// 	fillStyle: 'transparent',
				// 	strokeStyle: 'transparent',
				// 	lineWidth: 0
				// }
			};
			// 创建一个轨迹
			mapobj.pathSimplifierIns = new PathSimplifier({
				zIndex: 100,
				map: mapobj.map,
				getPath: function(pathData, pathIndex) {
					return pathData.path;
				},
				getHoverTitle: function(pathData, pathIndex, pointIndex) {},
				renderOptions: defaultRenderOptions
			});
			// 设置轨迹线
			mapobj.pathSimplifierIns.setData([{
				name: 'Test',
				path: runjson
			}]);
			// 创建一个巡航器
			mapobj.navg = mapobj.pathSimplifierIns.createPathNavigator(0, {
				loop: false,
				// 这里做优化，用户当前选的是哪个速度，继续用哪个速度播放
				speed: mapobj.playSpeed,
			});
			mapobj.navg.start();
			mapobj.navg.on('move', function(event) {
				// mapobj.idLabel.playToggle.removeClass('fa-pause').addClass('fa-play');
				if (event.target.cursor.idx == mapobj.rawlength.lengthlist.length) {
					// mapobj.idLabel.playToggle.removeClass('fa-pause').addClass('fa-play');
					mapobj.canPlay = false;
					// 此处更新轨迹点，清除原轨迹，建立新轨迹(新轨迹是回程或者下一个新来回轨迹，需要判断)
					// gaodemap.updatePointers(mapobj.pointers.reverse());
					// mapobj.idLabel.playSpeed1.addClass('active').siblings().removeClass('active');
				} else {
					let temprawlength = 0;
					for (var index = 0; index < mapobj.rawlength.lengthlist.length; index++) {
						if (index < event.target.cursor.idx) {
							temprawlength += mapobj.rawlength.lengthlist[index]['lnglat'];
						}
					}
					var temp;
					if (event.target.cursor.idx >= mapobj.rawlength.lengthlist.length) {
						temp = 100;
					} else {
						temp = ((mapobj.rawlength.lengthlist[event.target.cursor.idx]['lnglat'] * event.target.cursor.tail + temprawlength) / mapobj.rawlength.allLength * 100).toFixed(0);
					}
					$(".mysliderBlock").css('left', temp + "%");
					$(".mysliderSel").css('width', temp + "%");
					console.log(temp);
					if (temp >= 99) {
						if (!movetimeout)
							movetimeout = setTimeout(function() {
								gaodemap.removepathSimplifierIns();
								mapobj.runstate = false;
								gaodemap.checkpathSimplifierIns(true);
								movetimeout = null;
							}, 2000);
					}
					if (event.target.cursor.idx != mapobj.pathSimplifierInses.length) {
						mapobj.canPlay = true;
					}
				}
			}).on('start', function() {

			}).on('pause', function() {

			}).on('stop', function() {

			});
			gaodemap.addGJ(Simplifier);
		});
	},
	/**
	 * 清除轨迹
	 */
	removepathSimplifierIns: function() {
		mapobj.pathSimplifierIns.setData(null);
		mapobj.pathSimplifierIns.clearPathNavigators();
		mapobj.navg.destroy();
		// mapobj.map.clearMap();
		mapobj.map.remove(mapobj.gjlist);
		mapobj.gjlist = [];
		mapobj.map.remove(mapobj.tllist);
		mapobj.tllist = [];
	},
	/**
	 * 根据传入的标注点来获得整条轨迹的长度距离与每段的长度距离
	 */
	getPathSimplifierLength: function(runjson) {
		mapobj.rawlength.allLength = 0;
		mapobj.rawlength.lengthlist = [];
		for (var i = 0; i < runjson.length - 1; i++) {
			var Inglat = new AMap.LngLat(runjson[i][0], runjson[i][1]);
			var childlength = Inglat.distance([runjson[i + 1][0], runjson[i + 1][1]]);
			mapobj.rawlength.allLength += childlength;
			mapobj.rawlength.lengthlist.push({
				"lnglat": childlength
			});
		}
		mapobj.playSpeed = mapobj.rawlength.allLength / 5 * mapobj.customSpeed;
	},
	/**
	 * 根据传入的控制标签id来监听控制其功能
	 */
	listenEvents: function() {
		$('body').on('click', '#playToggle', function() {
			var $this = $(this);
			console.log("testing", mapobj.navg.getNaviStatus(), mapobj.navg.getCursor().idx);
			// if (mapobj.navg.getCursor().idx != mapobj.rawlength.lengthlist.length && mapobj.navg.getNaviStatus() == "stop") {
			//     mapobj.navg.start();
			//     mapobj.idLabel.playToggle.removeClass('fa-play').addClass('fa-pause');
			// } else 
			if (mapobj.navg.getCursor().idx != mapobj.rawlength.lengthlist.length && mapobj.navg.getNaviStatus() == "pause") {
				mapobj.navg.resume();
				$this.removeClass('fa-play').addClass('fa-pause');
			} else if (mapobj.navg.getCursor().idx != mapobj.rawlength.lengthlist.length && mapobj.navg.getNaviStatus() == "moving") {
				mapobj.navg.pause();
				$this.removeClass('fa-pause').addClass('fa-play');
				mapobj.canPlay = false;
			} else if (mapobj.navg.getCursor().idx == mapobj.rawlength.lengthlist.length) {
				// mapobj.navg.pause();
				mapobj.navg.start();
				$this.removeClass('fa-play').addClass('fa-pause');
			}
		}).on('click', '#playSpeed1', function() {
			var $this = $(this);
			mapobj.customSpeed = 1;
			mapobj.navg.setSpeed(mapobj.playSpeed);
			$this.addClass('active').siblings().removeClass('active');
		}).on('click', '#playSpeed2', function() {
			mapobj.customSpeed = 2;
			mapobj.navg.setSpeed(mapobj.playSpeed * mapobj.customSpeed);
			mapobj.idLabel.playSpeed2.addClass('active').siblings().removeClass('active');
		}).on('click', '#playSpeed3', function() {
			var $this = $(this);
			mapobj.customSpeed = 3;
			mapobj.navg.setSpeed(mapobj.playSpeed * mapobj.customSpeed);
			$this.addClass('active').siblings().removeClass('active');
		}).on('click', '#goStart', function() {
			// mapobj.navg.getPathStartIdx();
			mapobj.navg.moveToPoint(0, 0);
		}).on('click', '#goStop', function() {
			mapobj.navg.getPathEndIdx();
			// mapobj.navg.moveToPoint(mapobj.rawlength.lengthlist.length, 0);
			// mapobj.navg.stop();
			gaodemap.removepathSimplifierIns();
			mapobj.runstate = false;
			gaodemap.checkpathSimplifierIns(true);
		}).on('mouseover', '#slider-range-min', function() {
			if (mapobj.navg.getNaviStatus() == "moving") {
				mapobj.navg.pause();
			}
		}).on('mouseout', '#slider-range-min', function(event) {
			if (mapobj.navg.getNaviStatus() == "pause" && mapobj.canPlay) {
				mapobj.navg.resume();
				$('#playToggle').removeClass('fa-play').addClass('fa-pause');
			}
		}).on('click', '.closeresultbody2', function(event) {
			gaodemap.cancelpathSimplifierIns($(this).parent().index());
		});
		$('#slider-range-min').slider({
			slide: function() {
				$(".mysliderSel").css("width", $(".mysliderBlock").css("left"));
				mapobj.navg.pause();
			},
			change: function() {
				let tagermovepa = parseFloat($(".mysliderBlock").css("left")) / parseFloat($('#slider-range-min').css("width"));
				let tagermovelength = tagermovepa * mapobj.rawlength.allLength;
				let temprawlength = 0;
				let lastrawlength = 0;
				let rawpa = 0;
				let rawidx = 0;
				for (var index = 0; index < mapobj.rawlength.lengthlist.length; index++) {
					temprawlength += mapobj.rawlength.lengthlist[index]['lnglat'];
					if (temprawlength >= tagermovelength) {
						rawpa = (tagermovelength - lastrawlength) / mapobj.rawlength.lengthlist[index]['lnglat'];
						rawidx = index;
						break;
					}
					lastrawlength += mapobj.rawlength.lengthlist[index]['lnglat'];
				}
				mapobj.navg.moveToPoint(rawidx, rawpa);
				mapobj.canPlay = true;
			}
		});
	},
	/**
	 * 添加告警信息点
	 */
	addGJ: function(Simplifier) {
		var infoWindow = new AMap.InfoWindow();
		for (var i = 0; i < Simplifier.length; i++) {
			if (Simplifier[i].tingliu) {
				var marker = new AMap.Marker({
					offset: new AMap.Pixel(-5, -5),
					position: [Simplifier[i].lng, Simplifier[i].lat],
					map: mapobj.map,
					content: "<p style='width:10px;height:10px;background:green;border-radius:50%'><p>"
				});
				marker.setLabel({
					offset: new AMap.Pixel(7, 7),
					content: "<div>" + Simplifier[i].tingliu.title + "</div><div>" + Simplifier[i].tingliu.dt1 + " - " + Simplifier[i].tingliu.dt2 + "</div>"
				});
				mapobj.tllist.push(marker);
			}
			if (Simplifier[i].gaojing) {
				var marker = new AMap.Marker({
					offset: new AMap.Pixel(-5, -5),
					position: [Simplifier[i].lng, Simplifier[i].lat],
					map: mapobj.map,
					content: "<p style='width:10px;height:10px;background:red;border-radius:50%'><p>"
				});
				marker.content = "<div style='color: #fff;font-size: 18px;width: 325px;height: 70px;line-height: 27px;padding-top: 8px;padding-left: 30px;'>告警类型：" +
					Simplifier[i].gaojing.type + "<br>告警时间：" + Simplifier[i].gaojing.dt +
					"</div>";
				//给Marker绑定单击事件
				marker.on('click', function(e) {
					infoWindow.setContent(e.target.content);
					infoWindow.open(mapobj.map, e.target.getPosition());
				});
				mapobj.gjlist.push(marker);
			}
		}
	},
	/**
	 * 显示弹框
	 * @param {字符串：具体的操作} alertval 
	 * @param {数字：1为成功 2为失败} key 
	 */
	showalert: function(alertval, key) {
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
                        <p>${alertval}</p>
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
                        <p>${alertval}</p>
                    </div>
                `));
				break;
			default:
				break;
		}
		$alertmessage.fadeIn();
	}
}