var app;
app = angular.module('App', ['ui.router'])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('app', {
                url: '',
                abstract: true,
                controller: 'mainCtrl',
                templateUrl: "/partials/main.html"
            })
            .state('app.home', {
                url: '/',
                templateUrl: '/partials/home.html',
                title: "Test",
                desc: "A Node.js Web Application",
                pageTitle: true
            })
            .state('error', {
                url: '/{error:\.+}',
                templateUrl: "/partials/404.html",
                title: "404",
                desc: "Error occurred! - Page not Found",
                pageTitle: true
            });
        $locationProvider.html5Mode(true);
    })
;