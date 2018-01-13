'use strict';

import mongoose from 'mongoose';

var ClientSchema = new mongoose.Schema({
  name: { type: String, required: 'Campo Nome é obrigatório' },
  active: { type: Boolean, required: 'Campo Ativo é obrigatório', default: true },
  address: String,
  CPF: String,
  email: String,
  phoneNumber: String
},{
  timestamps: true
});

export default mongoose.model('Client', ClientSchema);
