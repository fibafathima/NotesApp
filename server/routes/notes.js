const express = require('express');
const Note = require('../models/Note');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Auth middleware
function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

// Get all notes for user
router.get('/', auth, async (req, res) => {
  const notes = await Note.find({ user: req.user }).sort({ pinned: -1, updatedAt: -1 });
  res.json(notes);
});

// Create note
router.post('/', auth, async (req, res) => {
  const { title, content, tags, pinned } = req.body;
  const note = new Note({ user: req.user, title, content, tags, pinned });
  await note.save();
  res.status(201).json(note);
});

// Update note
router.put('/:id', auth, async (req, res) => {
  const { title, content, tags, pinned } = req.body;
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    { title, content, tags, pinned },
    { new: true }
  );
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json({ message: 'Note deleted' });
});

module.exports = router; 