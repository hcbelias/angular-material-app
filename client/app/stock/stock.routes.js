'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('stock-list', {
    url: '/stocks',
    template: require('./stock-list.pug'),
    controller: 'ListStockController',
    authenticate: true,
    controllerAs: 'ctrl',
    title: 'Controle de Estoque',
    nav: true
  });
}
