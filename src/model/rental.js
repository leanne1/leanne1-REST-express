import mongoose from 'mongoose';
import * as customer from '../constants/customer';
import * as common from '../constants/common';

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: customer.nameMinLength,
        maxlength: customer.nameMaxLength,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
        required: true,
        minlength: customer.phoneMinLength,
        maxlength: customer.phoneMaxLength,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: common.stringMaxLength
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: common.numMin,
        max: common.numMax
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: common.numMin,
  }
});

export const Rental = mongoose.model('Rental', rentalSchema);
