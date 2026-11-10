const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'New User' },
    phone: { type: String, default: '' }, // Made optional so it won't crash on old accounts
    email: { type: String, default: '' },
    password: { type: String, default: '' },
    role: { type: String, required: true, default: 'customer' },
    shippingAddress: {
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);