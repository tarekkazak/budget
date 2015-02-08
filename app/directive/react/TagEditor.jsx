angular.module('budgetApp.directive')
    .factory('reactTagEditor', ['budgetAppModel', function (budgetAppModel) {
     return React.createClass({
         componentDidMount : function() {
            console.log(this.props);
         },
        componentWillUpdate : function(nextProps, nextState) {
            console.log(this.props);
        },
        createNewTag : function () {
            var tag = this.props.tag, refs = this.refs;
	    tag.id = utils.getGUID()
            tag.amt = refs.amtInput.getDOMNode().value.trim();
            tag.label = refs.labelInput.getDOMNode().value.trim();
            tag.isRecurring = refs.isRecurringInput.getDOMNode().checked;
            console.log('new tag', tag);
            budgetAppModel.addTag(tag);
        },
        render : function() {
            return ( 
                <div className="create-tag-form" >
	            <div>
		       {this.props.tag.label}
	            </div>
	            <div className="row">
		        <div className="col-md-3 form-group">
		            <input ref="amtInput" className="form-control" type="text" value={this.props.tag.amt} placeholder="amount" />
		        </div>
                        {this.props.editMode === false ?
		        <div className="col-md-7 form-group" ng-show="!editMode">
			    <input type="text" ref="labelInput" className="form-control" value={this.props.tag.label} className="form-control" />
		        </div> : ''}
		        <div className="col-md-2 checkbox">
                            <label>
		                <input ref="isRecurringInput" type="checkbox" checked={this.props.tag.isRecurring}  />
                                recurring
                            </label>
		        </div>
	            </div>

                    {this.props.editMode === false ? <button className="btn btn-primary" onClick={this.createNewTag}>Create tag</button> : ''}
                </div>);
        }
    });
}]);
