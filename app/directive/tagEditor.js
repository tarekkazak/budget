/**
 * Created by tarekkazak on 2014-10-01.
 */
define(['jquery', 'angular', 'lodash'], function ($, angular, _) {
    angular.module('tagEditorModule', [])
        .directive('tagEditor', function ($timeout) {
            return {
                restrict : 'E',
                templateUrl : 'partials/tag-editor.html',
                replace : true,
                scope : true,
                link : function(scope, iElem, iAttrs) {

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
                    }
                    /*$(iElem[0]).tooltip({
                        trigger : 'click click',
                        html : true,
                        //template : scope.createTagTemplate,
                        placement : 'left',
                        container : 'tags-ta'
                    });*/

                }
            };
        });
});