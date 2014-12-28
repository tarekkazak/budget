    angular.module('tagEditorModule', [])
    	.controller('tagEditorController', function($scope) {
		$scope.tag= {
		    id : new Date().getTime()
		};
		$scope.editMode = false;
		$scope.createNewTag = function() {
		    console.log("create new tag " + $scope.tag.label);
		    $scope.tagCreateCallBack()($scope.tag);
		};

		$scope.close = function() {
		    console.log("close tag editor");
		    $scope.tagEditorTrigger = "false";
		};
	})
        .directive('tagEditor', ['$compile', 'templateService', function ($compile, templateService) {
            return {
                restrict : 'EA',
		controller : 'tagEditorController',
		scope : {
		    tagEditorTrigger: '@',
		    editTag : '=',
		    tagCreateCallBack : '&tagEditorCreateComplete'
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
				trigger : !_.isUndefined(iAttrs.tagEditorTrigger) ? "manual"  : "click"
			    });
                            //$(el).on('shown.bs.tooltip', function () {
                            //    console.log('show tooltip');
				//scope.$apply();
                             //});
			    if(!_.isUndefined(iAttrs.editTag)) {
				scope.$watch('editTag', function(value) {
                                    if(value) {
			                scope.tag = value;
				        scope.editMode = true;
				        scope.title= 'editing: ' + scope.tag.label;
				        //console.log(scope.title);
				        //console.log(scope.tag);
                                    }
				});
			    } else {
				scope.title = 'create';
			    }

			    if(!_.isUndefined(scope.tagEditorTrigger) && !_.isNull(scope.tagEditorTrigger)) {
			        scope.$watch('tagEditorTrigger', function(value) {
				    console.log('tag trigger ' + value);
				if(value == 'true') {
				    $(el).tooltip('show');
				} else {
				    $(el).tooltip('hide');
				}
			        });		
			    }
			});


                }
            };
        }]);
