var rateService = angular.module('angular.rateService', ['ngResource']);
rateService.factory('rateEngine', ['$resource', function($resource) {
	return $resource("http://127.0.0.1\\:8081/proxy.php?http://openexchangerates.org/api/latest.json");
}]);
rateService.factory('getRates', ['rateEngine', function(geometryEngine) {
	//var bufferDeffered = $q.defer();
	return geometryEngine.query();
	//return bufferDeffered.promise;
}]);