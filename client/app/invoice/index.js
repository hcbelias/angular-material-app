'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './invoice.routes';
import EditController from './invoice-edit.controller';
import ListController from './invoice-list.controller';
import ConfirmationController from './invoice-confirmation.controller';
export default angular.module('webApp.invoice', [uiRouter])
  .config(routing)
  .controller('EditInvoiceController', EditController)
  .controller('ListInvoiceController', ListController)
  .controller('ConfirmationInvoiceController', ConfirmationController)
  .filter('range', function () {
    return function (input, keg) {

      if(!keg.enabled || keg.done){
        return input;
      }

      let quantity = keg.quantity;
      let delivered = keg.delivered;
      let remaining = quantity - delivered;

      for (var i = 0; i < remaining; i++) {
        
        input.push(i);
      }

      return input;
    };
  })
  .name;
