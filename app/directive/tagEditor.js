    angular.module('budgetApp.directive')
    	.controller('tagEditorController', ['$scope', '$window', '$element', 'budgetAppModel', function($scope, $window, $element,budgetAppModel) {
		$scope.editMode = false;

		$scope.tag = {
		    id : new Date().getTime()
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
		    console.log("create new tag " + $scope.tag.label);
                    budgetAppModel.addTag($scope.tag);
		    if($scope.tagCreateCallBack) {
                        $scope.tagCreateCallBack()($scope.tag);
                    }
		};

	}])
        .directive('tagEditor', ['$compile', 'templateService', function ($compile, templateService) {
            return {
                restrict : 'EA',
		controller : 'tagEditorController',
                require : 'ngModel',
		scope : {
		    editTag : '=',
		    tagCreateCallBack : '&tagEditorCreateComplete',
                    tags : '='
		},
                link : function(scope, iElem, iAttrs, controller) {
			templateService.get('partials/tag-editor.html').then(function(data) {
	    		    return  data.data;
			}).then(function(template) { 
                            var compiled = $compile(template)(scope);
			    var el = $(iElem);
		            $(el).tooltip({
                                placement:'right',
                                template: compiled,
		        	container : 'body',
				trigger : 'manual' //!_.isUndefined(iAttrs.tagEditorTrigger) ? "manual"  : "click"
			    });

			    if(!_.isUndefined(iAttrs.editTag)) {
				scope.$watch('editTag', function(value) {
                                    if(value) {
			                scope.tag = value;
				        scope.editMode = true;
				        scope.title= 'editing: ' + scope.tag.label;
                                    }
				});
			    } else {
				scope.title = 'create';
			    }

			    scope.$watch('tagEditorTrigger', function(value) {
				console.log('tag trigger ' + value);
				if(value)  {
				    $(el).tooltip('show');
				} else {
				    $(el).tooltip('hide');
				}
			    });		
			    
			});
                    
                        controller.$parsers.push(function(value) {
		            		scope.tagEditorTrigger = ( !utils.isNullOrUndefined(value) && 
                                            !_.isEmpty(value) ) && 
                                            !_.find(scope.tags, {label:value}) ? true : false;
                        });

                }
            };
        }]);
