app.run(function ($rootScope, $state, $http) {
    $state.back = function () {
        $state.go($state.previous)
    };

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        $state.previous = fromState.name;

        /* GetTitle */
        if (toState.title) {
            $rootScope.title = toState.title;
        }
        if (toState.desc)
            $rootScope.desc = toState.desc;

        function setTitle() {
            if (typeof toState.title === 'string' && toState.pageTitle) {
                document.title = toState.title + (typeof app.configFile === 'object' && typeof app.configFile.appName === 'string' ?
                    " - " + app.configFile.appName : '');
            } else if (typeof app.configFile === 'object' && typeof app.configFile.appName === 'string') {
                document.title = app.configFile.appName;
            }
        }

        if (typeof app.configFile !== "object") {
            $http.get('/config.json').success(function (data) {
                if (typeof data !== "object") {
                    try {
                        app.configFile = JSON.parse(data);
                    }
                    catch (e) {
                        console.error("JSON is invalid", e)
                    }
                } else {
                    app.configFile = data;
                }
                if (typeof app.configFile === "object" && app.configFile.appName) {
                    setTitle()
                } else app.configFile = {}
            }, function (err) {
                console.error("config file not found", err)
            });
        } else {
            setTitle()
        }

        // authenticate
        /*if (toState.authenticate === false && userService.isLogin()) {
         event.preventDefault();
         if (!fromState.name) $state.go('app.home');
         } else if (toState.authenticate === true && !userService.isLogin()) {
         event.preventDefault();
         if (!fromState.name) $state.go('app.home');
         }*/
    });
});