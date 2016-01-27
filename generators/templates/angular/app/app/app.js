var app = angular.module("app", [
	'ngRoute',
]);

// Fastclick
if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {
		FastClick.attach(document.body);
	}, false);
}