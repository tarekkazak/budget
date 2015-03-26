angular.module('budgetApp.controller')
    .controller('gridController', ['$scope', 'budgetAppModel', 'dataModel', '$compile', function ($scope, budgetAppModel, DataModel, $compile) {

        var allTags,
                tagModel = new DataModel(IO_EVENTS.TAGS_UPDATED),
                paymentsModel = new DataModel(IO_EVENTS.PAYMENTS_UPDATED);

        tagModel.ready.subscribe(function() {
            tagModel.getStream().subscribe(function(tags) {
                  $scope.tags = tags;
                  updateRecurringTags();
                  $scope.$digest();
             });
        });
        
        paymentsModel.ready.subscribe(function() {
            paymentsModel.getStream().subscribe(function(payments) {
                $scope.payments = payments;
                $scope.$digest();

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
                    item.remainder = updateRemainder(item);
                    return item;
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
           // virtualizationThreshold : 1000,
            showFooter : true,
            columnDefs : [
                {'field' : 'amt', 'displayName' : 'Amount', 'enableCellEdit':true,
                    'cellTemplate' : '<div payment="row.entity" credit-or-debit></div>'
                },
                {'field' : 'date', 'displayName' : 'Date', 
                    'cellTemplate' : '<div>{{row.getProperty(col.field).substr(0, 10)}}</div>'},
                {'field' : 'tags' , 'displayName' : 'Tags', 
                    'cellTemplate' : '<i data-toggle="tooltip" tags="tags" title="edit" grid-tags-display row-data="row.entity" class="glyphicon glyphicon-edit" ></i>'}
            ]
        };

        /*$scope.$on('ngGridEventRows', function(ev, newRows) {
            console.log('--------rows', newRows);
        });

        $scope.$on('ngGridEventEndCellEdit', function (ev) {
            console.log('cell edit');
            //budgetAppModel.updatePayment(ev.data);
        });*/

    }]);
