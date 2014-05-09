var app=angular.module('App',['ngRoute'])
    .config(function($routeProvider, $locationProvider){
        $routeProvider
            .when('/',{
                templateUrl:'/partials/home.html'
            })
            .when('/list',{
                templateUrl:'/partials/list.html'
            })
            .otherwise({ redirectTo:'/' });
        $locationProvider.html5Mode(true);
    })
;