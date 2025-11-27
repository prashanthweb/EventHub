const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Book an event
router.post('/', auth, async (req, res) => {
  try {
    const { eventId, seats } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.attendeesCount + (seats||1) > event.capacity) return res.status(400).json({ message: 'Not enough seats' });
    // prevent double booking by same user
    const existing = await Booking.findOne({ user: req.user.id, event: event._id });
    if (existing) return res.status(400).json({ message: 'Already booked' });
    const booking = await Booking.create({
      user: req.user.id,
      event: event._id,
      seats: seats || 1,
      amountPaid: (event.price || 0) * (seats || 1)
    });
    event.attendeesCount += (seats || 1);
    await event.save();
    const user = await User.findById(req.user.id);
    user.bookings.push(booking._id);
    await user.save();
    res.json({ booking, message: 'Booking confirmed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get bookings for user
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('event');
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
