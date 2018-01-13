'use strict';

import mongoose from 'mongoose';
import ProductQuantitySchema from './product-quantity.schema';

let InvoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: Number,
        description: String,
        payment: { type: Number, required: 'O campo Valor Pago é obrigatório', default: 0 },
        productList: [ProductQuantitySchema],
        provider: {
            type: mongoose.Schema.ObjectId, ref: 'Provider', required: 'Campo Fornecedor é obrigatório'
        },
        store: {
            type: mongoose.Schema.ObjectId, ref: 'Store', required: 'Campo Loja é obrigatório'
        }
    },
    {
        toJSON: {
            virtuals: true
        },
        timestamps: {
            "createdAt": 'createdAt',
            "updatedAt": 'updatedAt'
        }
    }
);

InvoiceSchema.pre('save', function (next) {
    if (this.isNew) {
        this.constructor.count({}, (err, data) => {
            if (err) {
                return next(err);
            }
            this.invoiceNumber = data + 1;
            return next();
        });
    }

});

InvoiceSchema.pre("findOneAndUpdate", function () {
    this._update.updatedAt = new Date();
});

function isProductDone(product) {
    return product.done;
}

InvoiceSchema
    .virtual('done')
    .get(function () {
        return this.productList.every(isProductDone);
    });

InvoiceSchema
    .virtual('totalQuantity')
    .get(function () {
        return this.productList.reduce((a, b) => a + b.quantity, 0);
    });
InvoiceSchema
    .virtual('totalCost')
    .get(function () {
        return this.productList.reduce((a, b) => a + b.totalCost, 0);
    });

export default InvoiceSchema; 
