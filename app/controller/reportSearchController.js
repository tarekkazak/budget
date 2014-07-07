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
            budgetAppModel.setWishlist(budgetAppModel.siteData.content.wishlist);
            budgetAppModel.setUpcoming(_.map(budgetAppModel.siteData.content.upcoming, function(item) {
                item.date = new Date(item.date);
                return item;
            }));
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

        budgetAppModel.registerForUpdate('selectedMonth', function(value) {
            $scope.selectedMonth = value;
        });

        budgetAppModel.registerForUpdate('selectedYear', function(value) {
            $scope.selectedYear = value;
        });

        budgetAppModel.registerForUpdate('upcoming', function(value) {
            $scope.upcoming = value;
        });

        $scope._ = _;

        $scope.$watch("selectedMonth", function(value) {
            getBudgetFromHistory();
        });

        $scope.$watch("selectedYear", function(value) {
            getBudgetFromHistory();
        });


        $scope.updateSelectedMonth = function(month) {
            budgetAppModel.setSelectedMonth(month);
        };

        $scope.updateSelectedYear = function(year) {
            budgetAppModel.setSelectedYear(year);
        };


        $scope.loadTemplate = function() {
            budgetAppModel.setTemplateMode(true);
            budgetAppModel.setExpenses(budgetAppModel.siteData.content.expenses);
            budgetAppModel.setSelectedMonth(undefined);
            budgetAppModel.setSelectedYear(undefined);
            budgetAppModel.selectedExpense = null;
        };

        $scope.deleteUpcoming = function (expense) {
            _.remove($scope.upcoming, function(item) {
                return expense === item;
            });

        };

        $scope.isComingNextMonth = function(date) {
            var today = new Date();
            return date.getFullYear() === today.getFullYear() && (date.getMonth() - today.getMonth()) <= 1;
        };

        $scope.openCal = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
        };

        function convertPayments(expenses) {
            var allExpenses, groups = _.groupBy(expenses, function (expense) {
                return !_.has(expense, "children");
            });
            allExpenses = groups['true'].concat(_(groups['false']).pluck('children').flatten().value());
            _.each(allExpenses, function (expense) {
                _.each(expense.payments, function (payment, index, payments) {
                    payments[index] = !_.isObject(payment) ? {amt : Number(payment), tags : [expense.label], date : new Date()} : payment;
                });
            });
        }

        function getBudgetFromHistory() {
            if (!_.isUndefined($scope.selectedMonth) && !_.isUndefined($scope.selectedYear)) {
                var parts, newExpenses, children;
                if (loadedExpenseReport) {
                    //clean previously loaded expense report that may not have been saved
                    budgetAppModel.removeCircularReferencesFromChildExpenses(budgetAppModel.loadedExpenseReport.expenses);
                }
                loadedExpenseReport = _.findWhere(budgetAppModel.siteData.content.history, {"month" : $scope.selectedMonth, "year" : $scope.selectedYear});

                if (loadedExpenseReport) {
                    budgetAppModel.loadedExpenseReport = loadedExpenseReport;
                    budgetAppModel.updateRemainderAndTotalPaid(loadedExpenseReport.expenses);
                    convertPayments(loadedExpenseReport.expenses);
                    budgetAppModel.setExpenses(loadedExpenseReport.expenses);
                    budgetAppModel.setTotalFunds(loadedExpenseReport.totalFunds);
                    budgetAppModel.setIntialFunds(loadedExpenseReport.initialFunds);
                    budgetAppModel.isNew = false;
                } else {
                    newExpenses = budgetAppModel.siteData.content.expenses.concat();
                    parts = _.groupBy(newExpenses, function(expense) {
                        return !_.has(expense, "children");
                    });
                    budgetAppModel.addNonTemplateProps(parts["true"]);

                    children = _.pluck(parts["false"], "children");
                    children = _.flatten(children);

                    budgetAppModel.addNonTemplateProps(children);
                    budgetAppModel.setExpenses(newExpenses);
                    //TODO: add more base props like month and year
                    budgetAppModel.loadedExpenseReport = {
                        expenses : newExpenses
                    };
                    budgetAppModel.isNew = true;
                }
                budgetAppModel.setTemplateMode(false);
                budgetAppModel.setInEditMode(false);

            }
        }

    };


});
