/**
 * Created by tarekkazak on 2014-04-07.
 */
define([
    'lodash',
    'model/budgetAppModel'], function (_, budgetAppModel) {
    'use strict';

    /* Controllers */

    return function ($scope) {

        budgetAppModel.registerForUpdate('templateMode', function(value) {
            $scope.templateMode = value;
        });

        budgetAppModel.registerForUpdate('inEditMode', function(value) {
            $scope.inEditMode = value;
        });

        budgetAppModel.registerForUpdate('expenses', function(value) {
            $scope.expenses = value;
        });



        $scope._ = _;
        
        $scope.getTotalRemainingExpenses = function () {
            return budgetAppModel.sumValuesForProperty("remainder");
        };

        $scope.updatePayments = function (expense) {
            expense.payments = expense.payments.split(',');
            budgetAppModel.updateRemainderAndTotalPaid([expense]);
        };


        $scope.removeExpense = function (expense, parent) {
            if (parent) {
                parent.children = _.without(parent.children, expense);
            } else {
                $scope.expenses = budgetAppModel.loadedExpenseReport.expenses = _.without($scope.expenses, expense);
            }

        };

        $scope.updateExpenseAmount = function (expense) {
            budgetAppModel.updateRemainderAndTotalPaid([expense]);
        };

    };


});