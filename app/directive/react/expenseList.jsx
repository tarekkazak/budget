angular.module('budgetApp.directive')
    .factory('expenseList', ['budgetAppModel', function(budgetAppModel) {
        return React.createClass({
            addExpense : function () {
                var expense = {}, refs = this.refs;
                expense.id = utils.getGUID()
                expense.label = refs.expenseLabel.getDOMNode().value.trim();
                expense.amt = refs.epxenseAmt.getDOMNode().value.trim();
                budgetAppModel.addExpense(expense);
            },
            render : function() {
                var expenses = _.map(this.props.expenses, function(item) {
                    return (
                           <ExpenseListItem expense={item} /> 
                        );
                });
                return (
                    <div className="row">
                        <div className="col-md-5">
                            <input className="form-control" ref="expenseAmt" placeholder="amount" />
                        </div>
                        <div className="col-md-5">
                            <input className="form-control" ref="expenseLabel" placeholder="name" />
                        </div>
                        <div className="col-md=2">
                            <button click="{this.addExpense}" className="btn btn-primary">add</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="list-group">
                                {expenses}
                            </div>
                        </div>
                    </div>
                );
            }
        });
    }]);
