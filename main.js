/**
 * Created by tarekkazak on 2014-10-11.
 */
require('jquery');
require('socketio');
require('rxjs');
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
require('./app/utils/utils');
require('./app/app');
require('./app/model/budgetAppModel');
require('./app/model/dao/reportDao');
require('./app/service/dataService');
require('./app/service/templateService');
require('./app/directive/tagEditor');
require('./app/controller/reportSearchController');
require('./app/controller/gridController');
require('./app/controller/expenseOperationsController');
