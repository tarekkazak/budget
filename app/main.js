/**
 * Created by tarekkazak on 2014-04-07.
 */
requirejs.config({
    paths: {
        angular: '../bower_components/angular/angular',
        lodash: '../bower_components/lodash/dist/lodash.min',
        spin: '../bower_components/spin.js/spin',
        angularSpinner: '../bower_components/angular-spinner/angular-spinner.min',
        angularUIBootstrap: '../js/ui-bootstrap-tpls-0.10.0.min',
        ngGrid: '../bower_components/ng-grid/build/ng-grid.debug',
        jquery: '../bower_components/jquery/jquery.min'
    },
    urlArgs : 'd=' + (new Date()).getTime(),
    shim: {
        'angular' : {
            exports : 'angular',
            deps : ['jquery']
        },
        'angularSanitize': {
            deps : ['angular']
        },
        'angularSpinner': {
            deps : ['angular']
        },
        'angularUIBootstrap': {
            deps : ['angular']
        },
        'lodash': {
            exports : '_'
        },
        'ngGrid' : {
            deps : ['angular', 'jquery']
        }

    }
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";

require( [
    'angular',
    'app'
], function(angular, app) {
    'use strict';
    angular.bootstrap(document, [app['name']]);
    angular.element(document).ready(function() {
        angular.resumeBootstrap([app['name']]);
    });
});