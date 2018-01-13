'use strict';

var express = require('express');
var controller = require('./cashier.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/:id/report/payment', auth.isAuthenticated(),controller.getPaymentDataReport);
router.get('/:id/report/cashier', auth.isAuthenticated(),controller.getCashierDataReport);
router.get('/:id/report/sales', auth.isAuthenticated(),controller.getSalesDataReport);
router.get('/', auth.isAuthenticated(),controller.index);
router.get('/:id', auth.isAuthenticated(),controller.show);
router.post('/', auth.isAuthenticated(),controller.create);
router.put('/:id', auth.isAuthenticated(),controller.upsert);
router.patch('/:id', auth.isAuthenticated(),controller.patch);
router.delete('/:id', auth.isAuthenticated(),controller.destroy);
router.post('/:id/sales', auth.isAuthenticated(), controller.addSales);

module.exports = router;
