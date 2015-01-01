/**
 * Created by tarekkazak on 2014-05-15.
 */
angular.module('budgetApp.model')
    .factory('budgetAppModel', ['dao', function (dao) {


        var me = this;
        me.loadedExpenseReport = null;
        
        me.addTag = function(tag) {
            dao.addTag(tag);
        };

        me.updateTag = function(id, change) {
            dao.updateTag(id, [{
                "op" : "replace", "path" : change.property, "value" : change.value
            }]);
        };

        me.addPayment = function(payment) {
            console.log(payment);
            dao.addPayment(me.loadedExpenseReport.year, me.loadedExpenseReport.month, payment);
        }; 

        me.updatePayment = function(id, change) {
            console.log(id + '  ' + change);
            dao.updatePayment(me.loadedExpenseReport.year, me.loadedExpenseReport.month, id, [{
                "op" : "replace", "path" : change.property, "value" : change.value
            }]);
        };

        me.getReport = function(year, month) {
            dao.getReport(year, month).then(function(res) {
                
                    me.loadedExpenseReport = res.data;

                    if (me.loadedExpenseReport) {
                        console.log(me.loadedExpenseReport); 
                    } else {
                        dao.createReport(year, month, {
                            year: year,
                            month : month,
                            payments : []
                        });
                    }
                    
            });
        };



        me.getTotalByTransactionType = function(payments, transactionType) {
            var total = 0, transactions;
            transactions =  _(payments).filter(function(item) {
                     return _.contains(item.tags, transactionType);   
                }).value();
            if(transactions && transactions.length > 0) {
                total += _(transactions).pluck("amt").reduce(function (a, b) {
                    return Number(a) + Number(b);
                });
            }
            return total.toFixed(2);
        };

        me.getTotalCredit = function(payments) {
            return me.getTotalByTransactionType(payments, 'credit');
        };

        me.getTotalDebit = function(payments) {
            return me.getTotalByTransactionType(payments, 'debit');
        };

        //TODO: refactor or delete..
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


        return me;
    }]);


