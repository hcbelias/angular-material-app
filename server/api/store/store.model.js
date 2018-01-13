'use strict';

import mongoose from 'mongoose';
import StoreSchema from './store.schema';

export default mongoose.model('Store', StoreSchema);
