'use strict';

export default function ProviderResource($resource) {
  'ngInject';

  return $resource('/api/providers/:id/:path', {
    id: '@_id'
  }, {
    editProvider: {
      method: 'PUT'
    },
    createProvider:{
        method: 'POST'
    },
    getProviders: {
      method: 'GET',
      params: {
        id: ''
      },
      isArray: true
    },
    getProvider: {
      method: 'GET',
      params: {
        id: 'id'
      }
    },
    getProviderProducts:{
      method: 'GET',
      params: {
        id: 'id',
        path: 'products'
      },
      isArray: true
    },
    getProviderInvoices:{
      method: 'GET',
      params: {
        id: 'id',
        path: 'invoices'
      },
      isArray: true
    }
  });
}

