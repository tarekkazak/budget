/**
 * Created by tarekkazak on 2014-05-15.
 */
define([
    'lodash',
    'model/budgetAppModel'], function (_, budgetAppModel) {
    'use strict';

    /* Controllers */

    return function ($scope, DataService) {

        var isNew = false,
            loadedExpenseReport = budgetAppModel.loadedExpenseReport;

        $scope.dataLoaded = budgetAppModel.dataLoaded;
        DataService.get(function(data) {
            budgetAppModel.siteData = data;
        });

        budgetAppModel.registerForUpdate('templateMode', function(value) {
            $scope.templateMode = value;
        });

        budgetAppModel.registerForUpdate('dataLoaded', function(value) {
            $scope.dataLoaded = value;
        });

        budgetAppModel.registerForUpdate('expenses', function(value) {
            $scope.expenses = value;
        });

        $scope._ = _;

        $scope.$watch("selectedMonth", function(value) {
            getBudgetFromHistory();
        });

        $scope.$watch("selectedYear", function(value) {
            getBudgetFromHistory();
        });


        $scope.updateSelectedMonth = function(month) {
            $scope.selectedMonth = month;
        };

        $scope.updateSelectedYear = function(year) {
            $scope.selectedYear = year;
        };


        $scope.loadTemplate = function() {
            budgetAppModel.setTemplateMode(true);
            budgetAppModel.setExpenses(budgetAppModel.siteData.content.expenses);
            $scope.selectedMonth = undefined;
            $scope.selectedYear = undefined;
            budgetAppModel.selectedExpense = null;
        };

        function addNonTemplateProps(arr) {
            _.each(arr, function(el) {
                el.remainder = Number(el.amt);
                el.payments = [];
                el.paid = 0;
                el.skip = false;
                el.tags = [];
            });
        }

        function getBudgetFromHistory() {
            if (!_.isUndefined($scope.selectedMonth) && !_.isUndefined($scope.selectedYear)) {
                var parts, newExpenses, children;
                loadedExpenseReport = _.findWhere(budgetAppModel.siteData.content.history, {"month" : $scope.selectedMonth, "year" : $scope.selectedYear});

                if (loadedExpenseReport) {
                    budgetAppModel.loadedExpenseReport = loadedExpenseReport;
                    budgetAppModel.updateRemainderAndTotalPaid(loadedExpenseReport.expenses);
                    budgetAppModel.setExpenses(loadedExpenseReport.expenses);
                    budgetAppModel.setTotalFunds(loadedExpenseReport.totalFunds);
                    budgetAppModel.isNew = false;
                } else {
                    newExpenses = budgetAppModel.siteData.content.expenses.concat();
                    parts = _.groupBy(newExpenses, function(expense) {
                        return !_.has(expense, "children");
                    });
                    addNonTemplateProps(parts["true"]);

                    children = _.pluck(parts["false"], "children");
                    children = _.flatten(children);

                    addNonTemplateProps(children);
                    budgetAppModel.setExpenses(newExpenses);
                    budgetAppModel.isNew = true;
                }
                budgetAppModel.setTemplateMode(false);
                budgetAppModel.setInEditMode(false);
                budgetAppModel.setWishlist(budgetAppModel.siteData.content.wishlist);
            }
        }

    };


});
