'use strict';

import angular from 'angular';

import uiRouter from 'angular-ui-router';

import _Auth from '../../components/auth/auth.module';
import routing from './account.routes';
import login from './login';
import password from './password';
import signup from './signup';

export default angular.module('webApp.account', [uiRouter, password, login, signup, _Auth])
  .config(routing)
  .name;
