'use strict';

export default function StoreResource($resource) {
  'ngInject';

  return $resource('/api/stores/:id/:controller/:actionid', {
    id: '@_id'
  }, {
    editStore: {
      method: 'PUT'
    },
    createStore:{
        method: 'POST'
    },
    getStores: {
      method: 'GET',
      params: {
        id: ''
      },
      isArray: true
    },
    getStore: {
      method: 'GET',
      params: {
        id: 'id'
      }
    },
    getStock:{
      method: 'GET',
      params:{
        id: '@id',
        controller: 'stocks'
      },
      isArray: true
    },
    getCashier:{
      method: 'GET',
      params:{
        id: '@id',
        controller: 'cashier'
      }
    },
    openCashier:{
      method: 'POST',
      params:{
        id: '@id',
        controller: 'cashier'
      }
    },
    closeCashier:{
      method: 'PUT',
      params:{
        id: '@id',
        controller: 'cashier'
      }
    },
    getActiveKegs:{
      method: 'GET',
      params:{
        id: 'id',
        controller: 'kegs'
      },
      isArray: true
    },
    setActiveKeg:{
      method: 'POST',
      params:{
        id: '@id',
        actionid: '@actionid',
        controller: 'keg'
      }
    },
    getProducts:{
      method: 'GET',
      params:{
        id: 'id',
        controller: 'products'
      },
      isArray: true
    },
    getKegList:{
      method: 'GET',
      params:{
        id:'@id',
        controller: 'keg-view'
      },
      isArray: true
    }
  });
}
