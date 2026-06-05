import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, apiPost, apiPut } from '../api';

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [tags, setTags] = useState([]);
  
  // Tag creation inputs
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6'); // Default blue

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Predefined colors for tags
  const tagColorPalette = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#6b7280', // gray
  ];

  useEffect(() => {
    if (!isNew) {
      const fetchTask = async () => {
        setLoading(true);
        try {
          const tasksList = await apiGet('tasks');
          const found = tasksList.find((t) => t._id === id);
          if (found) {
            setTitle(found.title);
            setDescription(found.description || '');
            setPriority(found.priority);
            setStatus(found.status);
            setSubtasks(found.subtasks || []);
            setTags(found.tags || []);
            if (found.dueDate) {
              setDueDate(new Date(found.dueDate).toISOString().split('T')[0]);
            }
          } else {
            setError('Task not found');
          }
        } catch (err) {
          setError('Failed to fetch task details');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
    }
  }, [id, isNew]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Filter out empty subtasks
    const cleanSubtasks = subtasks.filter((s) => s.text.trim() !== '');

    const payload = {
      title,
      description,
      priority,
      status,
      dueDate: dueDate || null,
      subtasks: cleanSubtasks,
      tags,
    };

    try {
      if (isNew) {
        await apiPost('tasks', payload);
      } else {
        await apiPut(`tasks/${id}`, payload);
      }
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save task. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Subtask Handlers
  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { text: '', completed: false }]);
  };

  const handleSubtaskChange = (index, field, value) => {
    const updated = [...subtasks];
    updated[index][field] = value;
    setSubtasks(updated);
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, idx) => idx !== index));
  };

  // Tag Handlers
  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    // Avoid duplicate names
    if (tags.some((t) => t.name.toLowerCase() === newTagName.trim().toLowerCase())) return;

    setTags([...tags, { name: newTagName.trim(), color: newTagColor }]);
    setNewTagName('');
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, idx) => idx !== index));
  };

  if (loading && !isNew) return <div className="text-center p-8">Loading task details...</div>;

  return (
    <div className="min-h-[85vh] py-8 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="w-full max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-750 space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center">
          {isNew ? 'Create New Task' : 'Edit Task'}
        </h2>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="Finish homework..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="Include references and format the papers..."
              />
            </div>
          </div>

          {/* Priority, Status & Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              />
            </div>
          </div>

          {/* Tags Section */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Task Tags / Categories
            </label>
            
            {/* Tag List Badges */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(idx)}
                      className="hover:opacity-75 focus:outline-none cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag Creation Input Block */}
            <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Add new tag (e.g. Work)"
                className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              />
              <div className="flex items-center gap-2">
                {/* Predefined Palette selection */}
                <div className="flex gap-1">
                  {tagColorPalette.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewTagColor(color)}
                      className={`w-6 h-6 rounded-full border cursor-pointer transition-transform ${
                        newTagColor === color ? 'scale-115 border-black dark:border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-650 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* Subtask / Checklist Section */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Checklist Subtasks
              </label>
              <button
                type="button"
                onClick={handleAddSubtask}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                + Add Item
              </button>
            </div>

            {subtasks.length > 0 ? (
              <div className="space-y-2">
                {subtasks.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-gray-55/20 dark:bg-gray-800/30 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700">
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={(e) => handleSubtaskChange(idx, 'completed', e.target.checked)}
                      className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary"
                    />
                    <input
                      type="text"
                      required
                      value={sub.text}
                      onChange={(e) => handleSubtaskChange(idx, 'text', e.target.value)}
                      placeholder="Subtask checklist item text..."
                      className="flex-1 bg-transparent text-gray-900 dark:text-white border-b border-transparent focus:border-primary focus:outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(idx)}
                      className="text-red-500 hover:opacity-75 font-semibold text-xs cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 dark:text-gray-500 italic">No subtask checklist items added yet.</p>
            )}
          </div>

          {/* Action Footer Buttons */}
          <div className="flex gap-4 border-t border-gray-100 dark:border-gray-700 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-grow py-3 px-4 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-opacity-90 disabled:opacity-55 transition-all cursor-pointer shadow-sm hover:shadow"
            >
              {loading ? 'Saving Task...' : isNew ? 'Create Task' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-850 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskDetail;
