import mongoose from 'mongoose';
import { genreSchema } from '../model/genre';
import * as common from '../constants/common';

export const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: common.stringMaxLength
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: common.numMin,
    max: common.numMax
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: common.numMin,
    max: common.numMax
  },
});

export const Movie = mongoose.model('Movie', movieSchema);
