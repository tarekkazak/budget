module.exports = (() => {
    var _payments;

    function getPayments() {
        return _payments;
    }

    function setPayments(value) {
        _payments = value;
    }

    return {
        getPayments : getPayments,
        setPayments : setPayments
    };
}());
