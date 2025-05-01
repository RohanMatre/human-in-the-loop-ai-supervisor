import { Outlet, NavLink } from 'react-router-dom';
import { useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import { useThemeStore } from '../store/themeStore';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark-mode' : 'light-mode'} bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      <header className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700/20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <div className="flex items-center">
                  <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h1 className="ml-2 text-xl font-bold text-blue-600 dark:text-blue-400">AI Supervisor</h1>
                </div>
              </div>
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `${isActive ? 'border-blue-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150`
                  }
                  end
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/supervisor" 
                  className={({ isActive }) => 
                    `${isActive ? 'border-blue-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150`
                  }
                >
                  Supervisor Panel
                </NavLink>
                <NavLink 
                  to="/knowledge" 
                  className={({ isActive }) => 
                    `${isActive ? 'border-blue-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150`
                  }
                >
                  Knowledge Base
                </NavLink>
              </nav>
            </div>
            
            <div className="flex items-center">
              {/* Theme Switcher */}
              <ThemeSwitcher />
              
              {/* Mobile menu button */}
              <div className="md:hidden flex items-center ml-2">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `${isActive ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150`
                }
                end
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/supervisor" 
                className={({ isActive }) => 
                  `${isActive ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Supervisor Panel
              </NavLink>
              <NavLink 
                to="/knowledge" 
                className={({ isActive }) => 
                  `${isActive ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-150`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Knowledge Base
              </NavLink>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Human-in-the-Loop AI Supervisor &copy; {new Date().getFullYear()}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://github.com/RohanMatre/human-in-the-loop-ai-supervisor" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 