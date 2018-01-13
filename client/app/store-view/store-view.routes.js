'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('store-view', {
    url: '/store/:orderId',
    template: '<storeview></storeview>',
    title: 'Chopps da Loja',
    nav: false
  });
}
