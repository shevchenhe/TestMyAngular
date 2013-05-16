'use strict';

var app = angular.module('myAngularRate', ['angular.rateService']);


app.controller('rateTable',

function($scope,$filter, rateEngine) {
	$scope.rates = [];
	$scope.inputMoney = 1000;
	$scope.outputMoney = "";
	$scope.usd2cny = "";
	$scope.inputCurrency = "USD";
	$scope.inputCurrencyRate = 1;
	$scope.outputCurrency = "CNY";
	$scope.outputCurrencyRate = "";
	rateEngine.get({
		app_id: "6957c070c395430a812077a511c5541a"
	}, function(result) {
		$scope.rateDate = result.timestamp;
		//$scope.rates=result.rates;
		angular.forEach(result.rates, function(value, key) {
			this.push({
				name: key,
				nowrate: value
			});
			if (key == "CNY") {
				$scope.outputCurrencyRate = value;
				$scope.outputMoney = $filter("number")($scope.inputMoney * $scope.outputCurrencyRate / $scope.inputCurrencyRate,4);
			}
		}, $scope.rates);

	});
	var recal = function() {
		$scope.outputMoney = $filter("number")($scope.inputMoney * $scope.outputCurrencyRate / $scope.inputCurrencyRate,4);
	};
	$scope.setCurrency = function(index, flag) {
		if (flag) {
			$scope.inputCurrency = $scope.rates[index].name;
			$scope.inputCurrencyRate = $scope.rates[index].nowrate;
		} else {
			$scope.outputCurrency = $scope.rates[index].name;
			$scope.outputCurrencyRate = $scope.rates[index].nowrate;
		}
	}
	$scope.$watch('inputCurrency', recal);
	$scope.$watch('outputCurrency', recal);
	$scope.$watch('inputMoney', recal);

});