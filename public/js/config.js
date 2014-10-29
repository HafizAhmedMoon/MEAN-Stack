!function (w) {
    (function (global) {
        if (typeof global.JSON == "undefined" || !global.JSON) {
            global.JSON = {};
        }

        global.JSON.minify = function (json) {

            var tokenizer = /"|(\/\*)|(\*\/)|(\/\/)|\n|\r/g,
                in_string = false,
                in_multiline_comment = false,
                in_singleline_comment = false,
                tmp, tmp2, new_str = [], ns = 0, from = 0, lc, rc
                ;

            tokenizer.lastIndex = 0;

            while (tmp = tokenizer.exec(json)) {
                lc = RegExp.leftContext;
                rc = RegExp.rightContext;
                if (!in_multiline_comment && !in_singleline_comment) {
                    tmp2 = lc.substring(from);
                    if (!in_string) {
                        tmp2 = tmp2.replace(/(\n|\r|\s)*/g, "");
                    }
                    new_str[ns++] = tmp2;
                }
                from = tokenizer.lastIndex;

                if (tmp[0] == "\"" && !in_multiline_comment && !in_singleline_comment) {
                    tmp2 = lc.match(/(\\)*$/);
                    if (!in_string || !tmp2 || (tmp2[0].length % 2) == 0) {	// start of string with ", or unescaped " character found to end string
                        in_string = !in_string;
                    }
                    from--; // include " character in next catch
                    rc = json.substring(from);
                }
                else if (tmp[0] == "/*" && !in_string && !in_multiline_comment && !in_singleline_comment) {
                    in_multiline_comment = true;
                }
                else if (tmp[0] == "*/" && !in_string && in_multiline_comment && !in_singleline_comment) {
                    in_multiline_comment = false;
                }
                else if (tmp[0] == "//" && !in_string && !in_multiline_comment && !in_singleline_comment) {
                    in_singleline_comment = true;
                }
                else if ((tmp[0] == "\n" || tmp[0] == "\r") && !in_string && !in_multiline_comment && in_singleline_comment) {
                    in_singleline_comment = false;
                }
                else if (!in_multiline_comment && !in_singleline_comment && !(/\n|\r|\s/.test(tmp[0]))) {
                    new_str[ns++] = tmp[0];
                }
            }
            new_str[ns++] = rc;
            return new_str.join("");
        };
    })(w);
    function makeRequest(url, cb) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false); // Note: synchronous
            xhr.send();
            cb(null, xhr.response);
        } catch (e) {
            cb(e)
        }
    }

    angular.module('config', ['ui.router'])
        .provider('Auth', function () {
            var isLogin, state, getFunc = [function (isLoginFac) {
                if (typeof isLoginFac !== "function")
                    console.error('Auth: ' + typeof isLoginFac + ' is not a function');
                else isLogin = isLoginFac;
                return {
                    isLogin: isLogin,
                    state: function () {
                        return state
                    },
                    removeState: function () {
                        state = undefined
                    }
                }
            }];
            return {
                setDefaultState: function (State) {

                    if (typeof State !== "string")
                        console.error('Auth: ' + typeof State + ' is not a state');
                    else state = State;
                },
                setLoginFunc: function (name) {
                    if (getFunc.length === 1)
                        getFunc.unshift(name)
                },
                $get: getFunc
            }
        })
        .config(function ($locationProvider, $stateProvider) {
            makeRequest('config.json', function (err, file) {
                if (err) {
                    w.configFile = {};
                    return console.error("config file not found", err);
                }
                try {
                    w.configFile = JSON.parse(JSON.minify(file));
                }
                catch (e) {
                    w.configFile = {};
                    console.error("JSON is invalid", e)
                }
                if (Array.isArray(w.configFile)) {
                    w.configFile = {};
                    console.error("JSON is invalid")
                }
            });

            if (w.configFile.useErrorPage) {
                $stateProvider.state('error', {
                    url: '/{error:\.+}',
                    templateUrl: "/partials/404.html",
                    title: "404",
                    desc: "Error occurred! - Page not Found",
                    pageTitle: true
                });
            }

            $locationProvider.hashPrefix(typeof w.configFile.hashPrefix === 'string' ? w.configFile.hashPrefix : '');
            $locationProvider.html5Mode(w.configFile.HTML5Mode ? true : false);
        })
        .run(function ($rootScope, $state, Auth) {

            $state.back = function () {
                if ($state.previous)
                    $state.go($state.previous)
            };

            if ($state.get(Auth.state()) === null) {
                console.error('Auth: ' + Auth.state() + ' is not a valid state');
                Auth.removeState();
            } else if (($state.get(Auth.state()).authenticate === false && !!Auth.isLogin() === true) || ($state.get(Auth.state()).authenticate === true && !!Auth.isLogin() === false)) {
                console.error('Auth: authenticate property of default state should not ' + $state.get(Auth.state()).authenticate + ' when isLogin function returns ' + !!Auth.isLogin());
                Auth.removeState();
            }

            /* Set AppName */
            w.configFile.appName = typeof w.configFile.appName === 'string' && w.configFile.appName ? w.configFile.appName : "w";
            $rootScope.appName = w.configFile.appName;

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
                if (w.configFile.showSubTitle && typeof toState.title === 'string' && toState.title && toState.pageTitle) {
                    document.title = toState.title;
                }
                if (w.configFile.showTitle) {
                    document.title += (document.title ? w.configFile.titlePrefix || ' - ' : '') + w.configFile.appName;
                }

                // Authenticate
                if (Auth.isLogin && Auth.state()) {
                    if (toState.authenticate === false && Auth.isLogin()) {
                        event.preventDefault();
                        if (!fromState.name) $state.go(Auth.state());
                    } else if (toState.authenticate === true && !Auth.isLogin()) {
                        event.preventDefault();
                        if (!fromState.name) $state.go(Auth.state());
                    }
                }
            });
        });
}(this);