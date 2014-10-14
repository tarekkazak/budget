/**
 * Created by tarekkazak on 2014-04-07.
 */
angular.module('budgetApp.gridController', ['model.mainModel'])
    .controller('gridController', ['$scope', 'budgetAppModel',function ($scope, budgetAppModel) {

        budgetAppModel.registerForUpdate('templateMode', function(value) {
            $scope.templateMode = value;
        });

        budgetAppModel.registerForUpdate('inEditMode', function(value) {
            $scope.inEditMode = value;
        });

        budgetAppModel.registerForUpdate('expenses', function(value) {
            $scope.expenses = value;
        });

        budgetAppModel.registerForUpdate('totalFunds', function (value) {
            $scope.totalFunds = Number(value).toFixed(2);
        });

        budgetAppModel.registerForUpdate('initialFunds', function (value) {
            $scope.initialFunds = Number(value).toFixed(2);
        });

        budgetAppModel.registerForUpdate('payments', function(value) {
            $scope.payments = value;
            $scope.totalPaid = budgetAppModel.updateTotalPaid();

        });
        $scope._ = _;

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
                {'field' : 'tags' , 'displayName' : 'Tags'}
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