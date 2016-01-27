app.config(['$routeProvider', 
	function($routeProvider) {

		$routeProvider.
			when('/', {
				redirectTo: '/'
			}).

			// Errors
			when('/401', {
				templateUrl: 'app/components/errors/errorView.html',
				controller: 'errorController'
			}).
			when('/403', {
				templateUrl: 'app/components/errors/errorView.html',
				controller: 'errorController'
			}).
			when('/404', {
				templateUrl: 'app/components/errors/errorView.html',
				controller: 'errorController'
			}).
			when('/500', {
				templateUrl: 'app/components/errors/errorView.html',
				controller: 'errorController'
			}).

			// Default
			otherwise({
				redirectTo: '/404'
			});

	}
]);