angular.module('budgetApp.directive')
    .directive('creditOrDebit', ['paymentAmount', function(PaymentAmount) {
        return {
            restrict : 'A',
            scope : {
                payment : '='
            },
            link : function(scope, elem) {
               React.render(<PaymentAmount payment={scope.payment} />, elem[0]); 
            }
        };
    }]);
