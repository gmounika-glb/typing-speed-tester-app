const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  date: {type: String, required: true},
  time: {type: String, required: true},
  elapsedTime: {type: Number, required: true},
  speed: {type: Number, required: true},
  accuracy: {type: Number, required: true},
});

module.exports = mongoose.model('History', historySchema);

