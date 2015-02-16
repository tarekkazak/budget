var q = require('q'); 
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var data;
var _ = require('lodash');
var promise;
var defer;
var currentReport;
var utils = require('./app/utils/utils');
app.use(bodyParser.json());
app.use(express.static(__dirname));

function processLegacyReport(expenses) {
     var allPayments = [];
     allPayments = _.pluck(expenses, 'payments');
     allPayments = _(allPayments).compact().flatten().value();
     allPayments = allPayments.concat(_(expenses).pluck('children').compact().flatten().pluck('payments').flatten().value());
     _.each(allPayments, function(item) {
        item.id = utils.getGUID();
     });
     //if tags do not contain debit or credit, set debit by default
     var tags = _(allPayments).pluck('tags').compact().value();
     _(tags).each(function(item) {
        if(_.isString(item)) {
            index = tags.indexOf(item);
            item = item.split(',');
            tags[index] = item;
        }

        if(!_.contains(item, 'debit') && !_.contains(item, 'credit')) {
            item.push('debit');
        }
     });
     return allPayments;
 }

function checkNoMissingTagsInMainList(payments) {
     var allTags, existingTags, diff, diffTags,
         allTagLabels = _(payments).pluck('tags').flatten().compact().uniq().value();
     allTags = _(allTagLabels).map(function(tag){
         return {
                 "label" : tag,
                 "id" : utils.getGUID()
            };
     }).value();
            
     if(data.content.tags) {
      existingTags = _(data.content.tags).pluck('label').value();
      if(existingTags.length < allTags.length ) {
          diff = _.difference(allTagLabels, existingTags);
          diffTags = _(diff).map(function(tag){
                      return {
                      "label" : tag,
                      "id" : utils.getGUID()
                  };
              }).value();
                  
           allTags = allTags.concat(diffTags);
        } else {
           allTags = data.content.tags;
        }
      }
     
    return allTags

}

io.on('connection', function(socket) {
    socket.emit('hello', {h:'a'});
});

function loadData() {
    defer = q.defer();
    promise = defer.promise;
    if(!data) {
        fs.readFile('./data/content.json', 'utf-8', function(err, res) {
            data = JSON.parse(res);
            defer.resolve(data);
        });
    } else {
        defer.resolve(data);
    }
} 

function writeData() {
    fs.writeFile('./data/content.json', JSON.stringify(data), 'utf-8', function(err) {
     if(err) {
        throw err;
     }
    });
}

app.route('/reports/:year/:month')
 .get(function(req, res, next) {
        loadData();
        var year = req.params.year,
        month = req.params.month;
        promise.then(function(result) {
            currentReport = _(result.content.history).findWhere({"year" : Number(year), "month" : Number(month)});
            if(data.content.expenses || currentReport.expenses) {
                console.log('legacy');
                delete data.content.expenses;
                currentReport.payments = processLegacyReport(currentReport.expenses);
                delete currentReport.expenses;
            }
            data.content.tags = checkNoMissingTagsInMainList(currentReport.payments);

            console.log('report ready');
            io.emit('tagsUpdated', data.content.tags);
            io.emit('paymentsUpdated', currentReport.payments);
            res.json(currentReport);

            res.end();
        });
    })
   .patch(function(req, res) {
        var propChange = req.body[0];
        currentReport[propChange.path] = propChange.value;
        io.emit('reportUpdated', propChange);
        writeData();
   })
    .post(function(req, res) {
        var report = req.body;
        data.content.history.push(report);
        writeData();
    });

app.route('/reports/:year/:month/payments/:id')
    .put(function(req, res) {
        currentReport.payments.push(req.body);
        io.emit('paymentsUpdated', currentReport.payments);
        writeData();
    })
    .patch(function(req, res) {
        var payment, propChange = req.body[0];
        payment = _(currentReport.payments).where({ 'id' : req.params.id }).first();
        if(payment) {
            payment[propChange.path] = propChange.value;
            io.emit('paymentsUpdated', currentReport.payments);
            console.log(payment);
            writeData();
        }
    })
    .delete(function(req, res) {
        _.remove(currentReport.payments, function(item) {
            return item.id === req.params.id;
        });
        io.emit('paymentsUpdated', currentReport.payments);
        writeData();
    });



app.route('/tags/:id')
    .patch(function(req, res) {
        var tag, propChanges = req.body;
        tag = _(data.content.tags).where({ 'id' : req.params.id }).first();
        _(propChanges).forEach(function(propChange) {
            tag[propChange.path] = propChange.value;
        });
        console.log(tag);
        io.emit('tagsUpdated', data.content.tags);
        writeData();
    })
    .put(function(req, res) {
        data.content.tags.push(req.body);
        io.emit('tagsUpdated', data.content.tags);
        writeData();
    })    
    .delete(function(req, res) {
        _.remove(data.content.tags, function(item) {
            return item.id === req.params.id;
        });
        io.emit('tagsUpdated', currentReport.payments);
        writeData();
    });

io.listen(3300);
app.listen(4400, function() {
    loadData();
    console.log('running on 4400');   
});
