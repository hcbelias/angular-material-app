'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('provider-list', {
    url: '/providers',
    template: require('./provider-list.pug'),
    controller: 'ListProviderController',
    authenticate: 'admin',
    controllerAs: 'ctrl',
    title: 'Busca de Fornecedor',
    nav: true
  }) 
 .state('provider-edit', {
    url: '/providers/:id',
    template: require('./provider-edit.pug'),
    authenticate: 'admin',
    controller: 'EditProviderController',
    controllerAs: 'ctrl',
    title: 'Edição de Fornecedor',
    nav: true
  }) 
  .state('provider-create', {
    url: '/providers/new',
    template: require('./provider-edit.pug'),
    authenticate: 'admin',
    controller: 'EditProviderController',
    controllerAs: 'ctrl',
    title: 'Novo Fornecedor',
    nav: true
  });
}
