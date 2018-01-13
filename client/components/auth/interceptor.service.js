'use strict';

export function authInterceptor($rootScope, $q, $cookies, $injector, Util, $location) {
  'ngInject';

  var state;
  return {
    // Add authorization token to headers
    request(config) {
      config.headers = config.headers || {};
      if ($cookies.get('token') && Util.isSameOrigin(config.url)) {
        config.headers.Authorization = `Bearer ${$cookies.get('token')}`;
      }
      return config;
    },

    // Intercept 401s and redirect you to login
    responseError(response) {
      if (response.status === 401 && response.config.url !== "/auth/local") {
        window.location = '/login';
      }
      return $q.reject(response);
    }
  };
}
