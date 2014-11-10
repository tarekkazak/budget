    angular.module('tagEditorModule', ['templateServiceModule'])
        .directive('tagEditor', ['$timeout', 'templateService', function ($timeout, templateService) {
            return {
                restrict : 'EA',
		scope : {
		    tagEditorTrigger: '@',
		},
                link : function(scope, iElem, iAttrs) {
		            $(iElem).tooltip({
                                placement:'right',
                                template: template,
				trigger : !_.isUndefined(iAttrs.tagEditorTrigger) ? "manual"  : "click"
			    });
                        });
                            } else {
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
                    

                }
            };
        }]);
