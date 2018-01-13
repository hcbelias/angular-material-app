'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('invoice-list', {
    url: '/invoices',
    template: require('./invoice-list.pug'),
    controller: 'ListInvoiceController',
    authenticate: true,
    controllerAs: 'ctrl',
    title: 'Busca de Pedidos',
    nav: true
  }) 
 .state('invoice-edit', {
    url: '/invoices/:id',
    template: require('./invoice-edit.pug'),
    controller: 'EditInvoiceController',
    authenticate: 'admin',
    controllerAs: 'ctrl',
    title: 'Edição de Pedido',
    nav: true
  })
  .state('invoice-create', {
    url: '/invoices/new',
    template: require('./invoice-edit.pug'),
    controller: 'EditInvoiceController',
    authenticate: 'admin',
    controllerAs: 'ctrl',
    title: 'Novo Pedido',
    nav: true
  })
  .state('invoice-confirmation', {
    url: '/invoices/:id/confirmation',
    template: require('./invoice-confirmation.pug'),
    controller: 'ConfirmationInvoiceController',
    authenticate: true,
    controllerAs: 'ctrl',
    title: 'Confirmação do Pedido',
    nav: true
  })
 ;
}
