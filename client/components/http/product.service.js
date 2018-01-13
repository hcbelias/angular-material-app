'use strict';

export default function ProductResource($resource) {
  'ngInject';

  return $resource('/api/products/:id/:controller', {
    id: '@_id'
  }, {
      editProduct: {
        method: 'PUT'
      },
      createProduct: {
        method: 'POST'
      },
      getProducts: {
        method: 'GET',
        params: {
          id: ''
        },
        isArray: true
      },
      getProduct: {
        method: 'GET',
        params: {
          id: 'id'
        }
      },
      getLatestUnitCost:{
        method: 'GET',
        params:{
          id: 'id',
          controller: 'cost'
        }
      },
      getLatestPrice:{
        method: 'GET',
        params:{
          id: 'id',
          controller: 'price'
        }
      }
    });
}

