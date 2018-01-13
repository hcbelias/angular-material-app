'use strict';
import mongoose from 'mongoose';
import ItemSchema from './item.schema';

export default mongoose.model('Item', ItemSchema);
