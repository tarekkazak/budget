/**
 * Created by tarekkazak on 2014-05-15.
 */
angular.module('budgetApp.controller')
    .controller('reportSearchController', ['$scope', '$modal', 'budgetAppModel', function ($scope, $modal, budgetAppModel) {

        var isNew = false,
            modalInstance;


        $scope.dataLoaded = budgetAppModel.dataLoaded;

        $scope._ = _;

        $scope.$watch("selectedMonth && selectedYear && reportNotLoaded", function(value) {
            if(value) {
                getBudgetFromHistory();
            }
        });


        $scope.updateSelectedMonth = function(month) {
            $scope.selectedMonth = month;
            $scope.reportNotLoaded = true;
        };

        $scope.updateSelectedYear = function(year) {
            $scope.selectedYear = year;
            $scope.reportNotLoaded = true;
        };

        $scope.deleteUpcoming = function (expense) {
            utils.deleteItemFromList(expense, $scope.upcoming);
        };

        $scope.isComingNextMonth = function(date) {
            var today = new Date();
            return date.getFullYear() === today.getFullYear() && (date.getMonth() - today.getMonth()) <= 1;
        };

        $scope.openCal = function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
        };


        function getBudgetFromHistory() {
            budgetAppModel.getReport($scope.selectedYear, $scope.selectedMonth);
            $scope.reportNotLoaded = false;
        }
    }]);
