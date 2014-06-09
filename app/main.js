/**
 * Created by tarekkazak on 2014-04-07.
 */
requirejs.config({
    paths: {
        angular: '../bower_components/angular/angular.min',
        lodash: '../bower_components/lodash/dist/lodash.min',
        spin: '../bower_components/spin.js/spin-min',
        angularSpinner: '../bower_components/angular-spinner/angular-spinner.min',
        angularUIBootstrap: '../js/ui-bootstrap-tpls-0.10.0.min',
        bootstrap : '../bower_components/bootstrap/dist/js/bootstrap.min',
        jquery : '../bower_components/jquery/jquery.min'
    },
    urlArgs : 'd=' + (new Date()).getTime(),
    shim: {
        'bootstrap' : {
            exports : 'bootstrap'
        },
        'angular' : {
            exports : 'angular'
        },
        'angularSanitize': {
            deps : ['angular']
        },
        'angularSpinner': {
            deps : ['angular']
        },
        'angularUIBootstrap': {
            deps :['angular', 'bootstrap']
        },
        'boostrap' : {
            deps : ['jquery']
        },
        'lodash': {
            exports : '_'
        }

    },
    deps: [
        "jquery"

    ]
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