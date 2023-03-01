import { Schema, model } from 'mongoose';

const schema = new Schema({
  name: {
    type: String
  }
});

export default model('Demo', schema);