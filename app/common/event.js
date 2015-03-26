(function() {
    var root = this;
    var IO_EVENTS = {
        TAGS_UPDATED : 'tagsUpdated',
        PAYMENTS_UPDATED : 'paymentsUpdated',
        REPORT_UPDATED : 'reportUpdated',
        CONNECTION_ESTABLISHED : 'connectionEstablished',
        EXPENSES_UPDATED : 'expensesUpdated'
    };

    if(module && module.exports) {
        module.exports = IO_EVENTS;
    } else {
        root.IO_EVENTS = IO_EVENTS;
    }
 }());



