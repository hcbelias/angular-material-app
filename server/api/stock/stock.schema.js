"use strict";

import mongoose, { Error } from "mongoose";

var StockSchema = new mongoose.Schema(
  {
    active: { type: Boolean, default: true },
    quantity: { type: Number },
    volume: { type: Number },
    remaining: { type: Number, default: 0 },
    unitCost: { type: Number, required: true },
    unitPrice: { type: Number },
    pintPrice: { type: Number },
    literPrice: { type: Number },
    qtdSold: { type: Number, default: 0 },
    pintSold: { type: Number, default: 0 },
    literSold: { type: Number, default: 0 },
    name: { type: String, required: "O campo Nome é obrigatório" },
    product: { type: mongoose.Schema.ObjectId, ref: "Product" },
    provider: { type: mongoose.Schema.ObjectId, ref: "Provider" },
    store: { type: mongoose.Schema.ObjectId, ref: "Store" },
    invoice: { type: mongoose.Schema.ObjectId, ref: "Invoice" },
    item: { type: mongoose.Schema.ObjectId, ref: "Item" },
    invoiceNumber: { type: Number, required: true },
    referenceProduct: {
      type: mongoose.Schema.ObjectId,
      ref: "Product-Quantity"
    },
    isKeg: { type: Boolean, default: false, required: true },
    finalized: { type: Boolean, default: false, required: true },
    finalizeDate: Date,
    kegId: Number,
    kegOrder: Number,
    openDate: Date
  },
  {
    toJSON: {
      virtuals: true
    },
    timestamps: true
  }
);

function getKegSaleWithDoublePintDiscount(keg) {
  let totalVolume = keg.literSold + (keg.pintSold/2);
  let volumeLiterPrice = Math.floor(totalVolume);
  let remaining = totalVolume - volumeLiterPrice;
  let volumePintPrice = remaining > 0 ? 1 : 0; // Until we have diff sizes for chopps
  return (
    volumeLiterPrice * keg.literPrice +
    volumePintPrice * keg.pintPrice
  );
}

StockSchema.virtual("totalCost").get(function() {
  const quantity = this.isKeg ? this.volume : this.quantity;
  return quantity * this.unitCost;
});

StockSchema.virtual("totalSale").get(function() {
  return this.isKeg ?  getKegSaleWithDoublePintDiscount(this) : this.qtdSold * this.unitPrice;
});


StockSchema.virtual("profit").get(function() {
  return this.totalSale - this.totalCost;
});

StockSchema.virtual("profitPercentage").get(function() {
  return this.profit/this.totalSale * 100;
});



StockSchema.pre("save", function(next) {
  if (this.isKeg && this.isNew) {
    this.constructor.find({ isKeg: true, store: this.store }, (err, data) => {
      if (err) {
        return next(err);
      }
      this.kegId = data.length === 0 ? 1 : (Math.max(...data.map(p=>p.kegId)) + 1);
      return next();
    });
  } else {
    return next();
  }
});

export default StockSchema;
