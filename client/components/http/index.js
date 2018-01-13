'use strict';
import ClientResource from './client.service';
import ProviderResource from './provider.service';
import ProductResource from './product.service';
import ItemResource from './item.service';
import InvoiceResource from './invoice.service';
import UserResource from './user.service';
import StoreResource from './store.service';
import StockResource from './stock.service';
import CashierResource from './cashier.service';

export default angular.module('webApp.http', [])
    .factory('Client', ClientResource)
    .factory('Provider', ProviderResource)
    .factory('Product', ProductResource)
    .factory('Item', ItemResource)
    .factory('Invoice', InvoiceResource)
    .factory('User', UserResource)
    .factory('Store', StoreResource)
    .factory('Stock', StockResource)
    .factory('Cashier', CashierResource)
    .name;
