describe('payment controller tests', function() {
    var $controller, $scope;
    
    beforeEach(module('budgetApp'));

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
        $scope = {
            budgetAppModel : {
                addPayment : sinon.spy()
            }
        }
    }));

    it('should add payment', function() {
        var payment = $scope.addPayment(date, amount, tags);
        expect(payment.date).toEqual(date);
        expect(payment.amount).toEqual(amount);
        expect(payment.tags).toEqual(tags);
        sinon.assert.calledWith(budgetAppModel.addPayment, payment);
        sinon.assert.calledOnce(budgetAppModel.addPayment);
    });

});
