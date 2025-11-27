const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Create event (organizer)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'organizer') return res.status(403).json({ message: 'Only organizers can create events' });
    const data = req.body;
    data.organizer = req.user.id;
    const ev = await Event.create(data);
    res.json(ev);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// List / search / filter
router.get('/', async (req, res) => {
  try {
    const { search, category, dateFrom, dateTo } = req.query;
    const q = {};
    if (search) q.title = { $regex: search, $options: 'i' };
    if (category) q.category = category;
    if (dateFrom || dateTo) {
      q.date = {};
      if (dateFrom) q.date.$gte = new Date(dateFrom);
      if (dateTo) q.date.$lte = new Date(dateTo);
    }
    const events = await Event.find(q).sort({ date: 1 });
    res.json(events);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get single
router.get('/:id', async (req, res) => {
  try { const ev = await Event.findById(req.params.id); res.json(ev); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

// Update
router.put('/:id', auth, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    if (ev.organizer.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    Object.assign(ev, req.body);
    await ev.save();
    res.json(ev);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    if (ev.organizer.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await ev.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
