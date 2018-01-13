'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('main', {
    url: '/main',
    authenticate: true,
    template: '<main></main>',
    title: 'Caixa',
    nav: true
  });
}
