import { useState } from 'react'; // Added useState
import { Outlet, Link, useLocation } from 'react-router';
import { Dumbbell, Menu, X } from 'lucide-react'; // Added Menu and X icons
import { ThemeToggle } from './theme-toggle';

const muscleGroups = [
  'Gluteus', 'Hamstring', 'Quad', 'Calf', 'Hip', 'Groin', 'Chest', 
  'Shoulder', 'Trapezoids', 'Latissimus', 'Bicep', 'Tricep', 'Core', 'Prilepins',
];

export function RootLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for toggle
  const location = useLocation();
  
  const getActivePath = () => {
    if (location.pathname === '/') return 'gluteus';
    return location.pathname.slice(1);
  };

  const activePath = getActivePath();

  // Helper to close menu when a link is clicked
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dumbbell className="size-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold dark:text-white">Weightlifting Tracker</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {/* Hamburger Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </div>
          
          {/* Collapsible Navigation */}
          {isMenuOpen && (
            <nav className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 max-h-[60vh] overflow-y-auto">
              {muscleGroups.map((group) => {
                const path = group.toLowerCase();
                const isActive = activePath === path;
                
                return (
                  <Link
                    key={group}
                    to={path === 'gluteus' ? '/' : `/${path}`}
                    onClick={closeMenu}
                    className={`px-4 py-2 rounded-md text-sm transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {group}
                  </Link>
                );
              })}
              
              {/* Utility Links */}
              {[
                { name: 'BMI Navy Calc', path: 'bmi-navy-calc' },
                { name: 'Stopwatch', path: 'stopwatch' },
                { name: 'Double Pyramid', path: 'double-pyramid' },
                { name: 'Exercise Dictionary', path: 'exercise-dictionary' }
              ].map((tool) => (
                <Link
                  key={tool.path}
                  to={`/${tool.path}`}
                  onClick={closeMenu}
                  className={`px-4 py-2 rounded-md text-sm transition-colors whitespace-nowrap ${
                    activePath === tool.path
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {tool.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}