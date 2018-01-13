'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('client-list', {
    url: '/clients',
    template: require('../base-templates/list-base.pug'),
    controller: 'ListClientController',
    authenticate: 'admin',
    controllerAs: 'ctrl',
    title: 'Busca de Clientes',
    nav: true
  }) 
 .state('client-edit', {
    url: '/clients/:id',
    template: require('./client-edit.pug'),
    authenticate: 'admin',
    controller: 'EditClientController',
    controllerAs: 'ctrl',
    title: 'Edição de Clientes',
    nav: true
  })
  .state('client-create', {
    url: '/clients/new',
    template: require('./client-edit.pug'),
    authenticate: 'admin',
    controller: 'EditClientController',
    controllerAs: 'ctrl',
    title: 'Novo Cliente',
    nav: true
  });
}
