angular.module('budgetApp.model', []);
angular.module('budgetApp.controller', []);
angular.module('budgetApp.service', []);
var budgetApp = angular.module('budgetApp', [
    'angularSpinner',
    'ui.bootstrap',
    'ngGrid',
    'budgetApp.model',
    'budgetApp.service',
    'tagEditorModule',
    'budgetApp.controller'
]);





