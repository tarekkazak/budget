/**
 * Created by tarekkazak on 2014-04-07.
 */
define([
    'lodash',
    'model/budgetAppModel'], function (_, bugdetAppModel) {
    'use strict';

    /* Controllers */

    return function ($scope) {

        bugdetAppModel.registerForUpdate('templateMode', function(value) {
            $scope.templateMode = value;
        });

        bugdetAppModel.registerForUpdate('inEditMode', function(value) {
            $scope.inEditMode = value;
        });

        bugdetAppModel.registerForUpdate('expenses', function(value) {
            $scope.expenses = value;
        });



        $scope._ = _;

        function sumValuesForProperty(property) {
            var total = 0, parts, values, childrenValues, filterFunc;
            filterFunc = function(item) {
                return !_.has(item, 'skip') || item.skip === false;
            };
            parts = _.groupBy($scope.expenses, function (expense) {
                return !_.has(expense, "children");
            });
            values = _(parts['true']).filter(filterFunc).pluck(property).value();
            childrenValues =  _(parts['false']).pluck('children').flatten().filter(filterFunc).pluck(property).value();

            _.each(values.concat(childrenValues), function (el, index, arr) {
                if (Number(el) > 0) {
                    total += Number(el);
                }
            });
            return total;
        }

        $scope.getTotalRemainingExpenses = function () {
            return sumValuesForProperty("remainder");
        };

        $scope.updatePayments = function (expense) {
            expense.payments = expense.payments.split(',');
            bugdetAppModel.updateRemainderAndTotalPaid([expense]);
        };


        $scope.removeExpense = function (expense, parent) {
            if (parent) {
                parent.children = _.without(parent.children, expense);
            } else {
                $scope.expenses = bugdetAppModel.loadedExpenseReport.expenses = _.without($scope.expenses, expense);
            }

        };

        $scope.updateExpenseAmount = function (expense) {
            bugdetAppModel.updateRemainderAndTotalPaid([expense]);
        };

    };


});