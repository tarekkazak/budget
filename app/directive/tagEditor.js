    angular.module('tagEditorModule', ['templateServiceModule'])
        .directive('tagEditor', ['$timeout', 'templateService', function ($timeout, templateService) {
            return {
                restrict : 'EA',
		scope : {
		    tagEditorTrigger: '@',
		    editTag : '=',
		    tagCreateCallBack : '&tagEditorCreateComplete'
		    //tagEditorTemplate: '@'
		},
                link : function(scope, iElem, iAttrs) {
			scope.editMode = false;
			templateService.get('partials/tag-editor.html').then(function(data) {
				return  data.data;
			}).then(function(template) { 
		            $(iElem).tooltip({
                                placement:'right',
                                template: template,
		        	container : $(iElem),
				trigger : !_.isUndefined(iAttrs.tagEditorTrigger) ? "manual"  : "click"
			    });
			    if(!_.isUndefined(iAttrs.editTag)) {
				scope.$watch('editTag', function(value) {
			            scope.tag = value;
				    scope.editMode = true;
				    scope.title= 'editing: ' + scope.tag.label;
				    console.log(scope.title);
				});
			    } else {
				scope.title = 'create';
			    }

			    if(!_.isUndefined(scope.tagEditorTrigger) && !_.isNull(scope.tagEditorTrigger)) {
			        scope.$watch('tagEditorTrigger', function(value) {
				    console.log('tag trigger ' + value);
				if(value == 'true') {
				    $(iElem).tooltip('show');
				} else {
				    $(iElem).tooltip('hide');
				}
			        });		
			    }
			});
			scope.createNewTag = function() {
			    scope.tagCreateCallBack(scope.tag);
			};


                }
            };
        }]);
