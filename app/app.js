
define([
    'angular',
    'controller/gridController',
    'controller/reportSearchController',
    'controller/editorController',
    'controller/expenseOperationsController',
    'service/dataService',
    'angularSpinner',
    'angularUIBootstrap',
    'ngGrid',
    'directive/tagEditor'
], function (angular, gridController, reportSearchController, editorController, expenseOperationsController) {

// Declare app level module which depends on filters, and services

    var budgetApp = angular.module('budgetApp', [
        'angularSpinner',
        'ui.bootstrap',
        'ngGrid',
        'dataService',
        'tagEditorModule'
    ]);

    budgetApp.controller('reportSearchController', ['$scope', '$modal', 'DataService',
        reportSearchController]);
    budgetApp.controller('gridController',
        gridController);
    budgetApp.controller('editorController',
        editorController);
    budgetApp.controller('expenseOperationsController', ['$scope', '$modal', '$timeout', '$window', '$http', '$interpolate', '$templateCache', 'DataService',
        expenseOperationsController]);
    return budgetApp;
});




//routes
//budgetApp.config(['$routeProvider',
//    function($routeProvider) {
//        $routeProvider.
//            when('/about', {
//                templateUrl: 'partials/about.html',
//                controller: 'controller'
//            }).
//            when('/contact', {
//                templateUrl: 'partials/contact.html',
//                controller: 'controller'
//            }).
//            when('/products', {
//                templateUrl: 'partials/products.html',
//                controller: 'controller'
//            }).
//            otherwise({
//                redirectTo: '/home'
//            });
//    }]);


