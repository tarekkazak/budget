/**
 * Created by tarekkazak on 2014-05-15.
 */
define(['lodash'], function(_) {

    function BudgetAppModel(_) {


        var me = this,
            registeredOnjects = {},
            totalFunds = 0,
            expenses,
            wishlist,
            templateMode = false,
            inEditMode = false;
        me.siteData = undefined;
        me.loadedExpenseReport = null;
        me.isNew = false;

        function updateRegisteredObjects(prop, value) {
            _.each(registeredOnjects[prop], function (func) {
                func(value);
            });
        }

        me.isNullOrUndefined = function(object) {
            return _.isUndefined(object) || _.isNull(object);
        };

        me.registerForUpdate = function(prop, func) {
            if (me.isNullOrUndefined(registeredOnjects[prop])) {
                registeredOnjects[prop] = [];
            }
            registeredOnjects[prop].push(func);
        };

        me.setTemplateMode = function(value) {
            templateMode = value;
            updateRegisteredObjects('templateMode', value);
        };


        me.setInEditMode = function(value) {
            inEditMode = value;
            updateRegisteredObjects('inEditMode', value);
        };

        me.setExpenses = function(value) {
            expenses = value;
            updateRegisteredObjects('expenses', value);
        };

        me.setWishlist = function(value) {
            wishlist = value;
            updateRegisteredObjects('wishlist', value);
        };

        me.setTotalFunds = function(value) {
            me.loadedExpenseReport.totalFunds = value;
            updateRegisteredObjects('totalFunds', value);
        };

        me.updateRemainderAndTotalPaid = function(expenses) {
            _.each(expenses, function (el) {
                var totalPaid;
                if (_.has(el, 'children')) {
                    me.updateRemainderAndTotalPaid(el.children);
                } else {
                    totalPaid = _.reduce(el.payments, function (total, amt) {
                        return Number(total) + Number(amt);
                    }) || 0;
                    el.remainder = Number(el.amt) - totalPaid;
                    el.paid = totalPaid;
                }
            });
        };




    }
    var MODEL = new BudgetAppModel(_);
    return MODEL;

});