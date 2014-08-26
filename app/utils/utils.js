define(['lodash'], function (_) {
    return {
        deleteItemFromList: function (itemToDelete, list) {
            _.remove(list, function (item) {
                return item === itemToDelete;
            });
        }
    };
});