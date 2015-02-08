    angular.module('budgetApp.directive')
    	.controller('tagEditorController', ['$scope', '$window', '$element', 'budgetAppModel', function($scope, $window, $element,budgetAppModel) {

		$scope.tag = {
		    id : utils.getGUID(),
                    label : ''
		};

                $($window).on('click', function(ev) {
                    if($element[0] !== ev.target) {
                        if($('.create-tag-form').length > 0 && $.contains($('.create-tag-form').get()[0], ev.target)) {
                            return;
                        }
                        $scope.tagEditorTrigger = false;
                        $scope.$digest();
                    }
                });

		$scope.createNewTag = function() {
		    if($scope.tagCreateCallBack) {
                        $scope.tagCreateCallBack()($scope.tag);
                    }
		};

	}])
        .directive('tagEditor', ['reactTagEditor', function (ReactTagEditor) {
            return {
                restrict : 'EA',
		controller : 'tagEditorController',
                require : '?ngModel',
		scope : {
		    editTag : '=',
		    editMode : '=',
		    tagCreateCallBack : '&tagEditorCreateComplete',
                    tags : '='
		},
                link : function(scope, iElem, iAttrs, controller) {
			    var el = $(iElem);
		            $(el).tooltip({
                                placement:'right',
		        	container : 'body',
				trigger : 'manual', //!_.isUndefined(iAttrs.tagEditorTrigger) ? "manual"  : "click"
                                template : '<div class="tooltip create-tag-form"><div id="tag-form"></div><div class="tooltip-inner"></div></div>'
			    });
                            
                            $(el).on('shown.bs.tooltip', function() {
                                console.log('showing toolip');
                                React.render(<ReactTagEditor editMode={scope.editMode} tag={scope.tag}/>, 
                                    document.getElementById('tag-form'));
                            });

                            if(scope.editTag) {
                                scope.tag = scope.editTag;
                            }

			    scope.$watch('tagEditorTrigger', function(value) {
				console.log('tag trigger ' + value);
				if(value)  {
				    $(el).tooltip('show');
				} else {
				    $(el).tooltip('hide');
				}
			    });		
			    
                            if(controller) {
                                controller.$parsers.push(function(value) {
		            		scope.tagEditorTrigger = ( !utils.isNullOrUndefined(value) && 
                                            !_.isEmpty(value) ) && 
                                            !_.find(scope.tags, {label:value}) ? true : false;
                                });
                            } else {
                                $(el).on('click', function() {
                                    $(el).tooltip('toggle');
                                });
                            }

                }
            };
        }]);
