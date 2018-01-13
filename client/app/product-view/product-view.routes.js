'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('product-view', {
    url: '/product/view/:id',
    template: '<productview></productview>',
    authenticate: true,
    title: 'Produto',
    nav: false
  });
}
