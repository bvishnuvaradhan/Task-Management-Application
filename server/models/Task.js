const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  dueDate: {
    type: Date,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subtasks: [
    {
      text: { type: String, required: true, trim: true },
      completed: { type: Boolean, default: false },
    }
  ],
  tags: [
    {
      name: { type: String, required: true, trim: true },
      color: { type: String, default: '#6b7280' }, // Tailwind hex default (gray-500)
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
