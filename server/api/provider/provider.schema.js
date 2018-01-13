'use strict';

import mongoose from 'mongoose';


var ProviderSchema = new mongoose.Schema({
  name: { type: String, required: 'Campo nome é obrigatório' },
  active: { type: Boolean, required: 'Campo ativo é obrigatório' },
  shortName: { type: String, uppercase: true },
  address: String,
  CNPJ: String,
  email: String,
  website: String,
  phoneNumber: String,
  img: { data: Buffer, contentType: String }
}, { timestamps: true });


export default ProviderSchema;
