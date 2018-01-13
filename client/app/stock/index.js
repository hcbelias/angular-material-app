'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './stock.routes';
import ListController from './stock-list.controller';

export default angular.module('webApp.stock', [uiRouter, 'ngMaterial'])
  .config(routing)
  .controller('ListStockController', ListController)
  .name;
