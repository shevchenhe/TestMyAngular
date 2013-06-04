
'use strict';
/*
这个地方先建立一个angular的模块，第一个参数是模块名称，第二个是依赖。
 */
var app = angular.module('myAngularRate', ['angular.rateService']);

/*
这里，声明一个controller，名字为rateTable，第二个参数为该controller的构造函数。这个地方就用到了AngularJS中依赖注入。
 */
app.controller('rateTable',

function($scope, $filter, rateEngine,currencyName) {
	/*
	这些就是controller作用域中的model，也就是数据。
	 */
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
	/*
	调用rateService模块中的rateEngine这个服务，来获取汇率信息，并将获取到的信息赋值给controller中声明的变量。
	 */
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
	/*
	recal函数的主要功能就是在输入货币、输出货币、输入金额变的情况下，重新计算结果
	 */
	var recal = function() {
		//$scope.inputCurrencyRate = $scope.ratesObject[$scope.inputCurrency].nowrate;
		//$scope.outputCurrencyRate = $scope.ratesObject[$scope.outputCurrency].nowrate;
		$scope.outputMoney = $filter("number")($scope.inputMoney * $scope.outputCurrencyRate / $scope.inputCurrencyRate, 4);
	};
	/*
	setCurrency函数会改变scope中一些模型的之，而且改函数还负责与地图进行交互。与地图进行交互的模块是利用Dojo写的changeLabel。
	 */
	$scope.setCurrency = function(index) {
		$scope.fromCurrencyCheck=$('#fromCurrencyCheck').bootstrapSwitch('status');
		$scope.toCurrencyCheck=$('#toCurrencyCheck').bootstrapSwitch('status');
		if ($scope.fromCurrencyCheck) {
			$scope.inputCurrency = $scope.rates[index].name;
			$scope.inputCurrencyRate = $scope.rates[index].nowrate;
			var newcurrencycode=$scope.inputCurrency;
			//与地图交互，改变地图的graphic
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
	/*
	$scope.$watch的作用是监测controller作用域中的model的变化情况，如果有变化，就会出发相应的函数。该函数十分使用。
	 */
	$scope.$watch('inputCurrency', recal);
	$scope.$watch('outputCurrency', recal);
	$scope.$watch('inputMoney', recal);

});