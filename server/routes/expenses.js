module.exports = function(budgetApp, paymentUtils, _)  {
     var me = this;

     me.updateExpenseWithPaidAmount = (fromDate, toDate) => {
         var updatedExpenses = _.map(budgetApp.getExpenses(), (item) => {
             item.paid = paymentUtils.getTotalPaid(budgetApp.getPayments(), item.tag, fromDate, toDate);
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
             expense = _(data.content.expenses).where({ 'id' : req.params.id }).first();
             _(propChanges).forEach(function(propChange) {
                 expense[propChange.path] = propChange.value;
             });
             console.log(expense);
             io.emit(IO_EVENTS.EXPENSES_UPDATED, data.content.expenses);
             writeData();
         },
         put : (req, res) => {
             if(!data.content.expenses) {
                 data.content.expenses = [];
             }
             data.content.expenses.push(req.body);
             io.emit(IO_EVENTS.EXPENSES_UPDATED, data.content.expenses);
             writeData();
         },
         delete : (req, res) => {
             _.remove(data.content.expenses, function(item) {
                 return item.id === req.params.id;
             });
             io.emit(IO_EVENTS.EXPENSES_UPDATED, data.content.expenses);
             writeData();
         }
     } 
};
