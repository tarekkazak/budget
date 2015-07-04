var paymentUtils = require('./utils/paymentUtils');
describe('expense model tests', () => {
    var payments;
    beforeEach(() => {
        payments = [
            {
                id:1,
                amt:500,
                date : '01-05-2015',
                tags : [1, 2 ]
            },
            {
                id:2,
                amt:500,
                date : '02-05-2015',
                tags : [1, 3]
            },
            {
                id:3,
                amt:500,
                date : '01-15-2015',
                tags : [2, 3]
            },
            {
                id:4,
                amt:500,
                date : '08-05-2015',
                tags : [1, 2, 3]
            }
        ];
    });
    it('should calculate total payment amount for given tag and date range ', ()=> {
        var total = paymentUtils.getTotalPaid(payments, 2, new Date( '01-01-2015' ), new Date( '06-25-2015' ));
        expect(total).toEqual(1000);
    });
});
