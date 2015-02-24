angular.module('budgetApp.directive')
    .directive('creditOrDebit', ['paymentAmount', function(PaymentAmount) {
        return {
            restrict : 'A',
            scope : {
                payment : '='
            },
            link : function(scope, elem) {
                //Must use watch and not one time call to REact.render because virtualiztion reuses existing elements which
                //will confuse react
               scope.$watch('payment', function(val) {
                   if(val) {
                       React.render(<PaymentAmount payment={scope.payment} />, elem[0]); 
                   }
               });
            }
        };
    }]);
