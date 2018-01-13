'use strict';

import * as auth from '../../auth/auth.service';
var express = require('express');
var controller = require('./store.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id',auth.hasRole('admin'), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.get('/:id/stocks', auth.isAuthenticated(), controller.getStockByStore);
router.get('/:id/products', auth.isAuthenticated(), controller.getProducts);
router.get('/:id/kegs', auth.isAuthenticated(), controller.getActiveKegs);
router.get('/:id/keg-view', controller.getKegList);
router.get('/:id/cashier', auth.isAuthenticated(), controller.getLatestCashier);
router.post('/:id/keg/:kegid', auth.isAuthenticated(), controller.setActiveKeg);
router.post('/:id/cashier', auth.isAuthenticated(), controller.openCashier);
router.put('/:id/cashier', auth.isAuthenticated(), controller.closeCashier);
router.put('/:id', auth.hasRole('admin'), controller.upsert);
router.patch('/:id', auth.hasRole('admin'), controller.patch);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
