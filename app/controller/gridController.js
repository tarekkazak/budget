angular.module('budgetApp.controller')
    .controller('gridController', ['$scope', 'budgetAppModel', 'DataService' ,function ($scope, budgetAppModel, DataService) {

        var allTags;

        
        function updateRemainder(tag) {
           var remainder, paymentsAgainstTag;
            paymentsAgainstTag = _.filter($scope.payments, function(item){
                return _.contains(item.tags, tag.label);
            });
            remainder = _(paymentsAgainstTag).pluck('amt').reduce(function(sum, next) {
                return Number(sum) + Number(next);
            });
            return remainder;
        } 

        function updateRecurringTags() {
            $scope.recurringTags = _($scope.tags).map(function(item){
                if(_.has(item, 'isRecurring') && item.isRecurring) {
                    return {
                        'label' : item.label,
                        'amt' : item.amt,
                        'remainder' : updateRemainder(item),
                    }
                }
            }).compact().value();
        }

        
        $scope.$on('modelUpdated', function(scope, payload) {
            $scope[payload.key] = payload.value;    
            switch(payload.key) {
                case 'report' :
                    $scope.totalPaid = budgetAppModel.updateTotalPaid();
                    $scope.payments = payload.payments;
                    break;

            }
        });

        $scope._ = _;
        $scope.removeTag = function(tags, tag) {
            _.remove(tags, function(item) {
                return tag === item;
            });
        };

        $scope.selectTag = function(tag) {
            $scope.selectedTag = _(allTags).find({label : tag});
        };

        $scope.$watch('selectedTag', function(value) {
            updateRecurringTags();
        }, true);

        $scope.gridOptions = {
            data: 'payments',
            enableCellSelection: true,
            enableRowSelection: false,
            enableCellEdit: true,
            showFilter: true,
            showFooter : true,
            columnDefs : [
                {'field' : 'amt', 'displayName' : 'Amount'},
                {'field' : 'date', 'displayName' : 'Date', 'cellTemplate' : '<div>{{row.getProperty(col.field).substr(0, 10)}}</div>'},
                {'field' : 'tags' , 'displayName' : 'Tags', 'cellTemplate' : '<div class="btn-group"><button data-toggle="tooltip" title="edit" tag-editor-trigger="{{editTag}}" tag-editor edit-tag="selectedTag" class="btn btn-primary" ng-repeat="tag in row.getProperty(col.field)" ng-click="selectTag(tag); editTag = true;" >{{tag}}<i class="glyphicon glyphicon-remove" ng-click="removeTag(row.getProperty(col.field), tag)"></i></button></div>'}
            ],
            footerTemplate : '<div style="margin-top: 9px; font-size: 11px"> ' +
                '<div> ' +
                    '<div style="display: inline-block">' +
                        '<b>Initial funds:</b> <input style="display: inline; width: 100px;height: 20px" type="number" ng-model="initialFunds" class="form-control">' +
                    '</div>' +
                    '<div style="display: inline-block; margin: 0 9px">' +
                        '<b>Estimated Remaining funds:</b> {{(initialFunds - totalPaid).toFixed(2)}}' +
                    '</div> ' +
                '</div> ' +
                '<div style="display: inline-block">' +
                    '<b>Total paid:</b> {{ totalPaid }}' +
                '</div>' +
                '<div style="display: inline-block;margin: 0 9px">' +
                    '<b>Total payments:</b> {{ payments.length }}' +
                '</div>' +
                '<div style="display: inline-block;margin: 0 9px">' +
                    '<b>Total owing:</b> {{ totalOwing }}' +
                '</div>' +
                '<div style="display: inline-block">' +
                    '<b>Current funds:</b> <input type="number" style="display: inline; width: 50px; height:20px" ng-model="totalFunds" class="form-control">' +
                '</div>' +
                '<div style="display: inline-block;margin: 0 9px">' +
                    '<b>Actual remaining:</b> {{ (totalOwing - titalFunds).toFixed(2) }}' +
                '</div>' +
            '</div>'
        };


        $scope.$on('ngGridEventEndCellEdit', function () {
            $scope.totalPaid = budgetAppModel.updateTotalPaid();
        });




    }]);
