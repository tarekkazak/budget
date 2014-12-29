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
app.use(bodyParser.json());
app.use(express.static(__dirname));

function processLegacyReport(expenses) {
     var allPayments = [];
     allPayments = _.pluck(expenses, 'payments');
     allPayments = _(allPayments).compact().flatten().value();
     allPayments = allPayments.concat(_(expenses).pluck('children').compact().flatten().pluck('payments').flatten().value());
     _.each(allPayments, function(item) {
        item.id = (new Date()).getTime();
     });
     return allPayments;
 }

function checkNoMissingTagsInMainList(payments) {
     var allTags, existingTags, diff, diffTags,
         allTagLabels = _(payments).pluck('tags').flatten().compact().uniq();
            
     allTags = allTagLabels.map(function(tag){
         return {
                 "label" : tag,
                 "id" : new Date().getTime()
            };
     }).value();
            
     if(data.content.tags) {
      existingTags = _(data.content.tags).pluck('label').value();
      if(existingTags.length < allTags.length ) {
          diff = _.difference(allTagLabels, existingTags);
          diffTags = diff.map(function(tag){
                      return {
                      "label" : tag,
                      "id" : new Date().getTime()
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
    console.log('connection');
    socket.emit('hello', {h:'a'});
});

function loadData() {
    defer = q.defer();
    console.log(defer);
    promise = defer.promise;
    console.log(promise);
    if(!data) {
        fs.readFile('./data/content.json', 'utf-8', function(err, res) {
            data = JSON.parse(res);
            console.log('json loaded');
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
     console.log('saved');
    });
}

app.get('/reports/:year/:month', function(req, res, next) {
        loadData();
        console.log(req.params);
        var year = req.params.year,
        month = req.params.month;
        promise.then(function(result) {
            currentReport = _(result.content.history).findWhere({"year" : Number(year), "month" : Number(month)});
            console.log('resolving');
            if(data.content.expenses) {
                delete data.content.expenses;
                currentReport.payments = processLegacyReport(currentReport.expenses);
                delete currentReport.expenses;
            }

            console.log('-------------------------------------');
            data.content.tags = checkNoMissingTagsInMainList(currentReport.payments);
            console.log('tags loaded');
            io.emit('tagsUpdated', data.content.tags);
            io.emit('paymentsUpdated', currentReport.payments);
            res.json(currentReport);

            res.end();
        });
    });

app.route('/reports/:year/:month/payments/:id')
    .put(function(req, res) {
        currentReport.payments.push(req.body);
        io.emit('paymentsUpdated', currentReport.payments);
        writeData();
    })
    .patch(function(req, res) {
        var payment = req.body;
        _(currentReport.payments).where({id : payment.id}).merge(payment);
        console.log('updated payment: ' + _(currentReport.payments).where({id : payment.id}).value());
        io.emit('paymentsUpdated', currentReport.payments);
        writeData();
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
        var tag = req.body;
        _(data.content.tags).where({id : tag.id}).merge(tag);
        console.log('updated tag: ' + _(data.content.tags).where({id : tag.id}).value());
        io.emit('tagsUpdated', data.content.tags);
        writeData();
    })
    .put(function(req, res) {
        console.log(req.body);
        data.content.tags.push(req.body);
        io.emit('tagsUpdated', data.content.tags);
        writeData();
    
});

io.listen(3300);
app.listen(4400, function() {
    loadData();
    console.log('running on 4400');   
});
