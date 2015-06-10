
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
     //me.updateExpenseWithPaidAmount = (fromDate, toDate) => {
     //    var updatedExpenses = _.map(budgetApp.getExpenses(), (item) => {
     //        item.paid = paymentUtils.getTotalPaid(budgetApp.getPayments(), item.tag, fromDate, toDate);
     //    });

     //    return updatedExpenses;
     //}
    it('should add paid attribute to expenses', () => {
        expenses = [
            {},
            {}
        ];
        paymentUtils.getTotalPaid.returns(100);
        var updatedExpenses = expenseRouter.updateExpenseWithPaidAmount(new Date(), new Date());
        expect(paymentUtils.getTotalPaid.callCount).toEqual(2);
        expect(expenses[0]).toEqual(jasmine.objectContaining({
            paid : 100
        }));
        expect(expenses[1]).toEqual(jasmine.objectContaining({
            paid : 100
        }));
        //pending('incomplete');
    });
});
