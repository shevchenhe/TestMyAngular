/*
1、首先还是创建一个模块，其依赖模块就是ngResource
 */
var rateService = angular.module('angular.rateService', ['ngResource']);
/*
2、在rateService模块中利用factory方法，创建一个服务，服务名称为rateEngine，然后需要调用ngResource中的$resource服务。这个地方
	也用到了AngularJS的DI系统。
	$resource服务使得用短短的几行代码就可以创建一个RESTful客户端。我们的应用使用这个客户端来代替底层的$http服务。
 */
rateService.factory('rateEngine', ['$resource', function($resource) {
	return $resource("http://127.0.0.1\\:8081/proxy.php?http://openexchangerates.org/api/latest.json");
}]);
rateService.factory('currencyName',['$resource',function($resource){
	return $resource("resource/name.json");
}])
rateService.factory('getRates', ['rateEngine', function(geometryEngine) {
	//var bufferDeffered = $q.defer();
	return geometryEngine.query();
	//return bufferDeffered.promise;
}]);