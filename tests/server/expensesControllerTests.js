
describe('expense router tests', () => {
    var expenseRouter,
        sinon = require('sinon'),
        expenses,
        paymentUtils = { 
            getTotalPaid : sinon.stub()
        },
        budgetApp = {
            getExpenses : () => expenses,
            getPayments : sinon.stub()
        };

    beforeEach(() => {
        var ExpenseRouter = require('./routes/expenses.js');
        expenseRouter = new ExpenseRouter(budgetApp, paymentUtils, require('lodash'));
    });

    it('should add paid attribute to expenses', () => {
        expenses = [
            {},
            {}
        ];
        paymentUtils.getTotalPaid.returns(100);
        var updatedExpenses = expenseRouter.updateExpenseWithPaidAmount(new Date(), new Date());
        expect(paymentUtils.getTotalPaid.callCount).toEqual(2);
        expect(updatedExpenses[0]).toEqual(jasmine.objectContaining({
            paid : 100
        }));

        expect(updatedExpenses[1]).toEqual(jasmine.objectContaining({
            paid : 100
        }));
    });

    describe('test expenses route', () => {
        it('should send json within date range ', () => {
            var expensesWithTotal = [
                100, 200, 300
            ],
            req = {
                params : {
                    fromDate : '2015-01-01',
                    toDate : '2015-04-01'
                }  
            },
            res = {
                json : sinon.spy()
            }, mock, expectation;
            
            mock = sinon.mock(expenseRouter);
            expectation = mock.expects('updateExpenseWithPaidAmount');
            expectation.returns(expensesWithTotal);
            expectation.once();
            expectation.withArgs(sinon.match.date, sinon.match.date);
            expenseRouter.expenses.get(req, res);
            
            expectation.verify();
            expect(expenseRouter.expenses.route).toEqual('/expenses/:fromDate/:toDate');
            sinon.assert.calledWith(res.json, [100, 200, 300]);
            sinon.assert.calledOnce(res.json);
        });


    });
     //me.expensesById = {
     //    route : '/expenses/:id',
     //    patch : (req, res) => {
     //        var expense, propChanges = req.body;
     //        expense = _(budgetApp.getExpenses()).where({ 'id' : req.params.id }).first();
     //        _(propChanges).forEach(function(propChange) {
     //            expense[propChange.path] = propChange.value;
     //        });
     //        //TODO: determine if IO update should remain separate operation from serialize
     //        io.emit(IO_EVENTS.EXPENSES_UPDATED, budgetApp.getExpenses());
     //        jsonSerializer.write();
     //    },
    describe('test expensesById route', () => {
        var route;
        
        beforeEach(() => {
            var route = expenseRouter.expensesById;
        });

        xit('should have correct route url', () => {
            expect(route.route).toEqual('/expenses/:id');
        });

        xit('should update expense props', () => {
            expenseRouter.patch({}, {});
        });
    });
     //    put : (req, res) => {
     //        bugdetApp.addExpense(req.body);
     //        io.emit(IO_EVENTS.EXPENSES_UPDATED, budgetApp.getExpenses());
     //        jsonSerializer.write();
     //    },
     //    delete : (req, res) => {
     //        budgetApp.removeExpense(req.params.id);
     //        io.emit(IO_EVENTS.EXPENSES_UPDATED, budgetApp.getExpenses());
     //        jsonSerializer.write();
     //    }
     //} 
});
