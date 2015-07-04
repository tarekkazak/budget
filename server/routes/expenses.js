module.exports = function(budgetApp, paymentUtils, _, io, IO_EVENTS, jsonSerializer)  {
     var me = this;

     me.updateExpenseWithPaidAmount = (fromDate, toDate) => {
         var updatedExpenses = _.map(budgetApp.getExpenses(), (item) => {
             item.paid = paymentUtils.getTotalPaid(budgetApp.getPayments(), item.tag, fromDate, toDate);
             return item;
         });

         return updatedExpenses;
     };

     me.expenses = {
         route : '/expenses/:fromDate/:toDate',
         get : (req, res) =>  {
             var fromDate = new Date(req.params.fromDate),
                 toDate = new Date(req.params.toDate),
                 updatedExpenses = me.updateExpenseWithPaidAmount(fromDate, toDate); 
             res.json(updatedExpenses);

         }
     };
     
     me.expensesById = {
         route : '/expenses/:id',
         patch : (req, res) => {
             var expense, propChanges = req.body;
             expense = _(budgetApp.getExpenses()).where({ 'id' : req.params.id }).first();
             _(propChanges).forEach(function(propChange) {
                 expense[propChange.path] = propChange.value;
             });
             //TODO: determine if IO update should remain separate operation from serialize
             io.emit(IO_EVENTS.EXPENSES_UPDATED, budgetApp.getExpenses());
             jsonSerializer.write();
         },
         put : (req, res) => {
             bugdetApp.addExpense(req.body);
             io.emit(IO_EVENTS.EXPENSES_UPDATED, budgetApp.getExpenses());
             jsonSerializer.write();
         },
         delete : (req, res) => {
             budgetApp.removeExpense(req.params.id);
             io.emit(IO_EVENTS.EXPENSES_UPDATED, budgetApp.getExpenses());
             jsonSerializer.write();
         }
     } 
};
