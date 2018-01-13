'use strict';

import mongoose from 'mongoose';
import CashierSchema from './cashier.schema';

export default mongoose.model('Cashier', CashierSchema);
