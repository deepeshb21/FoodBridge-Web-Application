import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['donor', 'ngo', 'admin'],
    default: 'donor',
  },

  phone: {
    type: String,
  },

  dob: {
    type: Date,
  },

  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },

  image: {
    type: String, 
  },

  address: {
    type: String,
    required: function () {
      return this.role === 'ngo';
    },
  },

  licenseId: {
    type: String,
    required: function () {
      return this.role === 'ngo';
    },
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

export default User;
