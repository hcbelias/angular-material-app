'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './client.routes';
import EditClientController from './client-edit.controller';
import ListClientController from './client-list.controller';

export default angular.module('webApp.client', [uiRouter])
  .config(routing)
  .controller('EditClientController', EditClientController)
  .controller('ListClientController', ListClientController)
  .name;
