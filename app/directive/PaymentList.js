define(['lodash', 'utils/utils'], function(_, utils) {
    return function () {
        return {
            restrict : 'E',
            templateUrl : 'paymentListEditTemplate.html',
            replace : true,
            scope : {
                payments : '='
            },
            controller : function($scope) {
                $scope.deleteItem = utils.deleteItemFromList;

            }
        };
    };
});