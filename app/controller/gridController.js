angular.module('budgetApp.controller')
    .controller('gridController', ['$scope', 'budgetAppModel', 'tagModel', 'paymentsModel', '$compile', function ($scope, budgetAppModel, tagModel, paymentsModel, $compile) {

        var allTags;

        tagModel.ready.subscribe(function() {
            tagModel.getStream().subscribe(function(tags) {
                  $scope.tags = tags;
             });
        });
        
        paymentsModel.ready.subscribe(function() {
            paymentsModel.getStream().subscribe(function(payments) {
                $scope.payments = payments;
            });
        });
        
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
                    };
                }
            }).compact().value();
        }

        
        $scope._ = _;

        $scope.$watch('selectedTag', function(value) {
            updateRecurringTags();
        }, true);

        $scope.gridOptions = {
            data: 'payments',
            enableCellSelection: true,
            enableRowSelection: false,
            showFilter: true,
            showFooter : true,
            columnDefs : [
                {'field' : 'amt', 'displayName' : 'Amount', 'enableCellEdit':true},
                {'field' : 'date', 'displayName' : 'Date', 'cellTemplate' : '<div>{{row.getProperty(col.field).substr(0, 10)}}</div>'},
                {'field' : 'tags' , 'displayName' : 'Tags', 'cellTemplate' : '<i data-toggle="tooltip" tags="tags" title="edit" grid-tags-display row-data="row" class="glyphicon glyphicon-edit" ></i>'}
            ]
        };

        $scope.$on('ngGridEventEndCellEdit', function (ev) {
            console.log('cell edit');
            //budgetAppModel.updatePayment(ev.data);
        });

    }]);
