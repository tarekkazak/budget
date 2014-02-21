var budgetApp = angular.module('budgetApp', ['ui.bootstrap', 'ngRoute', 'ngSanitize','angularSpinner']);



budgetApp.controller('controller', ['$scope', '$http', '$modal', '$timeout', function ($scope, $http, $modal, $timeout) {

    //fetch content data
    $http.get('data/content.json').success(function(data) {
        var siteData = data;
        var modalInstance;
        var isNew = false;

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

        $scope.applyPaymentToExpense = function(amount) {
            $scope.selectedExpense.amt -= amount;
            $scope.totalFunds -= amount;
        }

        $scope.updateExpenseAmount = function (expense, amt) {
            expense.amt = Number(amt);
        }

        $scope.zeroOutExpense = function () {
            $scope.totalFunds -= $scope.selectedExpense.amt;
            $scope.selectedExpense.amt = 0
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

                $http.post('/php/contact.php',{"lang" : $scope.lang ,"name": $scope.name, "email": $scope.email, "subject": $scope.subject, "message": $scope.message}).
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
                siteData.content.history.push({"year": $scope.selectedYear,"month" : $scope.selectedMonth, "expenses" : $scope.expenses});
            }

            $http.post('/php/persistence.php',siteData).
                success(function(data) {
                    closeModal();
                }).
                error(function(data) {
                    closeModal();
                });

        }

        function getBudgetFromHistory() {
            if($scope.selectedMonth && $scope.selectedYear && $scope.selectedMonth !== undefined && $scope.selectedYear !== undefined) {
                var currentExpenses = siteData.content.history.filter(function(el, index, arr) {
                    return el.year == $scope.selectedYear && el.month == $scope.selectedMonth
                });

                if(currentExpenses[0]) {
                    $scope.expenses = currentExpenses[0].expenses;
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


