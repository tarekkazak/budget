/**
 * Created by tarekkazak on 2014-05-15.
 */
angular.module('budgetApp.model')
    .factory('budgetAppModel', ['dao', '$rootScope', function (dao, $rootScope) {


        var me = this,
            totalFunds = 0,
            wishlist,
            splits,
            selectedMonth,
            selectedYear,
            inEditMode = false;
        me.siteData = undefined;
        me.loadedExpenseReport = null;
        me.isNew = false;
        me.tags = [];
        me.payments = [];

        dao.dataStream.where(function(data) {return data.name === 'tags'}).subscribe(function(data) {
            console.log('return form io server');
            console.log(data);
        }, function(err){
            console.log('error');
         console.log(err);   
        });

        me.updatePayments = function(payment) {
            dao.updatePayments(me.loadedExpenseReport.year, me.loadedExpenseReport.month, payment);
        }; 

        me.getReport = function(year, month) {
            dao.getReport(year, month).then(function(res) {
                
                    me.loadedExpenseReport = res.data;

                    if (me.loadedExpenseReport) {
                        me.isNew = false;
                        console.log(me.loadedExpenseReport); 
                    } else {

                        me.loadedExpenseReport = {
                            year : year,
                            month : month,
                            payments : []
                        };
                        me.isNew = true;
                    }
                    me.updateTags({id: 123, label : 'tag'});
                    
            });
        };

        me.isNullOrUndefined = function(object) {
            return _.isUndefined(object) || _.isNull(object);
        };

        me.updateTags= function(tag) {
            dao.updateTags(tag);
        };

        me.updateTotalPaid = function() {
            if(me.payments) {
                return _(me.payments).pluck("amt").reduce(function (a, b) {
                    return Number(a) + Number(b);
                }).toFixed(2);
            }
        };

        $rootScope.$on('modelUpdate', function(scope, payload) {
            $rootScope.$broadcast('modelUpdated', payload);
        });

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


