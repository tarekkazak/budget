/**
 * Created by tarekkazak on 2014-05-15.
 */
define(['angular'], function (angular) {

    var appService = angular.module('dataService', []);
    appService.factory('DataService', ['$http', function ($http) {
        return (function () {
            var promise = $http.get('data/content.json?d=' + new Date().getTime());

            return {
                get: function () {
                    return promise;
                },
                post : function(data) {
                    return $http.post('php/persistence.php', data);
                }
            };


        }());
    }]);

});