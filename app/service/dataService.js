/**
 * Created by tarekkazak on 2014-05-15.
 */
define(['angular'], function(angular) {

    var appService = angular.module('dataService', []);
    appService.factory('DataService', ['$http', function($http) {
        return {
            get : function (callback) {
                    $http.get('data/content.json', {cache : false}).success(callback);
            }
        };
    }]);

});