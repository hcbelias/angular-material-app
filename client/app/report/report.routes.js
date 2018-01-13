'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('report', {
    url: '/report',
    authenticate: true,
    template: '<report></report>',
    title: 'Relatórios',
    nav: true
  });
}
