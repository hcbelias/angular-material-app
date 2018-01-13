'use strict';

import mongoose from 'mongoose';
import SaleSchema from './sale.schema';

export default mongoose.model('Sale', SaleSchema);
