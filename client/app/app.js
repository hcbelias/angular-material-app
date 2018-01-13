'use strict';

import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';
import 'angular-chart.js/angular-chart.js';

import uiRouter from 'angular-ui-router';
import 'angular-validation-match';


import {
  routeConfig
} from './app.config';


import _Auth from '../components/auth/auth.module';

//Modules
import account from './account';
import admin from './admin';
import client from './client';
import provider from './provider';
import product from './product';
import invoice from './invoice';
import stock from './stock';
import Services from '../components/http';

//Components
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import kegcard from '../components/keg-card/keg-card.component';
import paymentreport from '../components/report/payment-report.component';
import cashierreport from '../components/report/cashier-report.component';
import kegreport from '../components/report/keg-report.component';
import salesreport from '../components/report/sales-report.component';
import menuorder from '../components/menu-order/menu-order.component';
import stockrow from '../components/stock-row/stock-row.component';
import main from './main/main.component';
import storeview from './store-view/store-view.component';
import productview from './product-view/product-view.component';
import report from './report/report.component';
import util from '../components/util/util.module';
import cashiercalculator from '../components/cashier-calculator/cashier-calculator.component';
import csvexporter from '../components/csv-exporter/csv-exporter.component';
import kegdetailcard from '../components/keg-detail-card/keg-detail-card.component';


import constants from './app.constants';

import './app.scss';
import 'angular-material/angular-material.css';
import 'angular-material-data-table/dist/md-data-table.min.css';
import 'angular-material/angular-material.js';
import { debug } from 'util';


angular.module('webApp', [
  ngCookies,
  ngResource,
  ngSanitize,
  uiRouter,
  ngMessages,
  ngAnimate,
  ngMaterial,
  'chart.js',
  'validation.match',
  require('angular-input-masks'),
  Services,
  _Auth,
  constants,
  util,
  account,
  admin,
  navbar,
  footer,
  main,
  report,
  kegcard,
  client,
  provider,
  product,
  invoice,
  stock,
  stockrow,
  menuorder,
  cashiercalculator,
  paymentreport,
  csvexporter,
  cashierreport,
  kegreport,
  storeview,
  require('angular-material-data-table'),
  kegdetailcard,
  productview,
  salesreport
])
  .config(routeConfig)
  .run(function ($rootScope, $location, Auth, $state) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedIn(function (loggedIn) {
        let admin = loggedIn && (loggedIn === 'admin');
        if (loggedIn) {
          if (next.name === 'login' || (!admin && next.authenticate === 'admin')) {
            $state.go('main');
          }
        } else {
          if (!!next.authenticate) {
            $location.path('/login');
          }
        }
      });
    });
  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['webApp'], {
      strictDi: true
    });
  });
