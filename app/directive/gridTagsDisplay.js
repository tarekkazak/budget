    angular.module('budgetApp.directive')
    	.controller('gridTagsDisplayController', ['$scope', '$window', '$element', 'budgetAppModel',  function($scope, $window, $element, budgetAppModel) {
        
                $scope.removeTag = function(tags, tag) {
                    utils.deleteItemFromList(tag, tags);
                    budgetAppModel.updatePayment($scope.rowData.entity.id, {property : "tags", value : tags});
                };

                $($window).on('click', function(ev) {
                    if($element[0] !== ev.target) {
                        if($('.tags-display').length > 0 && $.contains($('.tags-display').get()[0], ev.target)) {
                            return;
                        }
                       $scope.show = false;
                       $scope.$digest();
                    }
                });

                $scope.selectTag = function(tag) {
                    $scope.selectedTag =_($scope.tags).where({label : tag }).first();
                    $scope.editTag = true;
                };

                $scope.addTag = function() {
                    $scope.source.push($scope.selectedTag.label);
                    budgetAppModel.updatePayment($scope.rowData.entity.id, {property:'tags', value: $scope.source});
                    $scope.selectedTag = null;
                };
                
                $element.on('click', function() {
                    $scope.show = !$scope.show;
                });


	}])
        .directive('gridTagsDisplay', ['$compile', 'templateService', function ($compile, templateService) {
            return {
                restrict : 'EA',
		controller : 'gridTagsDisplayController',
		scope : {
		    rowData: '=',
                    tags:'='
		},
                link : function(scope, iElem, iAttrs, controller) {
                    scope.source = scope.rowData.getProperty('tags');
                    scope.title = 'Tags';
			templateService.get('partials/grid-tags-display.html').then(function(data) {
	    		    return data.data;
			}).then(function(template) { 
                            var compiled = $compile(template)(scope);
			    var el = $(iElem);
		            $(el).tooltip({
                                placement:'right',
                                template: compiled,
		        	container : 'body',
				trigger : 'manual'
			    });
	    		
                            scope.$watch('show', function(value) {
			        if(value)  {
				    $(el).tooltip('show');
			        } else {
			            $(el).tooltip('hide');
			        }
			    });		

			});


                }
            };
        }]);
