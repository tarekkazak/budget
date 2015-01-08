angular.module('budgetApp.controller')
    .controller ('expenseOperationsController',
    ['$scope', '$modal', '$timeout', '$window',
          'budgetAppModel', 'tagModel', 'paymentsModel',
        function ($scope, $modal, $timeout, $window, budgetAppModel, tagModel, paymentsModel) {
            var modalInstance;

            tagModel.ready.subscribe(function() {
                tagModel.getStream().subscribe(function(tags) {
                    $scope.tags = tags;
                });
            });

            paymentsModel.ready.subscribe(function() {
                paymentsModel.getStream().subscribe(function(payments) {
                    $scope.payments = payments;
                    $scope.totalFunds = budgetAppModel.getTotalCredit(payments);
                    $scope.totalPaid = budgetAppModel.getTotalDebit(payments);
                    $scope.currentBalance = Number($scope.totalFunds - $scope.totalPaid).toFixed(2);
                });
            });
            
            $scope._ = _;
	    $scope.selectedTagIsValid = null;
            $scope.showFeedback = false;
            $scope.selectedTags = [];
            $scope.transactionType = 'debit';
            $scope.newPaymentDate = new Date();


            $scope.selectWishlistItem = function (item) {
                $scope.selectedWishlistItem = item;
            };

            $scope.selectUpcomingExpense = function (item) {
                $scope.selectedUpcomingExpense = item;
            };

            $scope.tagCreated = function(newTag) {
                console.log('tag created');
                console.log(newTag);
                $scope.selectedTag = newTag;
                $scope.addToSelectedTags();
            };



            $scope.openCal = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
            };

            $scope.addPayment = function() {
                budgetAppModel.addPayment({
                    id : utils.getGUID(),
                    amt : $scope.amount,
                    tags : _($scope.selectedTags).pluck('label').value().push($scope.transactionType),
                    date : $scope.newPaymentDate
                });
            };

            $scope.addToSelectedTags = function() {
                if(!_.contains($scope.selectedTags, $scope.selectedTag)) {
                    $scope.selectedTags.push($scope.selectedTag);
                    $scope.selectedTag = null;
                }
            };

            $scope.removeTag = function(tag) {
                utils.deleteItemFromList(tag, $scope.selectedTags);
            };

            $scope.editTag = function(tag) {
                $scope.editTag = true;
                $scope.selectedTag = tag;
            };

            $scope.deleteItem = utils.deleteItemFromList;

    }]);
