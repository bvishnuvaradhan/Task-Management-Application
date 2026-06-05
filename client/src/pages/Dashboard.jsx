import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { apiGet, apiDelete, apiPut, getUserIdFromToken } from '../api';
import TaskCard from '../components/TaskCard';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch tasks with filters
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      const data = await apiGet('tasks', params);
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, statusFilter, priorityFilter]);

  // Set up Socket.io connection for real-time updates
  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    const socketUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : 'http://localhost:5000';

    const socket = io(socketUrl);

    socket.on('connect', () => {
      socket.emit('join', userId);
    });

    socket.on('task_changed', (change) => {
      // Real-time synchronization
      if (change.type === 'CREATE') {
        setTasks((prev) => {
          // Avoid duplicates
          if (prev.some((t) => t._id === change.task._id)) return prev;
          return [...prev, change.task].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        });
      } else if (change.type === 'UPDATE') {
        setTasks((prev) => prev.map((t) => (t._id === change.task._id ? change.task : t)));
      } else if (change.type === 'DELETE') {
        setTasks((prev) => prev.filter((t) => t._id !== change.taskId));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await apiDelete(`tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const handleToggleComplete = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const updated = await apiPut(`tasks/${task._id}`, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === task._id ? updated : t)));
    } catch (err) {
      console.error('Update error', err);
    }
  };

  // Compute analytics
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const overdue = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed').length;

  const highPriority = tasks.filter((t) => t.priority === 'High').length;
  const mediumPriority = tasks.filter((t) => t.priority === 'Medium').length;
  const lowPriority = tasks.filter((t) => t.priority === 'Low').length;

  // Percentage calculations
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // SVG Progress Ring calculations
  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Workspace Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time collaboration & overview of your workspace tasks
          </p>
        </div>
      </div>

      {/* Analytics Panels (SVG Progress + Metrics) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metric Cards Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Tasks</span>
            <div className="flex items-baseline space-x-2 mt-4">
              <span className="text-4xl font-extrabold text-primary">{total}</span>
              <span className="text-sm text-gray-400">active</span>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Completed</span>
            <div className="flex items-baseline space-x-2 mt-4">
              <span className="text-4xl font-extrabold text-green-500">{completed}</span>
              <span className="text-sm text-gray-400">done</span>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Pending</span>
            <div className="flex items-baseline space-x-2 mt-4">
              <span className="text-4xl font-extrabold text-amber-500">{pending}</span>
              <span className="text-sm text-gray-400">in-progress</span>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Overdue</span>
            <div className="flex items-baseline space-x-2 mt-4">
              <span className={`text-4xl font-extrabold ${overdue > 0 ? 'text-red-500' : 'text-gray-300 dark:text-gray-600'}`}>{overdue}</span>
              <span className="text-sm text-gray-400">expired</span>
            </div>
          </div>
        </div>

        {/* SVG Progress Card */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Task Progress</h3>
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Circle Progress */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-gray-100 dark:stroke-gray-700 fill-none"
                strokeWidth={strokeWidth}
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-primary fill-none transition-all duration-500"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-black text-gray-800 dark:text-white">{completionRate}%</span>
              <span className="block text-[10px] text-gray-400 uppercase tracking-wider">Done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Bar Chart Card */}
      {total > 0 && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Priority Breakdown</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-red-500">High Priority</span>
                <span className="text-gray-400">{highPriority} tasks</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(highPriority / total) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-amber-500">Medium Priority</span>
                <span className="text-gray-400">{mediumPriority} tasks</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(mediumPriority / total) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-blue-500">Low Priority</span>
                <span className="text-gray-400">{lowPriority} tasks</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(lowPriority / total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search, Filter & Controls Panel */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tasks by title..." />
        <div className="flex flex-wrap gap-3">
          <FilterDropdown
            label="Status"
            options={['Pending', 'In Progress', 'Completed']}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <FilterDropdown
            label="Priority"
            options={['Low', 'Medium', 'High']}
            value={priorityFilter}
            onChange={setPriorityFilter}
          />
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="text-center p-8 text-gray-500">Loading tasks...</div>
      ) : (
        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDelete={() => handleDelete(task._id)}
                onToggleComplete={() => handleToggleComplete(task)}
              />
            ))
          ) : (
            <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-400 dark:text-gray-500">No tasks found. Create a new task to get started!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
