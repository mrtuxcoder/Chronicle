const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'editor', 'user'],
      default: 'admin',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Credential', credentialSchema);
