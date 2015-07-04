describe('payment model tests', function() {
    var paymentModel,
        paymentDao;

    beforeEach(module('budgetApp.model'));

    beforeEach(inject(function(paymentModel, paymentDao){
        paymentModel = paymentModel;
        paymentDao = paymentDao;
    }));

    xit('should add payment', function(){
        var payment = {};
        paymentDao.addPayment = sinon.psy();
        paymentModel.addPayment(payment);
        sinon.assert.calledWith(paymentDao.addPayment, payment);
        sinon.assert.calledOnce(paymentDao.addPayment);
    });

    xit('should update payment', function(){
        var payment = {};
        paymentModel.updatePayment(payment);
        sinon.assert.calledWith(paymentDao.updatePayment, payment);
        sinon.assert.calledOnce(paymentDao.updatePayment);
    });

    xit('should delete payment', function(){
        var payment = {};
        paymentModel.deletePayment(payment);
        sinon.assert.calledWith(paymentDao.deletePayment, payment);
        sinon.assert.calledOnce(paymentDao.deletePayment);
    });
});
