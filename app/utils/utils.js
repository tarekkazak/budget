module.exports = (function(window) {
    var utils = {
         deleteItemFromList: function (itemToDelete, list) {
             _.remove(list, function (item) {
                 return item === itemToDelete;
             });
         }
    };
    window.utils = utils;
 }(window));

