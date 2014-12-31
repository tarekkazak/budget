module.exports = (function(window) {
    var utils = {
         deleteItemFromList: function (itemToDelete, list) {
             _.remove(list, function (item) {
                 return item === itemToDelete;
             });
         },

        isNullOrUndefined : function(object) {
            return _.isUndefined(object) || _.isNull(object);
        }
    };
    window.utils = utils;
 }(window));

