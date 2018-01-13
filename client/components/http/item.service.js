'use strict';

export default function ItemResource($resource) {
  'ngInject';

  return $resource('/api/items', {}, {
    getItems: {
      method: 'GET',
      isArray: true
    }
  });
}

