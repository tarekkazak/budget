/**
 * Created by tarekkazak on 2014-05-15.
 */
angular.module('budgetApp.service')
    .factory('DataService', ['$http', function ($http) {
        return (function () {

            return {
                get: function (path) {
                    return $http.get(path);
                },
                post : function(path, data) {
                    return $http.post(path, data);
                },
               delete : function(path) {
                    return $http.delete(path);
               }
            };


        }());
    }]);
