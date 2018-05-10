import mongoose from 'mongoose';
import * as genre from '../constants/genre';

export const Genre = mongoose.model('Genre', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: genre.nameMinLength
  }
}));
