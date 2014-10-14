app.run(function ($rootScope, $state, $http) {

    $state.back = function () {
        if($state.previous)
            $state.go($state.previous)
    };
    /* Set AppName */
    app.configFile.appName = typeof app.configFile.appName === 'string' && app.configFile.appName ? app.configFile.appName : "App";
    $rootScope.appName = app.configFile.appName;

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        $state.previous = fromState.name;

        /* Get Title */
        if (toState.title) {
            $rootScope.title = toState.title;
        }
        /* Get Description */
        if (toState.desc)
            $rootScope.desc = toState.desc;
        /* Set browser Title */
        document.title = '';
        if (app.configFile.showSubTitle && typeof toState.title === 'string' && toState.title && toState.pageTitle) {
            document.title = toState.title;
        }
        if (app.configFile.showTitle) {
            document.title += (document.title ? app.configFile.titlePrefix || ' - ' : '') + app.configFile.appName;
        }

        // Authenticate
        /*if (toState.authenticate === false && userService.isLogin()) {
         event.preventDefault();
         if (!fromState.name) $state.go('app.home');
         } else if (toState.authenticate === true && !userService.isLogin()) {
         event.preventDefault();
         if (!fromState.name) $state.go('app.home');
         }*/
    });
});