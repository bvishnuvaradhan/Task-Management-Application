import { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const classList = document.documentElement.classList;
    if (dark) {
      classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="relative p-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-gray-800 dark:text-gray-200"
      aria-label="Toggle dark mode"
    >
      <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
        {/* Sun Icon */}
        <svg
          className={`absolute w-5 h-5 transition-transform duration-500 ${
            dark ? 'translate-y-10 rotate-90 opacity-0' : 'translate-y-0 rotate-0 opacity-100'
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
          />
        </svg>

        {/* Moon Icon */}
        <svg
          className={`absolute w-5 h-5 transition-transform duration-500 ${
            dark ? 'translate-y-0 rotate-0 opacity-100' : '-translate-y-10 -rotate-90 opacity-0'
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>
    </button>
  );
};

export default DarkModeToggle;
