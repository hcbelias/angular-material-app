'use strict';

import mongoose from 'mongoose';
import ProductSchema from '../product/product.schema';
import KegVolumeSchema from './volume.schema';

let ProductQuantitySchema = new mongoose.Schema(
    {
        done: { type: Boolean, default: false, required: 'O campo Finalizado é obrigatório' },
        deliveryDate: Date,
        quantity: { type: Number, default: 0, required: 'O campo Quantidade é obrigatório' },
        unitCost: { type: Number, default: 0, required: 'O campo Custo Unitário é obrigatório' },
        product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: 'O campo Produto é obrigatório' },
        volume: [KegVolumeSchema],
    },
    {
        _id: true,
        toJSON: {
            virtuals: true
        }
    }
);

ProductQuantitySchema
.virtual('hasKegConfirmed')
.get(function () {
    return this.volume.some((item)=>item.delivered > 0);
});


ProductQuantitySchema
    .virtual('totalCost')
    .get(function () {
        return this.quantity * this.unitCost;
    });


ProductQuantitySchema
    .virtual('totalCostVolume')
    .get(function () {
        let quantity = this.totalLiterVolume;
        return quantity * this.unitCost;
    });

ProductQuantitySchema
    .virtual('totalLiterVolume')
    .get(function () {
        return this.volume.reduce((a, b) => {
            return a + (b.enabled ? b.quantity * b.volume : 0);
        }, 0);
    });
ProductQuantitySchema
    .virtual('totalQuantityVolume')
    .get(function () {
        return this.volume.reduce((a, b) => {
            return a + (b.enabled ? b.quantity : 0);
        }, 0);
    });
export default ProductQuantitySchema; 
