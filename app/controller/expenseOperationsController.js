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
                $scope.totalFunds = Number(value).toFixed(2);
            });

            budgetAppModel.registerForUpdate('initialFunds', function (value) {
                $scope.initialFunds = Number(value).toFixed(2);
            });

            budgetAppModel.registerForUpdate('upcoming', function (value) {
                $scope.upcoming = value;
            });

            budgetAppModel.registerForUpdate('splits', function (value) {
                $scope.splits = value;
            });

            $scope.newPaymentDate = new Date();

            $scope.selectExpense = function (expense) {
                $scope.selectedExpense = expense;
            };

            $scope.selectPayment = function (expense) {
                $scope.selectedPayment = expense;
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

            $scope.openCal = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
            };


            function applyToExpense(expense, amount, date, tags) {
                var payment;
                tags = budgetAppModel.isNullOrUndefined(tags) ? '' : tags;
                if (_.contains(amount, ',')) {
                    _.each(amount.split(','), function (el) {
                        applyToExpense(expense, el.trim(), date, tags);
                    });
                } else {
                    payment = {
                        amt : amount,
                        date : date,
                        tags : [expense.label].concat(tags.split(','))
                    };
                    if ($scope.selectedSplit) {
                        payment.splitId = $scope.selectedSplit.id;
                        $scope.selectedSplit.payments.push(payment);
                        budgetAppModel.updateRemainderAndTotalPaid([$scope.selectedSplit]);
                    }
                    expense.payments.push(payment);
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

            $scope.$watch('isSplitExpense', function (value) {
                if (value) {
                    $scope.selectedExpense = null;
                }
            });

            $scope.applyPaymentToExpense = function (amount) {
                if ($scope.selectedExpense) {
                    applyToExpense($scope.selectedExpense, amount, $scope.newPaymentDate, $scope.newPaymentTags);
                } else {
                    if ($scope.isSplitExpense) {
                        $scope.splits.push({
                            amt : amount,
                            date : $scope.newPaymentDate,
                            tags : $scope.newPaymentTags,
                            id : new Date().getTime(),
                            remainder : amount,
                            paid : 0,
                            payments : []
                        });
                    }
                }
                $scope.selectedSplit  = $scope.newPaymentTags = $scope.selectedExpense = null;
                $scope.newPaymentDate = new Date();
            };

            $scope.filterExpense = function(expense) {
                return expense.label.toLowerCase().indexOf($scope.form.expenseTA.$viewValue.toLowerCase()) !== -1;
            };

            $scope.deletePayment = function(payment) {
                _.remove($scope.selectedExpense.payments, function(item) {
                    return item === payment;
                });
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
                    budgetAppModel.addNonTemplateProps([$scope.selectedWishlistItem]);
                    $scope.selectedWishlistItem = null;
                }

                if ($scope.selectedUpcomingExpense) {
                    delete $scope.selectedUpcomingExpense.date;
                    $scope.expenses.push($scope.selectedUpcomingExpense);
                    _.remove($scope.upcoming, function(item) {
                        return item === $scope.selectedUpcomingExpense;
                    });
                    budgetAppModel.addNonTemplateProps([$scope.selectedUpcomingExpense]);
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
                    if (budgetAppModel.loadedExpenseReport) {
                        if (budgetAppModel.isNew) {
                            _.merge(budgetAppModel.loadedExpenseReport, {
                                "totalFunds": $scope.totalFunds,
                                "initialFunds": $scope.initialFunds
                            });
                            budgetAppModel.siteData.content.history.push(budgetAppModel.loadedExpenseReport);
                            budgetAppModel.isNew = false;
                        } else {
                            budgetAppModel.loadedExpenseReport.totalFunds = $scope.totalFunds;
                            budgetAppModel.loadedExpenseReport.initialFunds = $scope.initialFunds;
                        }
                        budgetAppModel.removeCircularReferencesFromChildExpenses(budgetAppModel.loadedExpenseReport.expenses);
                    }
                } else {
                    budgetAppModel.siteData.content.expenses = $scope.expenses = stripNonTemplateProps($scope.expenses);
                }

                //Needs to be set as initial load of data creates a copy of this array to be used by $scope
                budgetAppModel.siteData.content.upcoming = $scope.upcoming;

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