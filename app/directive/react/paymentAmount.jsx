angular.module('budgetApp.directive')
    .factory('paymentAmount', function() {
        return React.createClass({
            isCredit : function() {
                return _.contains(this.props.payment.tags, 'credit');
            },
            render : function() {
                var e;
                if( this.isCredit() ) {
                    e =  <span className="label label-success">+{this.props.payment.amt}</span> 
                } else {
                    e = <span className="label label-danger">-{this.props.payment.amt}</span> 
                }

                return(
                    <div>{e}</div>
                );
            }
        });
    });
