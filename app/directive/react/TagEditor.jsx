angular.module('budgetApp.directive')
    .factory('reactTagEditor', ['budgetAppModel', function (budgetAppModel) {
     return React.createClass({
         componentDidMount : function() {
            console.log('tag editor did mount', this.props);
         },
        componentWillUpdate : function(nextProps, nextState) {
            console.log('tag editor will update', nextProps, nextState);
        },
        createNewTag : function () {
            var tag = this.props.tag, refs = this.refs;
	    tag.id = utils.getGUID()
            tag.label = refs.labelInput.getDOMNode().value.trim();
            budgetAppModel.addTag(tag);
        },
        updateTag : function() {
            var tag = this.props.tag, refs = this.refs;
            console.log('tag before saving', tag);
            tag.label = refs.labelInput.getDOMNode().value.trim();
            console.log('save tag', tag);
            budgetAppModel.updateTag(tag.id, tag);
        },
        render : function() {
            return ( 
                <div className="create-tag-form" >
	            <div>
		       {this.props.tag.label}
	            </div>
	            <div className="row">
		        <div className="col-md-7 form-group" >
			    <input type="text" ref="labelInput" className="form-control" defaultValue={this.props.tag.label} className="form-control" />
		        </div> 
	            </div>

                    {
                        this.props.editMode === false ? 
                            <button className="btn btn-primary" onClick={this.createNewTag}>Create tag</button> : 
                            <button className="btn btn-primary" onClick={this.updateTag}>Save tag</button>
                    }
                </div>);
        }
    });
}]);
