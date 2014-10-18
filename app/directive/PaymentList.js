angular.module('budgetApp.directive', [])
    .directive('paymentList', function () {
        return {
            restrict: 'E',
            templateUrl: 'paymentListEditTemplate.html',
            replace: true,
            scope: {
                payments: '='
            },
            controller: function ($scope) {
                $scope.deleteItem = utils.deleteItemFromList;

            }
        };
    });