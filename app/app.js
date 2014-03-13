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

        $scope.getTotalExpenses = function() {
            function addAmounts(expenses) {
                var t = 0;
                expenses.forEach(function (expense) {
                    if(expense.hasOwnProperty("children")) {
                        t += addAmounts(expense.children);
                    } else {
                        if(expense.amt >= 0) {
                            t += expense.amt;
                        }
                    }

                });
                return t;
            }
            var total = addAmounts($scope.expenses);
            return total;
        };

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
            if(!$scope.selectedExpense.hasOwnProperty("remainder")) {
                $scope.selectedExpense.remainder = $scope.selectedExpense.amt;
            }
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
                siteData.content.expenses = $scope.expenses;
            }

            $http.post('php/persistence.php',siteData).
                success(function(data) {
                    closeModal();
                }).
                error(function(data) {
                    closeModal();
                });

        }

        function getBudgetFromHistory() {
            if($scope.selectedMonth && $scope.selectedYear && $scope.selectedMonth !== undefined && $scope.selectedYear !== undefined) {
                var savedExpensReports = siteData.content.history.filter(function(el, index, arr) {
                    return el.year == $scope.selectedYear && el.month == $scope.selectedMonth
                });

                loadedExpenseReport = savedExpensReports[0];

                if(loadedExpenseReport) {
                    $scope.expenses = loadedExpenseReport.expenses;
                    $scope.totalFunds = loadedExpenseReport.totalFunds;
                } else {
                    $scope.expenses = siteData.content.expenses;
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


