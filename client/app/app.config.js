import { debug } from "util";
import moment from 'moment';
require('moment/locale/pt-br');

'use strict';

export function routeConfig($urlRouterProvider, $locationProvider, $mdThemingProvider, $mdDateLocaleProvider) {
  'ngInject';

  $mdThemingProvider.enableBrowserColor({
    theme: 'default', // Default is 'default'
    palette: 'primary', // Default is 'primary', any basic material palette and extended palettes are available
    hue: '800' // Default is '800'
  });

  
  $mdDateLocaleProvider.months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro' ];
  $mdDateLocaleProvider.shortMonths = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  $mdDateLocaleProvider.days = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sábado'];
  $mdDateLocaleProvider.shortDays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
  $mdDateLocaleProvider.formatDate = function(date) {
    var m = moment(date);
    return m.isValid() ? m.format('l') : '';
  };
  $mdDateLocaleProvider.parseDate = function(dateString) {
    var m = moment(dateString, 'l', 'pt-br');
    return m.isValid() ? m.toDate() : new Date(NaN);
  };



  $urlRouterProvider.otherwise('/main');

  $locationProvider.html5Mode(true);
}
