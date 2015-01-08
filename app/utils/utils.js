(function() {
    var root = this;
    var utils = {
         deleteItemFromList: function (itemToDelete, list) {
             _.remove(list, function (item) {
                 return item === itemToDelete;
             });
         },

        isNullOrUndefined : function(object) {
            return _.isUndefined(object) || _.isNull(object);
        },

	getGUID : function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
	}
    };

    if(module && module.exports) {
        module.exports = utils;
    } else {
        root.utils = utils;
    }
 }());

