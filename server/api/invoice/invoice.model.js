'use strict';

import mongoose from 'mongoose';
import InvoiceSchema from './invoice.schema';

export default mongoose.model('Invoice', InvoiceSchema);
