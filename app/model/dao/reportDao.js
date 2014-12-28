angular.module('budgetApp.model')
    .factory('dao', ['DataService', function(DataService) {
       return (function () { 
           var subject = fromWebSocket('http://192.168.1.104:3300', Rx.Observer.create(function() {
                console.log('connected');
            }));
           
        function fromWebSocket(address, openObserver) {
            var socket = io(address);
            // Handle the data
            var observable = Rx.Observable.create (function (obs) {
                if (openObserver) {
                    socket.on('connect', function () {
                        openObserver.onNext();
                        openObserver.onCompleted();
                    });
                }

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

                updateTags : function(tag) {
                    return DataService.post('/tags/' + tag.id , tag);
                },
                
                deleteTag : function(id) {
                    return DataService.delete('/tags/' + id);
                },

                updatePayments : function(year, month, payment) {
                    return DataService.post('/reports/' + year + '/' + month + '/payments/' + payment.id , payment);
                },

                deletePayment : function(year, month, id) {
                    return DataService.delelte('/reports/' + year + '/' + month + '/payments/' + id);
                },

                dataStream : subject
            };
       }());
    }]);
