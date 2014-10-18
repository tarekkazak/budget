
angular.module('budgetApp.expenseOperationsController', ['model.mainModel', 'dataService']).
    controller ('expenseOperationsController',
    ['$scope', '$modal', '$timeout', '$window', '$http', '$interpolate', '$templateCache',
         'DataService', 'budgetAppModel',
        function ($scope, $modal, $timeout, $window, $http, $interpolate, $templateCache, DataService, budgetAppModel) {
        $window.Spinner = Spinner;
        var modalInstance, report, reportTemplateFunc;
        $scope._ = _;
        $scope.showFeedback = false;


        reportTemplateFunc = _.template($templateCache.get("reportTemplate"));

        budgetAppModel.registerForUpdate('payments', function (value) {
            $scope.payments = value;
        });

        budgetAppModel.registerForUpdate('wishlist', function (value) {
            $scope.wishlist = value;
        });


        budgetAppModel.registerForUpdate('tags', function (value) {
            $scope.tags = value;
        });

        $scope.newPaymentDate = new Date();

        $scope.selectWishlistItem = function (item) {
            $scope.selectedWishlistItem = item;
        };

        $scope.selectUpcomingExpense = function (item) {
            $scope.selectedUpcomingExpense = item;
        };


        $scope.openCal = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
        };

        $scope.newPaymentDateChange = function () {
            budgetAppModel.setSelectedMonth($scope.newPaymentDate.getMonth() + 1);
            budgetAppModel.setSelectedYear($scope.newPaymentDate.getFullYear());
        };

        $scope.addPayment = function () {
            $scope.payments.push({
                amt: $scope.amount,
                tags: [$scope.selectedTag.label],
                date: $scope.newPaymentDate
            });
            budgetAppModel.setPayments($scope.payments);
        };

        $scope.createTagTemplate = '<div><input type="text" ng-model="newTagMax" placeholder="max" /></div>' +
            '<button class="btn btn-primary" ng-click="createNewTag()">Create tag</button>';

        $scope.onTagsTAFocus = function () {
            //angular.element(form.tagsTA).triggerHandler('showCreateTag');
            //form.tagsTA.dispatchEvent(new Event('showCreateTag'));

        };

        $scope.createNewTag = function () {
            budgetAppModel.tags.push({
                "label": $scope.selectedTag,
                "max": max
            });
            $scope.tags = budgetAppModel.tags;
            console.log('click');
            angular.element(form.tagsTA).triggerHandler('hideCreateTag');
        };

        $scope.deleteItem = utils.deleteItemFromList;


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
                _.remove($scope.upcoming, function (item) {
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


        $scope.isNullOrUndefined = function (obj) {
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

                    //   budgetAppModel.removeCircularReferencesFromChildExpenses(budgetAppModel.loadedExpenseReport.expenses);
                }
            } else {
                //   budgetAppModel.siteData.content.expenses = $scope.expenses = stripNonTemplateProps($scope.expenses);
            }

            //Needs to be set as initial load of data creates a copy of this array to be used by $scope
            budgetAppModel.siteData.content.upcoming = $scope.upcoming;
            DataService.post(budgetAppModel.siteData).then(function () {
                closeModal();
            });


        };
    }]);
