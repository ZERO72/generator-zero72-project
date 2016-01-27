app.controller("errorController", ['$scope', function($scope, $routeParams){
	$scope.errorCode = '/404';
	$scope.title = 'Error';
	$scope.message = 'Please try again or refresh the application.';


	var changeErrorcode = function(errorCode){

		$scope.errorCode = errorCode;

		switch(errorCode) {
			case '/401':
				$scope.title = 'Error 401';
				$scope.message = 'Error description can be added.';
				break;
			case '/403':
				$scope.title = 'Error 403';
				$scope.message = 'Error description can be added.';
				break;
			case '/404':
				$scope.title = 'Error 404';
				$scope.message = 'Error description can be added.';
				break;
			case '/500':
				$scope.title = 'Error 500';
				$scope.message = 'Error description can be added.';
				break;
			default:
				$scope.title = errorCode;
				$scope.message = 'Error description can be added.';
		}

	};


	$scope.$on('$routeChangeSuccess', function(event, next, current) {

		changeErrorcode(next.$$route.originalPath);

	});
}]);