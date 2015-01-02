angular.module('budgetApp.controller')
    .controller('gridController', ['$scope', 'budgetAppModel', 'tagModel', 'paymentsModel' ,function ($scope, budgetAppModel, tagModel, paymentsModel) {

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
                    }
                }
            }).compact().value();
        }

        
        $scope._ = _;
        $scope.removeTag = function(tags, tag, id) {
            utils.deleteItemFromList(tag, tags);
            budgetAppModel.updatePayment(id, {property : "tags", value : tags});
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
                {'field' : 'tags' , 'displayName' : 'Tags', 'cellTemplate' : '<div class="btn-group">' +
                   '<button data-toggle="tooltip" title="edit" ' + 
                       'tag-editor-trigger="editTag" tag-editor edit-tag="selectedTag" ' + 
                        'class="btn btn-primary" ng-repeat="tag in row.getProperty(col.field) track by $index" ' + 
                        'ng-click="selectTag(tag); editTag = true;" >{{tag}}' +
                    '<i class="glyphicon glyphicon-remove" ng-click="removeTag(row.getProperty(col.field), tag, row.getProperty(\'id\'))">'+
                        '</i>'+
                        '</button></div>'}
            ]
        };

        $scope.$on('ngGridEventEndCellEdit', function (ev) {
            budgetAppModel.updatePayment(ev.data);
        });

    }]);
