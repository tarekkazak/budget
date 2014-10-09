/**
 * Created by tarekkazak on 2014-05-15.
 */
define([
    'lodash',
    'model/budgetAppModel'], function (_, budgetAppModel) {
    'use strict';

    /* Controllers */

    return function ($scope, $modal, DataService) {

        var isNew = false,
            loadedExpenseReport = budgetAppModel.loadedExpenseReport,
            modalInstance;

        $scope.dataLoaded = budgetAppModel.dataLoaded;

        DataService.get().then(function(res) {
            var data = res.data;
            budgetAppModel.siteData = data;
            budgetAppModel.setWishlist(budgetAppModel.siteData.content.wishlist);
            budgetAppModel.setTags(budgetAppModel.siteData.content.tags);
            budgetAppModel.setUpcoming(_.map(budgetAppModel.siteData.content.upcoming, function(item) {
                item.date = new Date(item.date);
                return item;
            }));
        });

        budgetAppModel.registerForUpdate('dataLoaded', function(value) {
            $scope.dataLoaded = value;
        });

        budgetAppModel.registerForUpdate('tags', function(value) {
            $scope.tags = value;
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

        $scope.openQuickEntryDialog = function() {
            modalInstance = $modal.open({
                templateUrl: 'partials/quick-entry-modal.html'
            });
            modalInstance.opened.then(function () {
                $scope.selectedMonth = new Date().getMonth() + 1;
                $scope.selectedYear = new Date().getFullYear();
            });

        };

        $scope.submitQuickEntry = function() {
            $scope.closeQuickEntry();
        };

        $scope.closeQuickEntry = function() {
            $scope.$close();
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


        function getBudgetFromHistory() {
            if (!_.isUndefined($scope.selectedMonth) && !_.isUndefined($scope.selectedYear)) {
                var diff, allTags, children, allPayments, existingTags, allTagLabels, diffTags;

                if (loadedExpenseReport) {
                    //clean previously loaded expense report that may not have been saved
                    budgetAppModel.removeCircularReferencesFromChildExpenses(budgetAppModel.loadedExpenseReport.expenses);
                }
                loadedExpenseReport = _.findWhere(budgetAppModel.siteData.content.history, {"month" : $scope.selectedMonth, "year" : $scope.selectedYear});

                if (loadedExpenseReport) {
                    budgetAppModel.loadedExpenseReport = loadedExpenseReport;
                    //if legacy report
                    if(loadedExpenseReport.expenses) {
                        allPayments = _.pluck(loadedExpenseReport.expenses, 'payments');
                        allPayments = _(allPayments).compact().flatten().value();
                        allPayments = allPayments.concat(_(loadedExpenseReport.expenses).pluck('children').compact().flatten().pluck('payments').flatten().value());

                    } else {
                        allPayments = loadedExpenseReport.payments;
                    }
                    allTagLabels = _(allPayments).pluck('tags').flatten().compact().uniq();
                    allTags = allTagLabels.map(function(tag){
                        return {
                            "label" : tag,
                            "id" : new Date().getTime()
                        };
                    }).value();
                    if(!budgetAppModel.siteData.content.tags) {
                        budgetAppModel.siteData.content.tags = allTags;
                        budgetAppModel.setTags(budgetAppModel.siteData.content.tags);
                    } else {
                        existingTags = _(budgetAppModel.siteData.content.tags).pluck('label').value();
                        diff = existingTags.length > allTags.length ? _.difference(existingTags, allTagLabels) : _.difference(allTagLabels, existingTags);
                        diffTags = diff.map(function(tag){
                            return {
                                "label" : tag,
                                "id" : new Date().getTime()
                            };
                        }).value();
                        budgetAppModel.siteData.content.tags = budgetAppModel.siteData.content.tags.concat(diffTags);
                        budgetAppModel.setTags(budgetAppModel.siteData.content.tags);
                    }
                    budgetAppModel.setTotalFunds(loadedExpenseReport.totalFunds);
                    budgetAppModel.setIntialFunds(loadedExpenseReport.initialFunds);
                    budgetAppModel.setPayments(allPayments);
                    budgetAppModel.isNew = false;
                } else {

                    budgetAppModel.loadedExpenseReport = {
                        year : $scope.selectedYear,
                        month : $scope.selectedMonth,
                        payments : []
                    };
                    budgetAppModel.setPayments(budgetAppModel.loadedExpenseReport.payments);
                    budgetAppModel.isNew = true;
                }

            }
        }

    };


});
