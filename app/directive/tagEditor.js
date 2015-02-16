    angular.module('budgetApp.directive')
    	.controller('tagEditorController', ['$scope', '$window', '$element', 'budgetAppModel', function($scope, $window, $element,budgetAppModel) {

		$scope.tag = { };

                function onWindowClick(ev) {
                    if($element[0] !== ev.target) {
                        if($('.create-tag-form').length > 0 && $.contains($('.create-tag-form').get()[0], ev.target)) {
                            return;
                        }
                        $scope.tagEditorTrigger = false;
                        $scope.$digest();
                    }
                }

                $element.on('shown.bs.tooltip', function() {
                    $(window).on('click', onWindowClick);
                });

                $element.on('hidden.bs.tooltip', function() {
                    $(window).off('click', onWindowClick);
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
                    console.log('tag editor tags', scope.tags);
			    var el = $(iElem);
		            $(el).tooltip({
                                placement:'right',
		        	container : 'body',
				trigger : 'manual', //!_.isUndefined(iAttrs.tagEditorTrigger) ? "manual"  : "click"
                                template : '<div class="tooltip create-tag-form"><div id="tag-form"></div><div class="tooltip-inner"></div></div>'
			    });
                            
                            $(el).on('shown.bs.tooltip', function() {
                                console.log('showing toolip', scope.tag);
                                React.render(<ReactTagEditor editMode={scope.editMode} tag={scope.tag}/>, 
                                    document.getElementById('tag-form'));
                            });

                            scope.$watch('editTag', function(val) {
                                if(val) {
                                    console.log('edit tag', val);
                                    var tag = val;
                                    if(!_.contains(scope.tags, tag)) {
                                        tag =_.find(scope.tags, {label:val});
                                    }
                                    
                                    console.log('edit tag', val);
                                    scope.tag = tag;
                                }
                            });

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
