'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './provider.routes';
import EditProviderController from './provider-edit.controller';
import ListProviderController from './provider-list.controller';

export default angular.module('webApp.provider', [uiRouter])
  .config(routing)
  .controller('EditProviderController', EditProviderController)
  .controller('ListProviderController', ListProviderController)
  .name;
