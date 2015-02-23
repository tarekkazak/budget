/**
 * Created by tarekkazak on 2014-10-11.
 */
require('jquery');
require('socketio');
require('rxjs');
require('lodash');
require('spinjs');
require('angular');
require('ngGrid');
require('angularUIBootstrap');
require('angular-spinner');
require('bstooltip');

//React components
//app
require('utils');
require('./app/app');
require('./app/model/budgetAppModel');
require('./app/model/paymentsModel');
require('./app/model/tagModel');
require('./app/model/dao/reportDao');
require('./app/service/dataService');
require('./app/service/templateService');
require('./app/directive/tagEditor');
require('./app/directive/react/TagEditor.jsx');
require('./app/directive/react/paymentAmount.jsx');
require('./app/directive/gridTagsDisplay');
require('./app/directive/creditOrDebit');
require('./app/controller/reportSearchController');
require('./app/controller/gridController');
require('./app/controller/expenseOperationsController');
