'use strict';

import mongoose from 'mongoose';

var ItemSchema = new mongoose.Schema({
  name: String
},{
  toJSON: {
      virtuals: true
  }
});


ItemSchema
.virtual('isKeg')
.get(function() {
  return this.name.toLowerCase() === 'chopp';
});


export default ItemSchema; 
