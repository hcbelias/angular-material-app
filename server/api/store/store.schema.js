'use strict';

import mongoose from 'mongoose';

var StoreSchema = new mongoose.Schema({
  name: String,
  address: String,
  phoneNumber: String,
  active:  { type: Boolean, default: true },
  order: Number
});

export default StoreSchema; 
