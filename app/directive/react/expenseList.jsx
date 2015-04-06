angular.module('budgetApp.directive')
    .factory('expenseList', ['budgetAppModel', function(budgetAppModel) {
        var ExpenseListItem;
        
        ExpenseListItem = React.createClass({
            getInitialState : function() {
                return {editMode : false, expense : this.props.expense}
            },
            deleteExpense : function() {
                budgetAppModel.deleteExpense(this.props.expense);
            },
            cancelEdit : function() {
                this.setState({editMode : false});
            },
            editExpense : function() {
                this.setState({editMode : true});
            },
            saveExpense : function() {
                var expense = this.state.expense;
                expense.label = refs.expenseLabel.getDOMNode().value.trim();
                expense.amt = refs.expenseAmt.getDOMNode().value.trim();
                console.log('save expense', expense);
                budgetAppModel.updateExpense(expense.id, expense);
                this.setState({editMode : false});
            },
            componentDidMount : function() {
                var expense = this.state.expense;
                if(!this.state.editMode) {
                    $('#' + this.state.expense.id).selectize({
                        options : this.props.tags,
                        valueField : 'id',
                        labelField : 'label',
                        searchField : ['label'],
                        maxItems : 1,
                        create : function(input) {
                                var tag = {
                                    label : input,
                                    id : utils.getGUID()
                                };
                                budgetAppModel.addTag(tag);
                                return tag;
                            },
                        onItemAdd : function(value) {
                            expense.tag = value;
                            budgetAppModel.updateExpense(expense.id, expense);
                        },
                        items : [expense.tag]
                        
                    });
                }
            },
            render : function() {
                var expenseView;
                if(this.state.editMode) {
                    expenseView = <a  className="list-group-item" href="#">
                        <h4 className="list-group-item-heading">
                       <input className="form-control expense-form-item" ref="expenseLabel" placeholder="label" value={this.state.expense.label} />
                       </h4>
                    <p className="list-group-item-text">
                       <input className="form-control expense-form-item" ref="expenseAmt" value={this.state.expense.amt} placeholder="amount" />
                   </p>
                    <span className="glyphicon glyphicon-floppy-save" onClick={this.saveExpense}></span>
                   <button className="cancel btn btn-default" onClick={this.cancelEdit}>Cancel</button>
                   <button className="close" onClick={this.deleteExpense}>x</button>
                   </a>
                } else {
                    expenseView = <a  className="list-group-item" href="#">
                        <h4 className="list-group-item-heading">{this.state.expense.label}</h4>
                        <p className="list-group-item-text">{this.state.expense.amt} </p>
                        <input id={this.state.expense.id} type="text" />
                        <span className="glyphicon glyphicon-edit" onClick={this.editExpense}></span>
                        <button className="close" onClick={this.deleteExpense}>x</button>
                        
                        </a>
                }
                return expenseView;
            }
        });
        return React.createClass({
            getInitialState : function() {
                return {data : []};
            },
            addExpense : function () {
                var expense = {}, refs = this.refs;
                expense.id = utils.getGUID()
                expense.label = refs.expenseLabel.getDOMNode().value.trim();
                expense.amt = refs.expenseAmt.getDOMNode().value.trim();
                console.log('add expense', expense);
                budgetAppModel.addExpense(expense);
            },
            render : function() {
                var tags = this.props.tags;
                var expenses = _.map(this.state.data, function(item) {
                    return (
                           <ExpenseListItem tags={tags} expense={item} /> 
                        );
                });
                return (
                    <div>
                    <div className="row">
                        <div className="col-md-5">
                            <input className="form-control" ref="expenseAmt" placeholder="amount" />
                        </div>
                        <div className="col-md-5">
                            <input className="form-control" ref="expenseLabel" placeholder="name" />
                        </div>
                        <div className="col-md=2">
                            <button onClick={this.addExpense} className="btn btn-primary">add</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="list-group">
                                {expenses}
                            </div>
                        </div>
                    </div>
                    </div>
                );
            }
        });
    }]);
