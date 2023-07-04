import { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  role: { type: String, required: true, enum: ['super-admin', 'admin', 'manager', 'driver', 'worker', 'user'] },
  workingDays: {
    type: Array,
    required: true
    // enum: ['sa', 'su', 'mo', 'tu', 'we', 'th', 'fr'] // Saturday, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday
  },
  workingHours: { type: Number, enum: [1, 2], required: true },
  remainingTime: { type: Number },
  maxProjectLimit: { type: Number },
  skillsets: { type: Array },
  online: { type: Boolean, default: false },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'others'] },
  status: { type: String, enum: ['active', 'deactive'] },
  phone: { type: Number },
  notifySubs: [{ type: Object }],
}, { timestamps: true });

schema.plugin(paginate);
schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.password;
  delete obj.notifySubs;
  return JSON.parse(JSON.stringify(obj).replace(/_id/g, 'id'));
};

export default model('User', schema);