var mapobj = {
	map: null,
	trafficLayer: null,
	defaultLayer: null,
	//googleLayer: null,
	buildings: null,
	cluster: {},
	features: ['bg', 'road', 'building', 'point'],
	weilanshow: {
		gd: true,
		xnc: true,
		jq: true,
		xsq: true
	},
	loca: { //最后一次加载的定位
		citybounds: null,
		marker: {},
		polygon: {}
	},
	localist: {},
	alllist: {},
	infoWindow: null,
	polygonbool: false
};
var gaodemap = {
	init: function(obj) {

		mapobj.map = new AMap.Map('container', {
			resizeEnable: true,
			zoom: 18,
			features: mapobj.features
		});
		mapobj.map.on('zoomend', function(event) {
			var nbool = true;
			// console.log(mapobj.map.getZoom());
			if (mapobj.map.getZoom() < 13) {
				nbool = false;
			} else {
				nbool = true;
			}
			if (mapobj.polygonbool !== nbool) {
				// console.log('nbool', nbool);
				for (var key in mapobj.weilanshow) {
					// console.log(key, mapobj.weilanshow[key]);
					if (nbool && mapobj.weilanshow[key]) {
						gaodemap.addPolygons(mapobj.localist[key], key, false);
					} else {
						gaodemap.removePolygons(mapobj.localist[key], key, false);
					}
				}
				mapobj.polygonbool = nbool;
			}
		});
		gaodemap.setmapScale(true);
		gaodemap.setmapToolBar(true);
		//gaodemap.setgoogleLayer(false);
		gaodemap.settrafficLayer(false);
		gaodemap.set25DBuildings(false);

		mapobj.map.addControl(new AMap.MapType());
	},
	addPolygon: function(id, polygon, icontype = 1, type = 'cl') {
		if (!mapobj.infoWindow)
			mapobj.infoWindow = new AMap.InfoWindow({
				offset: new AMap.Pixel(0, 0)
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
		console.log('addPolygons', mapobj.weilanshow[type]);
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
		console.log('removePolygons', mapobj.weilanshow[type]);
	},
	addMarker: function(id, lng, lat, icontype = 1, direction = 0, type = 'cl',veInfo) {
		if (!mapobj.infoWindow)
			mapobj.infoWindow = new AMap.InfoWindow({
				offset: new AMap.Pixel(-10, -24)

			});
		var mappicon = '<div id="marker_' + id + '" ref="' + id + '" type="' + type + '" direction="' + direction + '" icontype="' + icontype + '" lng="' + lng + '" lat="' + lat + '" class="marker-route marker-route-' + icontype + '">' +
			'<a class="markercontext" >' +
			'<i style="transform:rotate(' + direction + 'deg)"></i>' +
			'</a>' +
			'</div>';

		if (icontype == 4){
			mapobj.loca.marker = new AMap.Marker({
				map: mapobj.map,
				position: [lng, lat],
				offset: new AMap.Pixel(-10, -24),
				content:mappicon
			});
		} else {
			mapobj.loca.marker = new AMap.Marker({
				map: mapobj.map,
				position: [lng, lat],
				offset: new AMap.Pixel(-10, -24),
				content:mappicon
			})
		}



		mapobj.loca.marker.content = id;
		mapobj.loca.marker.icontype = icontype;
		mapobj.loca.marker.on('click', function(e) {
			//e.target.content  //车辆id
			mapobj.map.setZoomAndCenter(14, [e.lnglat.getLng(),e.lnglat.getLat()]);
			gaodemap.showinfoWindow(e.target.content);
		});
		return mapobj.loca.marker;
	},
	addMarkers: function(valuejson) {
		mapobj.localist = {};
		mapobj.map.clearMap();

		var $searchBtn = $('#searchBtn');
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
				case 6:
					element.type = 'jq';
					break;
				case 7:
					element.type = 'xsq';
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
			mapobj.alllist[element.id].marker = gaodemap.addMarker(element.id, element.lng, element.lat, element.icontype || 1, element.direction || 0, element.type || 'cl',element.veInfo
			);
			mapobj.alllist[element.id].value = element;
			mapobj.localist[element.type][element.id].marker = mapobj.alllist[element.id].marker;
			mapobj.localist[element.type][element.id].value = element;
			markers[element.type].push(mapobj.localist[element.type][element.id].marker);
			$searchBtn.click(function(){
				//console.log(element.veInfo.veNo) 有为空的时候
				var change = $('#num').prop('checked');
				var IncChange = $('#inc').prop('checked');
				var triger = mapobj.alllist[element.id].marker.icontype;
				if(triger == 4 || triger == 5){
					if(!change){
						mapobj.alllist[element.id].marker.setLabel({
							content:'',
							map: mapobj.map
						});
						}else if(change){
						mapobj.alllist[element.id].marker.setLabel({
							offset: new AMap.Pixel(20, 20),
							content:''+element.veInfo.veNo+''
						})
					}
					if(IncChange){
						mapobj.alllist[element.id].marker.setLabel({
							offset: new AMap.Pixel(20, 20),
							content:''+element.veInfo.veNo+'|'+element.veInfo.companyName+''
						})
					}
				}else if(triger == 2){
					mapobj.alllist[element.id].marker.setLabel({
						offset: new AMap.Pixel(20, 20),
						content:'消纳场'
					})
				}else if(triger == 3){
					mapobj.alllist[element.id].marker.setLabel({
						offset: new AMap.Pixel(20, 20),
						content:'工地'
					})
				}else if(triger == 6){
					mapobj.alllist[element.id].marker.setLabel({
						offset: new AMap.Pixel(20, 20),
						content:'禁区'
					})
				}

				/*console.log(mapobj.alllist[element.id].marker.icontype+"aaa")
				* "veInfo":{"veNo":"湘AZ8379"},
				* */
			});
		});


		for (var type in markers) {
			if (mapobj.cluster[type]) {
				mapobj.cluster[type].setMap(null);
			}
			mapobj.cluster[type] = new AMap.MarkerClusterer(mapobj.map, markers[type], {
				styles: [{
					url: "img/jh_map_" + type + ".png",
					size: new AMap.Size(32, 32),
					offset: new AMap.Pixel(-10, -24)
				}],
				gridSize: 60,
				maxZoom:16
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
		if (mapobj.localist[type]) {
			mapobj.cluster[type].setMap(null);
		}
		if (opupdate) {
			var markers = {};
			valuejson.forEach(function(element) {
				switch (element.icontype) {
					case 1:
						element.type = 'tcc'; //停车场
						break;
					case 2:
						element.type = 'xnc'; //消纳厂
						break;
					case 3:
						element.type = 'gd'; //工地
						break;
					case 4:
					case 5:
						element.type = 'cl'; //车辆
						break;
					case 6:
						element.type = 'jq'; //禁区
						break;
					case 7:
						element.type = 'xsq'; //限速圈
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
						offset: new AMap.Pixel(-10, -24)
					}],
					gridSize: 80
				});
			}
		}
	},
	showMarker: function(id, type) {
		if (type) {
			if (mapobj.localist[type] && mapobj.localist[type][id] && mapobj.localist[type][id].marker) {
				mapobj.map.setZoom(18);
				mapobj.map.setCenter([mapobj.localist[type][id].marker.G.position.lng, mapobj.localist[type][id].marker.G.position.lat]);
			}
		} else {
			if (mapobj.alllist && mapobj.alllist[id] && mapobj.alllist[id].marker) {
				mapobj.map.setZoom(18);
				mapobj.map.setCenter([mapobj.alllist[id].marker.G.position.lng, mapobj.alllist[id].marker.G.position.lat]);
			}
		}
	},
	/**
	 * 显示或隐藏3D建筑  不能显示后再隐藏
	 */
	set25DBuildings: function(nbool) {
		if (!mapobj.buildings && nbool) {
			if (document.createElement('canvas') && document.createElement('canvas').getContext && document.createElement('canvas').getContext('2d')) {
				mapobj.buildings = new AMap.Buildings();
				buildings.setMap(mapobj.map);
			} else {
				alert("对不起，运行该示例需要浏览器支持HTML5！");
			}
		}
	},
	/**
	 * 显示或隐藏工具条
	 */
	setmapToolBar: function(nbool) {
		mapobj.map.addControl(new AMap.ToolBar({
			visible: nbool
		}));
	},
	/**
	 * 显示或隐藏比例尺
	 */
	setmapScale: function(nbool) {
		mapobj.map.addControl(new AMap.Scale({
			visible: nbool
		}));
	},
	/**
	 * 显示或隐藏谷歌地图
	 */
	/*setgoogleLayer: function(nbool) {
		if (!mapobj.googleLayer && nbool) {
			mapobj.googleLayer = new AMap.TileLayer({
				tileUrl: 'http://mt{1,2,3,0}.google.cn/vt/lyrs=m@142&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil',
				zIndex: 10
			});
			mapobj.googleLayer.setMap(mapobj.map);
		} else if (mapobj.googleLayer) {
			if (nbool)
				mapobj.googleLayer.show();
			else
				mapobj.googleLayer.hide();
		}
	},*/
	/**
	 * 显示或隐藏路况
	 */
	settrafficLayer: function(nbool) {
		if (!mapobj.trafficLayer && nbool) {
			mapobj.trafficLayer = new AMap.TileLayer.Traffic();
			mapobj.trafficLayer.setMap(mapobj.map);
		} else if (mapobj.trafficLayer) {
			if (nbool)
				mapobj.trafficLayer.show();
			else
				mapobj.trafficLayer.hide();
		}
	},
	/**
	 * 对背景、道路、建筑物、标注点的隐藏和显示
	 */
	setmapfeatures: function(nbool, tempfeatures) {
		if (nbool)
			mapobj.map.setFeatures(mapobj.features);
		else
			mapobj.map.setFeatures(tempfeatures);
	},
	/**
	 * 定位到当前城市
	 */
	showlocaCity: function() {
		if (mapobj.loca.citybounds) {
			map.setBounds(mapobj.loca.citybounds);
		} else {
			mapobj.cityraw = new AMap.CitySearch();
			mapobj.cityraw.getLocalCity(function(status, result) {
				if (status === 'complete' && result.info === 'OK') {
					if (result && result.city && result.bounds) {
						console.log(result.bounds)
						mapobj.map.setBounds(result.bounds);
						mapobj.loca.citybounds = result.bounds;
					}
				}
			});
		}
	},
	showinfoWindow: function(tempid) {
		// gaodemap.showMarker(tempid);

		var $loadingimage = $('#loadingimage');
		$loadingimage.fadeIn();
		$.ajax({
			url: CLinfo.path + tempid,
			// data: {},
			type: CLinfo.type,
			dataType: "json",
			// async: false,
			success: function(data) { //ajax返回的数据

				if (data.result && data.data) {
					var formattedAddress;
					var geocoder = new AMap.Geocoder({
						radius: 1000,
						extensions: "all"
					});

					geocoder.getAddress(mapobj.alllist[tempid].marker.getPosition(), function(status, result) {
						if (status === 'complete' && result.info === 'OK') {
							formattedAddress = result.regeocode.formattedAddress; //返回地址描述
						}
						mapobj.infoWindow.setContent(`
						<div class="modal-body">
							<table>
								<tr>
									<td style="width: 63px;">车牌号码：</td><td>${data.data.cph}</td>
								</tr>
								<tr>
									<td>核 准 证：</td><td><a class="hzzshow" ref="${data.data.hzzid}" data-toggle="modal" href="#myModal3">查看</a></td>
								</tr>
								<tr>
									<td>所属公司：</td><td>${data.data.ssgs}</td>
								</tr>
								<tr>
									<td>实际速度：</td><td>${data.data.jssd}km/h</td>
								</tr>
								<tr>
									<td>车辆状态：</td><td>${data.data.clzz}</td>
								</tr>
								<tr>
									<td>检测状态：</td><td>${data.data.jczz}</td>
								</tr>
								<tr>
									<td>设备时间：</td><td>${data.data.sbsj}</td>
								</tr>
								<tr>
									<td>位置信息：</td><td>${formattedAddress}</td>
								</tr>
							</table>
						</div>
						<div class="modal-footer" style="text-align: left;">
							<a href="http://zbusmgr.huayusoft.com:9888/map/index5.html">历史轨迹</a>
						</div>
						`);
						setTimeout(function() {
							gaodemap.showMarker(tempid);
							mapobj.infoWindow.open(mapobj.map, mapobj.alllist[tempid].marker.getPosition());
							$loadingimage.fadeOut();
						}, 200);
					});

				} else {
					$loadingimage.fadeOut();
				}
			},
			error: function(res) {
				console.log(CLinfo.path, res);
				$loadingimage.fadeOut();
			}
		});
	}
}