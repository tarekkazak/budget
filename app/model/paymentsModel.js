angular.module('budgetApp.model')
    .factory('paymentsModel', ['dao', function(dao) {
        var observable;
        dao.dataStream.ready.subscribe(function() {
            observable = dao.dataStream.stream.where(function(data) { return data.name === 'paymentsUpdated';})
                .select(function(data) {
                    return data.data;  
                }); 

        });
        return {
            getStream :  function() {
                return observable;
            },
            ready : dao.dataStream.ready
        };
        
    }]);
