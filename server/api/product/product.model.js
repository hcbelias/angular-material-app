'use strict';

import mongoose from 'mongoose';

import ProductSchema from './product.schema';

export default mongoose.model('Product', ProductSchema);