var app;
app = angular.module('App', ['config','ui.router'])
    .config(function ($stateProvider, $urlRouterProvider, AuthProvider) {
        AuthProvider.setDefaultState('app.home');
        AuthProvider.setLoginFunc('isLogin');

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
                pageTitle: true,
                authenticate: true
            });
    })
    .factory('isLogin',function () {
        return function(){
            return true
        }
    })
;