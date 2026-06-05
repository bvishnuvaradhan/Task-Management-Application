// src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-750 bg-white dark:bg-gray-800 transition-colors duration-200 shadow-sm">
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-primary hover:opacity-90">
          TaskManager
        </Link>
        <nav className="hidden sm:flex items-center space-x-4">
          {token ? (
            <>
              <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium">
                Dashboard
              </Link>
              <Link to="/tasks/new" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium">
                + Add Task
              </Link>
              <Link to="/profile" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium">
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium">
                Login
              </Link>
              <Link to="/register" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <DarkModeToggle />
        {token && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-lg transition-all"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;

