const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  fingerprint: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  browserInfo: String, 
  lastAccessed: Date,
});

module.exports = mongoose.model('Session', sessionSchema);
