'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './product.routes';
import EditController from './product-edit.controller';
import ListController from './product-list.controller';

export default angular.module('webApp.product', [uiRouter])
  .config(routing)
  .controller('EditProductController', EditController)
  .controller('ListProductController', ListController)
  .name;
