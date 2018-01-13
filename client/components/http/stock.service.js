'use strict';

export default function StockResource($resource) {
  'ngInject';

  return $resource('/api/stocks/:id/:controller/:subcontroller', {
    id: '@_id'
  }, {
    editStock: {
      method: 'PUT'
    },
    createStock:{
        method: 'POST'
    },
    getStocks: {
      method: 'GET',
      params: {
        id: ''
      },
      isArray: true
    },
    getStock: {
      method: 'GET',
      params: {
        id: 'id'
      }
    },
    finalizeStock: {
      method: 'POST',
      params: {
        id: '@id',
        controller: 'finalize'
      }
    },
    setActiveKeg: {
      method: 'POST',
      params: {
        id: '@id',
        controller: 'keg'
      }
    },
    getKegsReportData:{
      method: 'GET',
      params:{
        id: '@id',
        controller: 'kegs',
        subcontroller: 'report'
      },
      isArray: true
    }
  });
}
