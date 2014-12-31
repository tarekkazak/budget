angular.module('budgetApp.model')
    .factory('dao', ['DataService', function(DataService) {
       return (function () { 
           var socket, 
               readyObservable = Rx.Observable.create(function(obs) {
                    socket.on('connect', function() {
                        obs.onNext();
                    });    
                }),
            subject = {
               ready : readyObservable,
               stream : fromWebSocket('http://192.168.1.104:3300')
           };
           
            

            function fromWebSocket(address) {
                socket = io(address);
                // Handle the data
                var observable = Rx.Observable.create (function (obs) {

                    // Handle messages
                    socket.io.on('packet', function (packet) {
                        if (packet.data) {
                            obs.onNext({
                                name: packet.data[0],
                                data: packet.data[1]
                            });
                        }
                    });
                    socket.on('error', function (err) { obs.onError(err); });
                    socket.on('reconnect_error', function (err) { obs.onError(err); });
                    socket.on('reconnect_failed', function () { obs.onError(new Error('reconnection failed')); });
                    socket.io.on('close', function () { obs.onCompleted(); });

                    // Return way to unsubscribe
                    return function() {
                        socket.close();
                    };
                });

                 var observer = Rx.Observer.create(function (event) {
                    if (socket.connected) {
                        socket.emit(event.name, event.data);
                    }
                });

                return Rx.Subject.create(observer, observable);
            }

            return {
                getReport: function(year, month) {
                    return DataService.get('/reports/' + year + '/' + month);
                },

                updateReport : function(year, month, change) {
                    return DataService.patch('/reports/' + year + '/' + month, change);
                },

                createReport : function(year, month, report) {
                    return DataService.post('/reports/' + year + '/' + month, report);
                },

                addTag : function(tag) {
                    return DataService.put('/tags/' + tag.id , tag);
                },
                
                updateTag : function(id, change) {
                    return DataService.patch('/tags/' + id , change);
                },
                
                deleteTag : function(id) {
                    return DataService.delete('/tags/' + id);
                },

                addPayment : function(year, month, payment) {
                    return DataService.put('/reports/' + year + '/' + month + '/payments/' + payment.id , payment);
                },

                updatePayment : function(year, month, id, change) {
                    return DataService.patch('/reports/' + year + '/' + month + '/payments/' + id , change);
                },

                deletePayment : function(year, month, id) {
                    return DataService.delelte('/reports/' + year + '/' + month + '/payments/' + id);
                },

                dataStream : subject
            };
       }());
    }]);
