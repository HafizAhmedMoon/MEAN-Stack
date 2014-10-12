app.directive('loading', function ($http) {
    return {
        replace: true,
        template: '<div class="loading"></div>',
        link: function (scope, elm) {
            var isLoading = function () {
                var r = $http.pendingRequests.filter(function (r, i) {
                    var urls = [];
                    return !(urls.some(function (u) {
                        return r.url === u || r.url === location.origin + u
                    }))
                });
                return r.length > 0;
            };
            scope.$watch(isLoading, function (v) {
                if (v) {
                    elm.show();
                    document.body.style.overflow = "hidden"
                } else {
                    elm.hide();
                    document.body.style.overflow = "visible"
                }
            });
        }
    }
}).directive('alerts', function () {
    return {
        template: '<div class="container" ng-if="alert">' +
            '<div class="alert alert-{{alert.type}}" ng-class="{\'alert-dismissible\':!alert.dismiss}">' +
            '<button ng-if="!alert.dismiss" type="button" class="close" ng-click="closeAlert($index)"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            '<span class="text"><strong>{{alert.title}}</strong> {{alert.msg}}</span>' +
            '</div>' +
            '</div>',
        link: function ($scope, ele) {
            $scope.closeAlert = function () {
                $scope.alert = null;
            };
            $scope.$on('showAlert', function (e, obj) {
                $scope.alert = obj;
                $scope.$$phase || $scope.$digest();
                setTimeout(function () {
                    $('.text', ele).html(obj.msg);
                    $scope.$$phase || $scope.$digest();
                });
            });
            $scope.$on('removeAlert', function () {
                $scope.closeAlert()
            });
        }
    }
});