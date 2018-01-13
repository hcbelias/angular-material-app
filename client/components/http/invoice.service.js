'use strict';

export default function InvoiceResource($resource) {
  'ngInject';

  return $resource('/api/invoices/:id/:action/:actionid/:subaction/:subactionid', {
    id: '@_id'
  }, {
    editInvoice: {
      method: 'PUT'
    },
    createInvoice:{
        method: 'POST'
    },
    getInvoices: {
      method: 'GET',
      params: {
        id: ''
      },
      isArray: true
    },
    getInvoice: {
      method: 'GET',
      params: {
        id: 'id'
      }
    },
    confirmProduct: {
      method: 'PUT',
      params: {
        id: '@id',
        action: 'product',
        actionid: '@actionid'
      }
    },
    confirmKeg: {
      method: 'PUT',
      params: {
        id: '@id',
        action: 'product',
        actionid: '@actionid',
        subaction: 'keg',
        subactionid: '@subactionid'
      }
    }
  });
}

