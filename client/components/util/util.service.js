'use strict';

import angular from 'angular';

/**
 * The Util service is for thin, globally reusable, utility functions
 */
export function UtilService($window) {
  'ngInject';

  var Util = {
    /**
     * Return a callback or noop function
     *
     * @param  {Function|*} cb - a 'potential' function
     * @return {Function}
     */
    safeCb(cb) {
      return angular.isFunction(cb) ? cb : angular.noop;
    },

    /**
     * Parse a given url with the use of an anchor element
     *
     * @param  {String} url - the url to parse
     * @return {Object}     - the parsed url, anchor element
     */
    urlParse(url) {
      var a = document.createElement('a');
      a.href = url;

      // Special treatment for IE, see http://stackoverflow.com/a/13405933 for details
      if(a.host === '') {
        a.href = a.href;
      }

      return a;
    },

    /**
     * Test whether or not a given url is same origin
     *
     * @param  {String}           url       - url to test
     * @param  {String|String[]}  [origins] - additional origins to test against
     * @return {Boolean}                    - true if url is same origin
     */
    isSameOrigin(url, origins) {
      url = Util.urlParse(url);
      origins = origins && [].concat(origins) || [];
      origins = origins.map(Util.urlParse);
      origins.push($window.location);
      origins = origins.filter(function(o) {
        let hostnameCheck = url.hostname === o.hostname;
        let protocolCheck = url.protocol === o.protocol;
        // 2nd part of the special treatment for IE fix (see above):
        // This part is when using well-known ports 80 or 443 with IE,
        // when $window.location.port==='' instead of the real port number.
        // Probably the same cause as this IE bug: https://goo.gl/J9hRta
        let portCheck = url.port === o.port || o.port === '' && (url.port === '80' || url.port
          === '443');
        return hostnameCheck && protocolCheck && portCheck;
      });
      return origins.length >= 1;
    },
    removeAccents(value) {
      return value
        .replace(/á/g, 'a')
        .replace(/ã/g, 'a')
        .replace(/à/g, 'a')
        .replace(/â/g, 'a')
        .replace(/ä/g, 'a')
        .replace(/é/g, 'e')
        .replace(/ê/g, 'e')
        .replace(/è/g, 'e')
        .replace(/ë/g, 'e')
        .replace(/í/g, 'i')
        .replace(/î/g, 'i')
        .replace(/ì/g, 'i')
        .replace(/ï/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/õ/g, 'o')
        .replace(/ô/g, 'o')
        .replace(/ò/g, 'o')
        .replace(/ö/g, 'o')
        .replace(/ú/g, 'u')
        .replace(/ù/g, 'u')
        .replace(/û/g, 'u')
        .replace(/ü/g, 'u')
        ;
    }
  };

  return Util;
}
