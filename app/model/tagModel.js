angular.module('budgetApp.model')
    .factory('tagModel', ['dao', function(dao) {
        var observable;
        dao.dataStream.ready.subscribe(function() {
            observable = dao.dataStream.stream.where(function(data) { return data.name === 'tagsUpdated'}).select(function(data) {
              return data.data;  
            }); 
        });
        return {
            getStream :  function() {
                return observable;
            },
            ready : dao.dataStream.ready
        }
    }]);
