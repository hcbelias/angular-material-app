'use strict';

import mongoose from 'mongoose';
import SalesSchema from '../sale/sale.schema';

var CashierSchema = new mongoose.Schema({
  closeDate: Date,
  store: { type: mongoose.Schema.ObjectId, ref: 'Store' },
  userClosed: { type: mongoose.Schema.ObjectId, ref: 'User' },
  userEmailClosed: { type: String },
  userNameClosed: { type: String },
  userOpened: { type: mongoose.Schema.ObjectId, ref: 'User' },
  userEmailOpened: { type: String },
  userNameOpened: { type: String },
  sales: [SalesSchema],
  moneyBalance: { type: Number, default: 0 },
  justifyCard: { type: String, default: '' },
  balanceCard: { type: Number, default: 0  },  
  balanceMoney: { type: Number, default: 0 },
  justifyMoney: { type: String, default: '' },
  cashierNumber: { type: Number, default: '' }
}, 
{ 
  timestamps: true
});

CashierSchema.pre('save', function (next) {

  if (this.isNew) {
      this.constructor.count({}, (err, data) => {
          if (err) {
              return next(err);
          }
          this.cashierNumber = data + 1;
          return next();
      });
  }else{
    return next();
  }

});

export default CashierSchema; 
