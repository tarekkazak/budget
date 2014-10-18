var budgetApp = angular.module('budgetApp', [
    'angularSpinner',
    'ui.bootstrap',
    'ngGrid',
<<<<<<< HEAD
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
=======
    'dataService',
    'model.mainModel',
    'budgetApp.directive',
    'budgetApp.reportSearchContoller',
    'budgetApp.editorController',
    'budgetApp.gridController',
    'budgetApp.expenseOperationsController']);
>>>>>>> 09e9dc13bd10f1c65ace6829a12afe5cdaf23572






