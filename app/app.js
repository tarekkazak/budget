var budgetApp = angular.module('budgetApp', ['ui.bootstrap', 'ngRoute', 'ngSanitize','angularSpinner']);



budgetApp.controller('controller', ['$scope', '$http', '$modal', '$timeout', function ($scope, $http, $modal, $timeout) {

    //fetch content data
    $http.get('data/content.json').success(function(data) {
        var siteData = data;
        var modalInstance;
        var isNew = false;
        var loadedExpenseReport;
        var expensesBackup = [];

        $scope.selectedMonth;
        $scope.selectedYear;
        $scope.expenses = [];

        $scope.$watch("selectedMonth", function(value) {
            getBudgetFromHistory();
        });

        $scope.$watch("selectedYear", function(value) {
            getBudgetFromHistory();
        });

        $scope.getTotalRemainingExpenses = function() {
            return sumValuesForProperty("remainder");
        }

        $scope.getTotalPaid = function() {
            return sumValuesForProperty("paid");

        }

        function sumValuesForProperty(property) {
            var total = 0, parts = _.partition($scope.expenses, function(expense) {return !_.has(expense, "children");}), values = _.pluck(parts[0], property),
                childrenValues = _.pluck(_.flatten(_.pluck(parts[1], "children")), property);
            _.each(values.concat(childrenValues), function(el, index, arr) {
                if(Number(el) > 0) {
                    total += Number(el);
                }
            }, this);
            return total;
        }

        $scope.updateSelectedMonth = function(month) {
            $scope.selectedMonth = month;
        }

        $scope.updateSelectedYear = function(year) {
            $scope.selectedYear = year;
        }

        $scope.selectExpense = function(expense) {
            $scope.selectedExpense = expense;
        }

        $scope.startEditMode = function() {
            $scope.inEditMode = true;
            expensesBackup = $scope.expenses.concat();
        }

        $scope.cancelEditMode = function() {
            $scope.inEditMode = false;
            $scope.expenses = expensesBackup;
        }

        $scope.removeExpense = function(expense, parent) {
            if(parent) {
                parent.children = _.without(parent.children, expense);
            } else {
                $scope.expenses = _.without($scope.expenses, expense);
            }

        }

        $scope.applyPaymentToExpense = function(amount) {
           $scope.selectedExpense.remainder -= amount;

            $scope.selectedExpense.paid += Number(amount);
            $scope.selectedExpense.payments.push(Number(amount));
            $scope.totalFunds -= amount;
            //$scope.selectedExpense = null;
        }

        $scope.updateExpenseAmount = function (expense, amt) {
            var delta = expense.amt - amt;
            if(expense.hasOwnProperty("remainder")) {
                expense.remainder += delta;
            }
            expense.amt = Number(amt);
        }

        $scope.zeroOutExpense = function () {
            $scope.totalFunds -= $scope.selectedExpense.amt;
            $scope.selectedExpense.paid = $scope.selectedExpense.amt;
            $scope.selectedExpense.push($scope.selectedExpense.amt);
            $scope.selectedExpense.amt = 0;
            $scope.selectedExpense = null;

        }

        $scope.addField = function() {
            if($scope.selectedExpense) {
                $scope.selectedExpense.children.push({"label" : $scope.newFieldName, "amt" : Number($scope.newFieldAmt), "paid" : 0, "payments" : []});
            } else {
                $scope.expenses.push({"label" : $scope.newFieldName, "amt" : Number($scope.newFieldAmt), "paid" : 0, "payments" : []});
            }
            $scope.selectedExpense = null;
        }

        $scope.addCategory = function() {
            $scope.expenses.push({"label" : $scope.newCategoryName, "children" : []});
        }


        //Send contact form to server for email
        $scope.showFeedback = false;
        $scope.sendMail = function() {

            if ($scope.contactForm.$valid) {

                    //show modal spinner until send complete
                    modalInstance = $modal.open({
                    templateUrl: 'partials/modal.html',
                    controller: 'controller'

                });

                $http.post('php/contact.php',{"lang" : $scope.lang ,"name": $scope.name, "email": $scope.email, "subject": $scope.subject, "message": $scope.message}).
                    success(function(data) {
                        $scope.submitResult = data;
                        cleanForm();
                    }).
                    error(function(data) {
                        $scope.submitResult = data;
                        cleanForm();
                    });

            }
        }

        $scope.save = function() {


            //show modal spinner until send complete
            modalInstance = $modal.open({
                templateUrl: 'partials/modal.html',
                controller: 'controller'

            });

            if(isNew) {
                siteData.content.history.push({"year": $scope.selectedYear,"month" : $scope.selectedMonth, "expenses" : $scope.expenses, "totalFunds" : $scope.totalFunds});
                isNew = false;
            } else {
                loadedExpenseReport.totalFunds = $scope.totalFunds;
            }

            if($scope.updateTemplate) {
                siteData.content.expenses = stripRemainder($scope.expenses.concat());
            }

            $http.post('php/persistence.php',siteData).
                success(function(data) {
                    closeModal();
                }).
                error(function(data) {
                    closeModal();
                });

        }

        function stripRemainder(expenses) {
            _.each(expenses, function(el, index, arr) {
                if(_.has(el, "children")) {
                    stripRemainder(el.children)
                } else {
                    el = _.omit(el, "remainder");
                }
            });

            return expenses;
        }

        function getBudgetFromHistory() {
            if(!_.isUndefined($scope.selectedMonth) && !_.isUndefined($scope.selectedYear)) {
                var parts, newExpenses, children,
                    addRemainder = function(arr) {
                        _.each(arr, function(el) {
                            el.remainder = el.amt;
                        });
                    };
                loadedExpenseReport = _.findWhere(siteData.content.history, {"month" : $scope.selectedMonth, "year" : $scope.selectedYear});

                if(loadedExpenseReport) {
                    $scope.expenses = loadedExpenseReport.expenses;
                    $scope.totalFunds = loadedExpenseReport.totalFunds;
                } else {
                    newExpenses = siteData.content.expenses.concat();
                    parts =_.partition(newExpenses, function(expense) {
                        return !_.has(expense, "children");
                    });
                    addRemainder(parts[0]);

                    children =_.pluck(parts[1], "children");
                    children =_.flatten(children);

                    addRemainder(children);
                    $scope.expenses = newExpenses;
                    isNew = true;
                }
            }
        }


        function closeModal() {
            $timeout(function() {
                    //close loading spinner after send email complete and show server feedback
                    modalInstance.close();
                    $scope.inEditMode = false;
                    $scope.showFeedback = true;
                    $timeout(function() {
                        //hide feedback message after delay
                        $scope.showFeedback = false;
                    }, 2000);
                }, 3000

            );
        }

        //Reset contact form
        function cleanForm() {
            $scope.name = "";
            $scope.email = "";
            $scope.subject = "";
            $scope.message = "";
            $scope.contactForm.$setPristine();
            closeModal();
        }

    });


}]);


//routes
//budgetApp.config(['$routeProvider',
//    function($routeProvider) {
//        $routeProvider.
//            when('/about', {
//                templateUrl: 'partials/about.html',
//                controller: 'controller'
//            }).
//            when('/contact', {
//                templateUrl: 'partials/contact.html',
//                controller: 'controller'
//            }).
//            when('/products', {
//                templateUrl: 'partials/products.html',
//                controller: 'controller'
//            }).
//            otherwise({
//                redirectTo: '/home'
//            });
//    }]);


