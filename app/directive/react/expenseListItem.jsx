React.createClass({
    render : function() {
        return (
                
            <a  class="list-group-item" href="#">
                <h4>{this.props.expense.label}</h4>
                <div>{this.props.expense.amt}</div>
                <div>{this.props.expense.amt}</div>
            </a>
            );
    }
});
