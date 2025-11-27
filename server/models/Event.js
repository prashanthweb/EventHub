const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  category: String,
  date: { type: Date, required: true },
  capacity: { type: Number, default: 100 },
  price: { type: Number, default: 0 },
  imageUrl: String,
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attendeesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);
