angular.module('budgetApp.model')
    .factory('dataModel', ['dao', function(dao) {
        return function (socketMessage) {
            var observable;
            dao.dataStream.ready.subscribe(function() {
                observable = dao.dataStream.stream.where(function(data) { return data.name === socketMessage;}).select(function(data) {
                  return data.data;  
                }); 
            });
            return {
                getStream :  function() {
                    return observable;
                },
                ready : dao.dataStream.ready
            };
        }
    }]);
