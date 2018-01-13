'use strict';

import mongoose from 'mongoose';

let KegVolumeSchema = new mongoose.Schema({
    volume: { type: Number, default: 0, required: true },
    quantity: { type: Number, default: 0, required: true },
    enabled: { type: Boolean, default: false, required: true },
    custom: { type: Boolean, default: false, required: true },
    delivered: { type: Number, default: 0, required: true },
    unitCost: { type: Number, default: 0, required: 'O campo Custo Por Litro é obrigatório' }
}, {
        toJSON: {
            virtuals: true
        }
    });

KegVolumeSchema
    .virtual('done')
    .get(function () {
        return this.quantity > 0 && this.delivered >= this.quantity;
    });


KegVolumeSchema
    .virtual('totalCost')
    .get(function () {
        return this.quantity * this.unitCost;
    });

export default KegVolumeSchema; 
