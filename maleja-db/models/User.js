const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street:     { type: String, required: true },
  city:       { type: String, required: true },
  department: { type: String, required: true },
  zipCode:    { type: String },
  isDefault:  { type: Boolean, default: false }
}, { _id: false });

const userSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name:         { type: String, required: true, trim: true },
  phone:        { type: String },
  role:         { type: String, enum: ['customer', 'admin'], default: 'customer' },
  isVerified:   { type: Boolean, default: false },
  addresses:    [addressSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
