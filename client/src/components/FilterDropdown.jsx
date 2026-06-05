import React from 'react';

function FilterDropdown({ label, options, value, onChange }) {
  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
        {label}:
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 text-sm"
      >
        <option value="">All {label}s</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterDropdown;
