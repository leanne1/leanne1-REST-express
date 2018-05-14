import mongoose from 'mongoose';
import * as genre from '../constants/genre';
import * as common from '../constants/common';

export const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: genre.nameMinLength,
    maxlength: common.stringMaxLength,
  }
});

export const Genre = mongoose.model('Genre', genreSchema);
