/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/stocks', require('./api/stock'));
  app.use('/api/invoices', require('./api/invoice'));
  app.use('/api/providers', require('./api/provider'));
  app.use('/api/items', require('./api/item'));
  app.use('/api/stores', require('./api/store'));
  app.use('/api/cashiers', require('./api/cashier'));
  app.use('/api/sales', require('./api/sale'));
  app.use('/api/clients', require('./api/client'));
  app.use('/api/products', require('./api/product'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/app.html`));
    });
}