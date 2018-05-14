import mongoose from 'mongoose';
import * as customer from '../constants/customer';

export const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: customer.nameMinLength,
    maxlength: customer.nameMaxLength,
  },
  isGold: {
    type: Boolean,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    minlength: customer.phoneMinLength,
    maxlength: customer.phoneMaxLength,
  },
});

export const Customer = mongoose.model('Customer', customerSchema);
