'use strict';

export default function UserResource($resource) {
  'ngInject';

  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    editUser: {
      method: 'PUT'
    },
    createUser:{
        method: 'POST'
    },
    getUsers: {
      method: 'GET',
      params: {
        id: ''
      },
      isArray: true
    },
    getUser: {
      method: 'GET',
      params: {
        id: 'id'
      }
    },
    getMe:{
      method: 'GET',
      params:{
        id: 'me'
      }
    },
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
  });
}

