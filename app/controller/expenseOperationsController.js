angular.module('budgetApp.expenseOperationsController', ['model.mainModel', 'dataService']).
    controller ('expenseOperationsController',
    ['$scope', '$modal', '$timeout', '$window', '$http', '$interpolate', '$templateCache',
         'DataService', 'budgetAppModel',
        function ($scope, $modal, $timeout, $window, $http, $interpolate, $templateCache, DataService, budgetAppModel) {
         $window.Spinner = Spinner;
            var modalInstance, report, reportTemplateFunc;
            $scope._ = _;
	    $scope.selectedTagIsValid = null;
            $scope.showFeedback = false;
            $scope.selectedTags = [];
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

            $scope.tagCreated = function(newTag) {
                $scope.tags.push(newTag);
                $scope.selectedTag = newTag;
                $scope.addToSelectedTags();
                console.log(newTag);
            };

	    $scope.$watch('selectedTag', function(value) {
		$scope.showTagEditor = ( !$scope.isNullOrUndefined(value) && !_.isEmpty(value) ) && !_.find($scope.tags, {label:value}) 
		     ? true : false;
	    });

            $scope.openCal = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
            };

            $scope.newPaymentDateChange = function() {
                budgetAppModel.setSelectedMonth($scope.newPaymentDate.getMonth() + 1);
                budgetAppModel.setSelectedYear($scope.newPaymentDate.getFullYear());
            };

            $scope.addPayment = function() {
                $scope.payments.push({
                    amt : $scope.amount,
                    tags : [_($scope.selectedTags).pluck('label').value()],
                    date : $scope.newPaymentDate
                });
                budgetAppModel.setPayments($scope.payments);
            };

            $scope.addToSelectedTags = function() {
                if(!_.contains($scope.selectedTags, $scope.selectedTag)) {
                    $scope.selectedTags.push($scope.selectedTag);
                    $scope.selectedTag = null;
                }
            };

            $scope.removeTag = function(tag) {
                _.remove($scope.selectedTags, function(item) {
                    return tag === item;
                });
            };

            $scope.editTag = function(tag) {
                $scope.editTag = true;
                $scope.selectedTag = tag;
            };

            $scope.createNewTag = function() {
                var tag = {
                    "label" : $scope.selectedTag,
                     "id" : new Date().getTime()
                    };
                if($scope.newTagAmt) {
                    tag.amt = $scope.newTagAmt;
                }
                if($scope.newTagIsRecurring) {
                    tag.newTagIsRecurring = $scope.newTagIsRecurring;
                }
                budgetAppModel.tags.push(tag);
                $scope.tags = budgetAppModel.tags;
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
                     //   budgetAppModel.removeCircularReferencesFromChildExpenses(budgetAppModel.loadedExpenseReport.expenses);
                    }
                } else {
                 //   budgetAppModel.siteData.content.expenses = $scope.expenses = stripNonTemplateProps($scope.expenses);

                }
                //Needs to be set as initial load of data creates a copy of this array to be used by $scope
                budgetAppModel.siteData.content.upcoming = $scope.upcoming;
                DataService.post(budgetAppModel.siteData).then(function(){
                    closeModal();
                });
            };
    }]);
