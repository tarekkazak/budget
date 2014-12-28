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
io.listen(3300);
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
            res.json(currentReport);
            res.end();
        });
    });

app.route('/reports/:year/:month/payments/:id')
    .post(function(req, res) {
        console.log('payments');
        currentReport.payments.push(req.body);
        io.emit('payments', currentReport.payments);
    })
    .delete(function(req, res) {
        _.remove(currentReport.payments, function(item) {
            return item.id === req.params.id;
        });
        io.emit('payments', currentReport.payments);
    });



app.route('/tags/:id')
    .post(function(req, res) {
        console.log('tags');
        console.log(req.body);
        data.content.tags = req.body;
        io.emit('tags', data.content.tags);
    
});

app.listen(4400, function() {
    console.log('running on 4400');   
});
