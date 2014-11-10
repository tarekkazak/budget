/**
 * Created by tarekkazak on 2014-10-11.
 */
require('jquery');
require('lodash');
require('spinjs');
var angular = require('angular');
require('ngGrid');
require('angularUIBootstrap');
require('angular-route');
require('angular-sanitize');
require('angular-spinner');
require('bstooltip');

//app
require('./app/model/budgetAppModel');
require('./app/service/dataService');
require('./app/directive/paymentList');
require('./app/directive/tagEditor');
require('./app/controller/reportSearchController');
require('./app/controller/editorController');
require('./app/controller/gridController');
require('./app/controller/expenseOperationsController');
require('./app/app');
