require(["esri/map", "esri/geometry/Extent", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/FeatureLayer", "esri/tasks/query", "esri/layers/GraphicsLayer",
		"esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/config",
		"dojo/_base/Color", "dojo/dom", "dojo/on","dojo/_base/connect", "my/changeLabel", "dojo/domReady!"
], function(Map, Extent, ArcGISTiledMapServiceLayer, FeatureLayer, Query, GraphicsLayer, SimpleFillSymbol,
	SimpleLineSymbol, config, Color, dom, on, connect,changeLabel) {
	config.defaults.io.proxyUrl = "http://127.0.0.1:8081/proxy.php"
	config.defaults.io.alwaysUseProxy = true;
	var initExtent = new Extent({
		"xmin": -38273857.8867017,
		"ymin": -6002429.431857325,
		"xmax": -17336227.098831795,
		"ymax": 9651873.96094261,
		"spatialReference": {
			"wkid": 102100
		}
	});
	var map = new Map("mapDiv", {
		extent: initExtent
	});
	window.map = map;
	var baseMapLayer = new ArcGISTiledMapServiceLayer("http://localhost:6080/arcgis/rest/services/demo11/MapServer");
	map.addLayer(baseMapLayer);
	var countriesLayer = new FeatureLayer("http://localhost:6080/arcgis/rest/services/countries/MapServer/0", {
		mode: FeatureLayer.MODE_SELECTION,
		outFields: "*"
	});
	window.inputCurrencyCountry = new GraphicsLayer();
	window.outputCurrencyCountry = new GraphicsLayer();
	map.addLayers([inputCurrencyCountry, outputCurrencyCountry]);
	var initQuery_1 = new Query();
	var initQuery_2 = new Query();
	var query = new Query();
	var symbolFrom = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 0]), 1), new Color([0, 255, 0, 0.25]));
	var symbolTo = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1), new Color([255, 0, 0, 0.25]));

	//下面一行代码通过dom节点来获取节点的作用域活父作用域，该作用域是就是controller中声明的$scope

	var theScope = angular.element(dom.byId('inputMoney')).scope();
	initQuery_1.where = "CurrencyCode='CNY'";
	initQuery_2.where = "CurrencyCode='USD'";
	countriesLayer.selectFeatures(initQuery_1, FeatureLayer.SELECTION_NEW, function(results) {
		var length = results.length;
		if (length) {
			for (var i = 0; i < length; i++) {
				window.outputCurrencyCountry.add(results[i].setSymbol(symbolTo));
			}
		}
	});
	countriesLayer.selectFeatures(initQuery_2, FeatureLayer.SELECTION_NEW, function(results) {
		var length = results.length;
		if (length) {
			for (var i = 0; i < length; i++) {
				window.inputCurrencyCountry.add(results[i].setSymbol(symbolFrom));
			}

		}
	});
	connect.connect(map, "onClick", function(evt) {
		query.geometry = evt.mapPoint;
		query.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
		if ($('#fromCurrencyCheck').bootstrapSwitch('status')) {
			window.inputCurrencyCountry.clear();
			countriesLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function(results) {
				if (results.length == 1) {
					window.inputCurrencyCountry.add(results[0].setSymbol(symbolFrom));
					window.inputCurrencyCountry.refresh();
					window.outputCurrencyCountry.refresh();
					//获取到作用域后通过作用域来改变controller中的model值。
					theScope.inputCurrency = results[0].attributes.CurrencyCode;
					theScope.query=results[0].attributes.CurrencyCode;
					theScope.$apply('changeCurrency()')

				}
			});
		} else if ($('#toCurrencyCheck').bootstrapSwitch('status')) {
			window.outputCurrencyCountry.clear();
			countriesLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function(results) {
				if (results.length == 1) {
					window.outputCurrencyCountry.add(results[0].setSymbol(symbolTo));
					window.inputCurrencyCountry.refresh();
					window.outputCurrencyCountry.refresh();
					theScope.query=results[0].attributes.CurrencyCode;
					theScope.outputCurrency = results[0].attributes.CurrencyCode;
					theScope.$apply('changeCurrency()');

				}
			})
		}


	})


})