'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('product-list', {
    url: '/products',
    template: require('./product-list.pug'),
    controller: 'ListProductController',
    authenticate: 'admin',
    controllerAs: 'ctrl',
    title: 'Busca de Produtos',
    nav: true
  }) 
 .state('product-edit', {
    url: '/products/:id',
    template: require('./product-edit.pug'),
    controller: 'EditProductController',
    authenticate: 'admin',
    controllerAs: 'ctrl',
    title: 'Edição de Produto',
    nav: true
  })
  .state('product-create', {
    url: '/products/new',
    template: require('./product-edit.pug'),
    controller: 'EditProductController',
    authenticate: 'admin',
    controllerAs: 'ctrl',
    title: 'Novo Produto',
    nav: true
  });
}
