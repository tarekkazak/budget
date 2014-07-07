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
            selectedMonth,
            selectedYear,
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

        me.addNonTemplateProps = function(arr) {
            _.each(arr, function(el) {
                el.remainder = Number(el.amt);
                el.payments = [];
                el.paid = 0;
                el.skip = false;
                el.tags = [];
            });
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

        me.setIntialFunds = function(value) {
            me.loadedExpenseReport.initialFunds = value;
            updateRegisteredObjects('initialFunds', value);
        };

        me.setSelectedMonth = function(value) {
            updateRegisteredObjects('selectedMonth', value);
        };

        me.setSelectedYear = function(value) {
            updateRegisteredObjects('selectedYear', value);
        };

        me.setUpcoming = function(value) {
            updateRegisteredObjects('upcoming', value);
        };

        me.removeCircularReferencesFromChildExpenses = function (expenses) {
            var expensesWithParent =_(expenses).pluck('children').flatten().compact().value();
            _.each(expensesWithParent, function(item) {
                delete item.parent;
            });
        };

        me.updateRemainderAndTotalPaid = function(expenses) {
            _.each(expenses, function (el) {
                var totalPaid;
                if (_.has(el, 'children')) {
                    me.updateRemainderAndTotalPaid(el.children);
                } else {
                    totalPaid = _.reduce(_.pluck(el.payments, 'amt'), function (total, amt) {
                        return Number(total) + Number(amt);
                    }) || 0;
                    el.remainder = (Number(el.amt) - totalPaid).toFixed(2);
                    el.paid = Number(totalPaid).toFixed(2);
                }
            });
        };

        me.sumValuesForProperty = function (property, filterProp) {
            var total, parts, values, childrenValues, filterFunc, allValues;
            filterFunc = function(item) {
                return !_.has(item, filterProp) || item[filterProp] === false;
            };
            parts = _.groupBy(expenses, function (expense) {
                return !_.has(expense, "children");
            });
            values = me.isNullOrUndefined(filterProp) ? _(parts['true']).pluck(property).value() : _(parts['true']).filter(filterFunc).pluck(property).value();
            childrenValues =  me.isNullOrUndefined(filterProp) ? _(parts['false']).pluck('children').flatten().pluck(property).value() : _(parts['false']).pluck('children').flatten().filter(filterFunc).pluck(property).value();

            allValues = values.concat(childrenValues);
            total = _.reduce(allValues, function (acc, amt) {

                function addValues(a, b) {
                    a = Number(a);
                    b = Number(b);
                    a = a < 0 ? 0 : a;
                    b = b < 0 ? 0 : b;
                    return a + b;
                }

                if (_.isArray(acc)) {
                    acc = _.reduce(acc, addValues);

                }

                if (_.isArray(amt)) {
                    if (amt.length === 0) {
                        amt.push(0);
                    }
                    amt = _.reduce(acc, addValues);
                }
                return addValues(acc, amt);
            });
            return Number(total).toFixed(2);
        };

        me.allExpenses = function() {
            var splitExpenses,
                flattened;
            splitExpenses = _.groupBy(expenses, function(expense) {
                return !_.has(expense, "children");
            });
            flattened = _.flatten(splitExpenses[false], function(item) {
                _.each(item.children, function(subItem) {
                    subItem.parent = item;
                });
                return item.children;
            });
            return splitExpenses[true].concat(flattened);
        };


    }
    var MODEL = new BudgetAppModel(_);
    return MODEL;

});