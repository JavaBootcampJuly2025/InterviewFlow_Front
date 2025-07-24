import { Button } from '../ui/button';
import { BriefcaseIcon, UserIcon, SettingsIcon, MenuIcon, XIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useState, useEffect } from 'react';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function Header({ isAuthenticated, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentPath = location.pathname;

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('[data-mobile-menu]')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  const navBtnBase =
    "relative before:content-[''] before:absolute before:left-0 before:-bottom-1 before:h-0.5 before:bg-primary before:transition-all before:duration-300";
  const navBtnHover = "hover:before:w-full";
  const navBtnActive = "before:w-full";

  const navBtnClass = (path: string, extraActivePaths: string[] = []) =>
    [
      navBtnBase,
      (currentPath === path || extraActivePaths.includes(currentPath)) ? navBtnActive : "before:w-0",
      navBtnHover,
    ].join(" ");

  const mobileNavBtnClass = "w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-8100 transition-colors rounded-md";

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    closeMobileMenu();
  };

  const handleLogout = () => {
    onLogout();
    closeMobileMenu();
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
            <Logo className="h-8 w-8" onClick={() => handleNavigation('/')} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {!isAuthenticated ? (
              <>
                <Button
                  className={navBtnClass('/')}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                >
                  Home
                </Button>
                <Button
                  className={navBtnClass('/login')}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  className={navBtnClass('/register')}
                  variant="default"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Button
                  className={navBtnClass('/dashboard', ['/'])}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                >
                  <BriefcaseIcon className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  className={navBtnClass('/profile')}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/profile')}
                >
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button
                  className={navBtnBase + " " + navBtnHover + " before:w-0"}
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-white-100 transition-colors flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
            data-mobile-menu
          >
            {isMobileMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden absolute top-full left-0 right-0 mt-0 py-4 border-t bg-white/95 backdrop-blur-sm rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-200 mx-4"
            data-mobile-menu
          >
            {!isAuthenticated ? (
              <div className="flex flex-col space-y-1 px-2">
                <button
                  className={`${mobileNavBtnClass} ${currentPath === '/' ? 'bg-gray-100 font-medium' : ''}`}
                  onClick={() => handleNavigation('/')}
                >
                  Home
                </button>
                <button
                  className={`${mobileNavBtnClass} ${currentPath === '/login' ? 'bg-gray-100 font-medium' : ''}`}
                  onClick={() => handleNavigation('/login')}
                >
                  Login
                </button>
                <button
                  className={`${mobileNavBtnClass} ${currentPath === '/register' ? 'bg-gray-100 font-medium' : ''}`}
                  onClick={() => handleNavigation('/register')}
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-1 px-2">
                <button
                  className={`${mobileNavBtnClass} ${currentPath === '/dashboard' || currentPath === '/' ? 'bg-gray-100 font-medium' : ''}`}
                  onClick={() => handleNavigation('/dashboard')}
                >
                  <BriefcaseIcon className="h-4 w-4 mr-2 inline" />
                  Dashboard
                </button>
                <button
                  className={`${mobileNavBtnClass} ${currentPath === '/profile' ? 'bg-gray-100 font-medium' : ''}`}
                  onClick={() => handleNavigation('/profile')}
                >
                  <SettingsIcon className="h-4 w-4 mr-2 inline" />
                  Profile
                </button>
                <button
                  className={mobileNavBtnClass}
                  onClick={handleLogout}
                >
                  <UserIcon className="h-4 w-4 mr-2 inline" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}