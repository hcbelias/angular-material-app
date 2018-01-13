'use strict';

export default function ClientResource($resource) {
  'ngInject';

  return $resource('/api/clients/:id', {
    id: '@_id'
  }, {
    editClient: {
      method: 'PUT'
    },
    createClient:{
        method: 'POST'
    },
    getClients: {
      method: 'GET',
      params: {
        id: ''
      },
      isArray: true
    },
    getClient: {
      method: 'GET',
      params: {
        id: 'id'
      }
    }
  });
}
