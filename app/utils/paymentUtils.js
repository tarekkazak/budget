var _ = require('lodash');
(function(){
    var root = this;
    var paymentUtils = {
        getTotalPaid : (payments, tagId, fromDate, toDate) => {
            var total, filtered = _.filter(payments, function(item) {
                var paymentDate = new Date(item.date);
                if(!_.contains(item.tags, tagId) || paymentDate < fromDate || paymentDate > toDate){
                    return false;
                }

                return true;
            });
            total =_(filtered).pluck('amt').reduce(function(a,b){
                return Number(a) + Number(b)
            });
            return total;
        }
    };
    if(module && module.exports) {
        module.exports = paymentUtils;
    } else {
        root.paymentUtils = paymentUtils;
    }
}());
