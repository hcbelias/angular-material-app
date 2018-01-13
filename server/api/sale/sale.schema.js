"use strict";

import mongoose from "mongoose";
import StockSchema from "../stock/stock.schema";

var SaleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    userEmail: String,
    userName: String,
    stockList: [StockSchema],
    total: { type: Number, required: true, default : 0},
    paymentCard:  { type: Number, required: true, default : 0},
    paymentMoney: { type: Number, required: true, default : 0}
  },
  {
    toJSON: {
      virtuals: true
    },
    timestamps: true
  }
);

SaleSchema.pre('validate', function (next) {
  let paymentTotal = this.paymentCard + this.paymentMoney;
  let diff = Math.abs(this.paymentTotal - this.total);
  if(diff > 0.001){
    return next(new Error('O valor total do pagamento não confere com os métodos de pagamento'));
  }
  next();
});

export default SaleSchema;
