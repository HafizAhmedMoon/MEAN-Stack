var app;
app = angular.module('App', ['ui.router'])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        function makeRequest(url, cb) {
            try {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false); // Note: synchronous
                xhr.send();
                cb(null, xhr.response);
            } catch(e) {
                cb(e)
            }
        }

        makeRequest('config.json', function (err, file) {
            if(err) {
                app.configFile = {};
                return console.error("config file not found", err);
            }
            try {
                app.configFile = JSON.parse(file);
            }
            catch (e) {
                app.configFile = {};
                console.error("JSON is invalid", e)
            }
            if(Array.isArray(app.configFile)){
                app.configFile = {};
                console.error("JSON is invalid")
            }
        });

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
        $locationProvider.hashPrefix(typeof app.configFile.hashPrefix === 'string'?app.configFile.hashPrefix:'');
        $locationProvider.html5Mode(app.configFile.HTML5Mode?true:false);
    })
;