const mongoose = require('mongoose');

var LogSchema = new mongoose.Schema({
    email: { type: String },
    status: { type: String, enum: ['success', 'failure'], required: true },
    message: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('logs', LogSchema);