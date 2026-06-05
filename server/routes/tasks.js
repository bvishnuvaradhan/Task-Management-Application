// routes/tasks.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// @route   GET /api/tasks
// @desc    Get all tasks for logged‑in user, with optional search/filters
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;
  const { search, status, priority, overdue } = req.query;
  const filter = { userId };
  if (search) filter.title = { $regex: search, $options: 'i' };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (overdue === 'true') {
    filter.dueDate = { $lt: new Date() };
    filter.status = { $ne: 'Completed' };
  }
  try {
    const tasks = await Task.find(filter).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
router.post(
  '/',
  auth,
  [
    body('title', 'Title is required').notEmpty(),
    body('priority').optional().isIn(['Low', 'Medium', 'High']),
    body('status').optional().isIn(['Pending', 'In Progress', 'Completed']),
    body('dueDate').optional().isISO8601(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { title, description, priority, status, dueDate, subtasks, tags } = req.body;
    try {
      const task = new Task({
        title,
        description,
        priority,
        status,
        dueDate,
        subtasks,
        tags,
        userId: req.user.id,
      });
      await task.save();
      
      const io = req.app.get('io');
      if (io) {
        io.to(req.user.id).emit('task_changed', { type: 'CREATE', task });
      }
      
      res.json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT /api/tasks/:id
// @desc    Update a task
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const task = await Task.findOne({ _id: id, userId: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    Object.assign(task, updates);
    await task.save();
    
    const io = req.app.get('io');
    if (io) {
      io.to(req.user.id).emit('task_changed', { type: 'UPDATE', task });
    }
    
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    
    const io = req.app.get('io');
    if (io) {
      io.to(req.user.id).emit('task_changed', { type: 'DELETE', taskId: id });
    }
    
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
