'use strict';

import angular from 'angular';
import SignupController from './signup.controller';
import SignupListController from './signup-list.controller';

export default angular.module('webApp.signup', [])
  .controller('SignupController', SignupController)
  .controller('SignupListController', SignupListController)
  .name;
