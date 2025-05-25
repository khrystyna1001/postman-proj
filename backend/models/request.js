const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  url: String,
  method: String,
  headers: Object,
  body: mongoose.Schema.Types.Mixed,
  response: mongoose.Schema.Types.Mixed,
  status: Number,
  timestamp: { type: Date, default: Date.now }
});

const RequestHistory = mongoose.model('RequestHistory', requestSchema);

module.exports = RequestHistory;