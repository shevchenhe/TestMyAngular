'use strict';

var app = angular.module('myAngularRate', ['angular.rateService']);


app.controller('rateTable',

function($scope, $filter, rateEngine,currencyName) {
	$scope.rates = [];
	$scope.inputMoney = 1000;
	$scope.outputMoney = "";
	$scope.usd2cny = "";
	$scope.inputCurrency = "USD";
	$scope.inputCurrencyRate = 1;
	$scope.outputCurrency = "CNY";
	$scope.outputCurrencyRate = "";
	$scope.ratesObject = {};
	$scope.fromCurrencyCheck=false;
	$scope.toCurrencyCheck=true;
	rateEngine.get({
		app_id: "6957c070c395430a812077a511c5541a"
	}, function(result) {
		$scope.rateDate = result.timestamp;
		//$scope.rates=result.rates;
		angular.forEach(result.rates, function(value, key) {
			var temp = {};
			$scope.ratesObject[key] = {
				nowrate: value
			};
			temp['name'] = key;
			temp['nowrate'] = value;
			this.push(temp);
			if (key == "CNY") {
				$scope.outputCurrencyRate = value;
				$scope.outputMoney = $filter("number")($scope.inputMoney * $scope.outputCurrencyRate / $scope.inputCurrencyRate, 4);
			}
		}, $scope.rates);
		currencyName.get(function(nameresults){
		angular.forEach(nameresults,function(namevalue,key){
			angular.forEach($scope.rates,function(value,index){
				if(value.name==key){
					this[index]['fullname']=namevalue;
				}
			},$scope.rates)

		});
	});

	});
	var recal = function() {
		//$scope.inputCurrencyRate = $scope.ratesObject[$scope.inputCurrency].nowrate;
		//$scope.outputCurrencyRate = $scope.ratesObject[$scope.outputCurrency].nowrate;
		$scope.outputMoney = $filter("number")($scope.inputMoney * $scope.outputCurrencyRate / $scope.inputCurrencyRate, 4);
	};
	$scope.setCurrency = function(index) {
		$scope.fromCurrencyCheck=$('#fromCurrencyCheck').bootstrapSwitch('status');
		$scope.toCurrencyCheck=$('#toCurrencyCheck').bootstrapSwitch('status');
		if ($scope.fromCurrencyCheck) {
			$scope.inputCurrency = $scope.rates[index].name;
			$scope.inputCurrencyRate = $scope.rates[index].nowrate;
			var newcurrencycode=$scope.inputCurrency;
			require(["my/changeLabel"],function(changeLabel){
				changeLabel(window.inputCurrencyCountry,window.outputCurrencyCountry,newcurrencycode,1)
			})
		} else if($scope.toCurrencyCheck) {
			$scope.outputCurrency = $scope.rates[index].name;
			$scope.outputCurrencyRate = $scope.rates[index].nowrate;
			var newcurrencycode=$scope.outputCurrency;
			require(["my/changeLabel"],function(changeLabel){
				changeLabel(window.inputCurrencyCountry,window.outputCurrencyCountry,newcurrencycode,0)
			})
		}
	};
	$scope.changeCurrency = function() {
		$scope.inputCurrencyRate = $scope.ratesObject[$scope.inputCurrency].nowrate;
		$scope.outputCurrencyRate = $scope.ratesObject[$scope.outputCurrency].nowrate;
	}
	$scope.$watch('inputCurrency', recal);
	$scope.$watch('outputCurrency', recal);
	$scope.$watch('inputMoney', recal);

});