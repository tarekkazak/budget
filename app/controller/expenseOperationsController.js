angular.module('budgetApp.controller')
    .controller ('expenseOperationsController',
    ['$scope', '$modal', '$timeout', '$window', '$interpolate', '$templateCache',
          'budgetAppModel',
        function ($scope, $modal, $timeout, $window, $interpolate, $templateCache, budgetAppModel) {
            var modalInstance, report, reportTemplateFunc;
            $scope._ = _;
	    $scope.selectedTagIsValid = null;
            $scope.showFeedback = false;
            $scope.selectedTags = [];
            reportTemplateFunc = _.template($templateCache.get("reportTemplate"));

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
                $scope.tags.push(newTag);
                $scope.selectedTag = newTag;
                $scope.addToSelectedTags();
            };

	    $scope.$watch('selectedTag', function(value) {
		$scope.showTagEditor = ( !$scope.isNullOrUndefined(value) && !_.isEmpty(value) ) && !_.find($scope.tags, {label:value}) 
		     ? true : false;
	    });

            $scope.openCal = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
            };

            $scope.addPayment = function() {
                budgetAppModel.updatePayments({

                    amt : $scope.amount,
                    tags : [_($scope.selectedTags).pluck('label').value()],
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



            function closeModal() {
                $timeout(function () {
                        //close loading spinner after send email complete and show server feedback
                    modalInstance.close();
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

    }]);
