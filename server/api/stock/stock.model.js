'use strict';

import mongoose from 'mongoose';
import StockSchema from './stock.schema';
  
export default mongoose.model('Stock', StockSchema);
