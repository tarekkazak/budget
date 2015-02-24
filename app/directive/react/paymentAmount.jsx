angular.module('budgetApp.directive')
    .factory('paymentAmount', function() {
        return React.createClass({
            isCredit : function() {
                return _.contains(this.props.payment.tags, 'credit');
            },
            render : function() {
                var e;
                if( this.isCredit() ) {
                    e =  <div className="label label-success grid-payment-amount">+{this.props.payment.amt}</div> 
                } else {
                    e = <div className="label label-danger grid-payment-amount">-{this.props.payment.amt}</div> 
                }

                return(
                    <div>{e}</div>
                );
            }
        });
    });
