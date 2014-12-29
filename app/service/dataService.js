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
                patch : function(path, data) {
                    return $http.patch(path, data);
                },
                put : function(path, data) {
                    return $http.put(path, data);
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
