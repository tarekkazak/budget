angular.module('budgetApp.model', []);
angular.module('budgetApp.controller', []);
angular.module('budgetApp.service', []);
angular.module('budgetApp.directive', []);
var budgetApp = angular.module('budgetApp', [
    'angularSpinner',
    'ui.bootstrap',
    'ngGrid',
    'budgetApp.model',
    'budgetApp.service',
    'budgetApp.directive',
    'budgetApp.controller'
]);





