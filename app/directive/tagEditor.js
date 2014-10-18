/**
 * Created by tarekkazak on 2014-10-01.
 */
define(['jquery', 'angular', 'lodash', 'bstooltip'], function ($, angular, _) {
    angular.module('tagEditorModule', [])
        .directive('tagEditor', function ($timeout) {
            return {
                restrict : 'EA',
                templateUrl : 'partials/tag-editor.html',
                replace : false,
                scope : true,
                link : function(scope, iElem, iAttrs) {
/*
                    scope.editMode = iAttrs.editmode === 'true' 
                    if(!scope.editMode) { 
                        console.log('create-tag');                   
                        scope.tag = {};
                        $timeout(function() {},100).then(function() {
                           $(iElem).hide();
                        });
                         scope.$watch('selectedTag', function(value) {
                            var tag = _(scope.tags).find({'label': value});
                            console.log(tag);
                            console.log(value);
                            if(!tag) {
                                $(iElem).show();
                                console.log('show');
                            } else {
                                $(iElem).hide();
                                console.log('hide');

                            }
                            scope.tag.label = value;
                        });
                    } else {
                        console.log('edit-tag');                   
                        scope.$watch('selectedTag', function(value) {
                            scope.tag = scope.selectedTag;
                        });
                    }*/
                        $(iElem).tooltip({
                            placement:'bottom',
                            template :'<div class="tooltip row create-tag-form" style="margin-bottom:6px"><p class="tooltip-inner"></p> <div class="col-md-3"> <input class="form-control" style="padding-left:0px" type="text" ng-model="tag.amt" placeholder="amount" /> </div> <div class="col-md-3"> <input type="text" class="form-control" ng-model="tag.label" ng-show="editMode" class="form-control" /> </div> <input type="checkbox" class="col-md-1 checkbox" ng-model="tag.isRecurring" /> <button class="btn btn-primary" ng-show="!editMode" ng-click="createNewTag(tag.label, tag.tagAmt, tag.isRecurring)">Create tag</button> </div>'
                        });
                    

                }
            };
        });
});