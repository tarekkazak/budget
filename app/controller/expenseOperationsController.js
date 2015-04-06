angular.module('budgetApp.controller')
    .controller ('expenseOperationsController',
    ['$scope', '$modal', '$timeout', '$window',
          'budgetAppModel', 'dataModel', 'expenseList',
        function ($scope, $modal, $timeout, $window, budgetAppModel, DataModel, 
            ExpenseList) {
            
            var modalInstance,
                tagModel = new DataModel(IO_EVENTS.TAGS_UPDATED),
                expenseModel = new DataModel(IO_EVENTS.EXPENSES_UPDATED),
                paymentsModel = new DataModel(IO_EVENTS.PAYMENTS_UPDATED),
                expenseList = React.render(<ExpenseList  />, document.getElementById("expenses-list"));

            tagModel.ready.subscribe(function() {
                tagModel.getStream().subscribe(function(tags) {
                    $scope.tags = tags;
                    React.render(<ExpenseList  tags={$scope.tags}/>, document.getElementById("expenses-list"));
                });
            });

            expenseModel.ready.subscribe(function() {
                expenseModel.getStream().subscribe(function(expenses) {
                    expenseList.setState({data : expenses});
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
            $scope.selectedTags = [];
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
                var tags = _($scope.selectedTags).pluck('label').value();
                tags.push($scope.transactionType);
                budgetAppModel.addPayment({
                    id : utils.getGUID(),
                    amt : $scope.amount,
                    tags : tags,
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


            $scope.deleteItem = utils.deleteItemFromList;

    }]);
