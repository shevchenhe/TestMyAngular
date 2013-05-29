define(["esri/layers/FeatureLayer", "esri/tasks/query",
	"esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol","esri/config",
	"dojo/_base/Color"], function(FeatureLayer, Query, SimpleFillSymbol, SimpleLineSymbol,config, Color) {
	return function(inputLayer,outputLayer, newCountryCode, flag) {
		config.defaults.io.proxyUrl="http://127.0.0.1:8081/proxy.php"
	 	config.defaults.io.alwaysUseProxy=true;
		//mapObject.graphics.clear();
		var countriesLayer = new FeatureLayer("http://localhost:6080/arcgis/rest/services/countries/MapServer/0", {
			mode: FeatureLayer.MODE_SELECTION,
			outFields: "*"
		});
		var fromCountry = null;
		var toCountry = null;
		var query = new Query();
		var symbolFrom = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 255, 0]), 1), new dojo.Color([0, 255, 0, 0.25]));
		var symbolTo = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([255, 0, 0, 0.25]));
		query.where = "CurrencyCode='" + newCountryCode + "'";
		if (flag) {
			inputLayer.clear();
			countriesLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function(results) {
				var length = results.length;
				if (length) {
					for (var i = 0; i < length; i++) {
						inputLayer.add(results[i].setSymbol(symbolFrom));
					}
					outputLayer.refresh();
				}
			});
		} else {
			outputLayer.clear();
			countriesLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function(results) {
				var length = results.length;
				if (length) {
					for (var i = 0; i < length; i++) {
						outputLayer.add(results[i].setSymbol(symbolTo));
					}
					inputLayer.refresh();
				}
			});
		}

	}
});