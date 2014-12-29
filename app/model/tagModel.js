angular.module('budgetApp.model')
    .factory('tagModel', ['dao', function(dao) {
        var subscriber;
        dao.dataStream.ready.subscribe(function() {
            subscriber = dao.dataStream.stream.where(function(data) { return data.name === 'tagsUpdated'}).select(function(data) {
              return data.data;  
            }); 
        });
        return {
            getStream :  function() {
                return subscriber;
            },
            ready : dao.dataStream.ready
        }
    }]);
