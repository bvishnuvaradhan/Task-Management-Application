import { Link } from 'react-router-dom';

function TaskCard({ task, onDelete, onToggleComplete }) {
  const { _id, title, description, priority, status, dueDate, subtasks = [], tags = [] } = task;

  // Due date alert builder
  const getDueAlert = () => {
    if (!dueDate) return null;
    if (status === 'Completed') return null;

    const due = new Date(dueDate);
    const now = new Date();

    // Normalizing dates for daily comparisons
    const dueMidnight = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = dueMidnight - nowMidnight;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const abs = Math.abs(diffDays);
      return {
        text: `⚠️ Overdue by ${abs} day${abs > 1 ? 's' : ''}`,
        style: 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/50 font-bold animate-pulse',
      };
    } else if (diffDays === 0) {
      return {
        text: '⏰ Due Today',
        style: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 font-bold',
      };
    } else if (diffDays === 1) {
      return {
        text: '📅 Due Tomorrow',
        style: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 font-semibold',
      };
    } else {
      return {
        text: `📅 Due in ${diffDays} days`,
        style: 'bg-gray-50 text-gray-600 dark:bg-gray-800/60 dark:text-gray-400 border border-gray-200 dark:border-gray-700/50',
      };
    }
  };

  const alert = getDueAlert();

  // Subtask progress
  const totalSub = subtasks.length;
  const completedSub = subtasks.filter((s) => s.completed).length;
  const subtaskPct = totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : 0;

  // Priority color styling
  const getPriorityStyle = () => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400';
      case 'Low':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400';
    }
  };

  return (
    <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-750 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex-1 space-y-3">
        {/* Header (Title + Priority badge) */}
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={`text-lg font-bold ${status === 'Completed' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
            {title}
          </h3>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPriorityStyle()}`}>
            {priority}
          </span>
          {alert && (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${alert.style}`}>
              {alert.text}
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider text-white"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Subtask checklist progress */}
        {totalSub > 0 && (
          <div className="space-y-1 max-w-xs">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Subtasks</span>
              <span>{completedSub}/{totalSub} ({subtaskPct}%)</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${subtaskPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 self-stretch md:self-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 dark:border-gray-750">
        <button
          onClick={onToggleComplete}
          className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            status === 'Completed'
              ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {status === 'Completed' ? 'Mark Active' : 'Complete'}
        </button>
        <Link 
          to={`/tasks/${_id}`} 
          className="flex-1 md:flex-none px-4 py-2 text-xs font-bold text-center bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-650 text-gray-800 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors"
        >
          Edit
        </Link>
        <button
          onClick={onDelete}
          className="flex-1 md:flex-none px-4 py-2 text-xs font-bold bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/45 text-red-500 rounded-lg transition-colors cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
