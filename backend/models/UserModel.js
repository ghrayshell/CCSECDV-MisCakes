const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }, 

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["admin", "product_manager", "customer"],
    default: "customer"
  },

  invalidAttempts: {
    type: Number,
    default: 0
  },

  // Password history (most recent to oldest)
  passwordHistory: {
    type: [String],
    default: []
  },

  passwordDate: {
    type: Date,
    default: null
  },

  lastAttempt: {
    type: Date,
    default: null
  },

  resetQuestion: {
    type: String,
    default: ""
  },

  resetAnswer: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model('User', UserSchema);
