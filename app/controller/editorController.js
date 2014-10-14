angular.module('budgetApp.editorController', ['model.mainModel']).
    controller('editorController', ['$scope', '$http', '$modal', '$timeout', '$window', 'budgetAppModel',
        function ($scope, $http, $modal, $timeout, $window, budgetAppModel) {
    $window.Spinner = Spinner;
    //fetch content data

    var expensesBackup = [];
    budgetAppModel.registerForUpdate('inEditMode', function (value) {
        $scope.inEditMode = value;
    });

    budgetAppModel.registerForUpdate('expenses', function (value) {
        $scope.expenses = value;
    });

    budgetAppModel.registerForUpdate('wishlist', function (value) {
        $scope.wishlist = value;
    });

    budgetAppModel.registerForUpdate('upcoming', function (value) {
        $scope.upcoming = value;
    });


    $scope._ = _;
    $scope.upcomingExpenseDate = new Date();
    $scope.isNullOrUndefined = function(obj) {
        return budgetAppModel.isNullOrUndefined(obj);
    }
    $scope.expenseType = 'normal';
    $scope.selectExpense = function(expense) {
        $scope.selectedExpense = expense;
    };

    $scope.startEditMode = function() {
        budgetAppModel.setInEditMode(true);
        expensesBackup = $scope.expenses.concat();
    };

    $scope.cancelEditMode = function() {
        budgetAppModel.setInEditMode(false);
        $scope.expenses = expensesBackup;
    };

    $scope.openCal = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };


    $scope.addField = function() {
        var expense = {"label": $scope.newFieldName, "amt": Number($scope.newFieldAmt)};
        budgetAppModel.addNonTemplateProps([expense]);
        switch ($scope.expenseType) {
        case 'wishlist':
            $scope.wishlist.push(expense);
            break;
        case 'upcoming':
            expense.date = $scope.upcomingExpenseDate;
            $scope.upcoming.push(expense);
            break;
        case 'normal':
            if ($scope.selectedExpense) {
                $scope.selectedExpense.children.push(expense);
            } else {
                $scope.expenses.push(expense);
            }
            $scope.selectedExpense = null;
            break;
        }
        $scope.newFieldName = null;
        $scope.newFieldAmt = null;

    };


    $scope.addCategory = function() {
        $scope.expenses.push({"label" : $scope.newCategoryName, "children" : []});
        $scope.newCategoryName = null;
    };

}]);

