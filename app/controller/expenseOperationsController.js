/**
 * Created by tarekkazak on 2014-05-15.
 */

define(['lodash',
        'spin',
        'model/budgetAppModel'],
    function (_, Spinner, budgetAppModel) {
        'use strict';

        return function ($scope, $modal, $timeout, $window, $http, $interpolate, $templateCache) {
            $window.Spinner = Spinner;
            var modalInstance, report, reportTemplateFunc;
            $scope._ = _;
            $scope.showFeedback = false;

            reportTemplateFunc = _.template($templateCache.get("reportTemplate"));

            budgetAppModel.registerForUpdate('selectedMonth', function (value) {
                $scope.selectedMonth = value;
            });

            budgetAppModel.registerForUpdate('selectedYear', function (value) {
                $scope.selectedYear = value;
            });

            budgetAppModel.registerForUpdate('expenses', function (value) {
                $scope.expenses = value;
            });

            budgetAppModel.registerForUpdate('expenses', function (value) {
                $scope.expenses = value;
            });

            budgetAppModel.registerForUpdate('wishlist', function (value) {
                $scope.wishlist = value;
            });

            budgetAppModel.registerForUpdate('templateMode', function (value) {
                $scope.templateMode = value;
            });

            budgetAppModel.registerForUpdate('inEditMode', function (value) {
                $scope.inEditMode = value;
            });

            budgetAppModel.registerForUpdate('totalFunds', function (value) {
                $scope.totalFunds = value;
            });

            budgetAppModel.registerForUpdate('initialFunds', function (value) {
                $scope.initialFunds = value;
            });

            budgetAppModel.registerForUpdate('upcoming', function (value) {
                $scope.upcoming = value;
            });

            $scope.selectExpense = function (expense) {
                $scope.selectedExpense = expense;
            };

            $scope.selectWishlistItem = function (item) {
                $scope.selectedWishlistItem = item;
            };

            $scope.selectUpcomingExpense = function (item) {
                $scope.selectedUpcomingExpense = item;
            };

            $scope.allExpenses = function() {
                return budgetAppModel.allExpenses();
            };


            function applyToExpense(expense, amount) {
                if (_.contains(amount, ',')) {
                    _.each(amount.split(','), function (el) {
                        applyToExpense(expense, el.trim());
                    });
                } else {
                    expense.payments.push(amount);
                    budgetAppModel.updateRemainderAndTotalPaid([expense]);
                    $scope.totalFunds -= Number(amount);
                }
            }

            function stripNonTemplateProps(expenses) {
                return _.map(expenses, function (el, index, arr) {
                    if (_.has(el, "children")) {
                        el.children = stripNonTemplateProps(el.children);
                    }
                    return _.pick(el, ["label", 'amt', 'children']);

                });

            }

            $scope.applyPaymentToExpense = function (amount) {
                if ($scope.selectedExpense) {
                    applyToExpense($scope.selectedExpense, amount);
                    $scope.selectedExpense = null;

                }
            };

            $scope.filterExpense = function(expense) {
                return expense.label.toLowerCase().indexOf($scope.form.expenseTA.$viewValue.toLowerCase()) !== -1 && (_.isUndefined(expense.skip) || !expense.skip);
            };


            $scope.sendReport = function () {
                report = reportTemplateFunc($scope);

                //show modal spinner until send complete
                modalInstance = $modal.open({
                    templateUrl: 'partials/modal.html',
                    controller: 'expenseOperationsController'

                });

                $http.post('php/contact.php', {"report": report}).
                    success(function (data) {
                        $scope.submitResult = data;
                        closeModal();
                    }).
                    error(function (data) {
                        $scope.submitResult = data;
                        closeModal();
                    });


            };

            $scope.getTotalRemainingExpenses = function() {
                return budgetAppModel.sumValuesForProperty("remainder", 'skip');
            };

            $scope.getTotalPaid = function() {
                return budgetAppModel.sumValuesForProperty("paid");
            };

            $scope.addToExpenses = function () {

                if ($scope.selectedWishlistItem) {
                    $scope.expenses.push($scope.selectedWishlistItem);
                    _.remove($scope.wishlist, $scope.selectedWishlistItem);
                    budgetAppModel.updateRemainderAndTotalPaid([$scope.selectedWishlistItem]);
                    $scope.selectedWishlistItem = null;
                }

                if ($scope.selectedUpcomingExpense) {
                    delete $scope.selectedUpcomingExpense.date;
                    $scope.expenses.push($scope.selectedUpcomingExpense);
                    _.remove($scope.upcoming, $scope.selectedUpcomingExpense);
                    budgetAppModel.updateRemainderAndTotalPaid([$scope.selectedUpcomingExpense]);
                    $scope.selectedUpcomingExpense = null;
                }
            };

            function closeModal() {
                $timeout(function () {
                        //close loading spinner after send email complete and show server feedback
                    modalInstance.close();
                    budgetAppModel.setInEditMode(false);
                    $scope.showFeedback = true;
                    $timeout(function () {
                        //hide feedback message after delay
                        $scope.showFeedback = false;
                    }, 2000);
                }, 3000);
            }

            function clean(expenses) {
                var expensesWithParent =_(expenses).pluck('children').flatten().compact().value();
                _.each(expensesWithParent, function(item) {
                    delete item.parent;
                });
            }

            $scope.isNullOrUndefined = function(obj) {
                return budgetAppModel.isNullOrUndefined(obj);
            };

            $scope.save = function () {


                //show modal spinner until send complete
                modalInstance = $modal.open({
                    templateUrl: 'partials/modal.html',
                    controller: 'expenseOperationsController'

                });

                if (!$scope.templateMode) {
                    if (budgetAppModel.isNew) {
                        budgetAppModel.siteData.content.history.push(
                            {
                                "year": $scope.selectedYear,
                                "month": $scope.selectedMonth,
                                "expenses": $scope.expenses,
                                "totalFunds": $scope.totalFunds,
                                "initialFunds": $scope.initialFunds
                            }
                        );
                        budgetAppModel.isNew = false;
                    } else {
                        budgetAppModel.loadedExpenseReport.totalFunds = $scope.totalFunds;
                        budgetAppModel.loadedExpenseReport.initialFunds = $scope.initialFunds;
                    }
                    clean(budgetAppModel.loadedExpenseReport.expenses);
                } else {
                    budgetAppModel.siteData.content.expenses = $scope.expenses = stripNonTemplateProps($scope.expenses);
                }

                $http.post('php/persistence.php', budgetAppModel.siteData).
                    success(function (data) {
                        closeModal();
                    }).
                    error(function (data) {
                        closeModal();
                    });

            };
        };
    });