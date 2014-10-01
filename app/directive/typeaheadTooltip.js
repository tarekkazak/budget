/**
 * Created by tarekkazak on 2014-10-01.
 */
define(['angular', 'lodash', 'bstooltip'], function (angular, _) {
    angular.module('typeaheadToolTipModule', [])
        .directive('typeaheadToolTip', function () {
            return {
                restrict : 'A',
                require : 'ngModel',
                link : function(scope, iElem, iAttrs) {
                    $(iElem).tooltip({
                        triggger : 'manual manual',
                        template : scope.createTagTemplate
                    });
                    scope.$watch('selectedTag', function(value) {
                        var tag = _(scope.tags).find({'label': value});
                        if(!tag) {
                            $(iElem).tooltip('show');
                        } else {
                            $(iElem).tooltip('hide');
                        }
                    });
                }
            };
        });
});