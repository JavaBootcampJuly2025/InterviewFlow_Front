import { Button } from './ui/button';
import { BriefcaseIcon, UserIcon, SettingsIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function Header({ isAuthenticated, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

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

  return (
    <header className="border-b bg-white/80 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BriefcaseIcon className="h-8 w-8 text-primary" />
            <h1
              className="cursor-pointer hover:text-primary transition-colors"
              onClick={() => navigate('/')}
            >
              Interview Flow
            </h1>
          </div>

          <nav className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button
                  className={navBtnClass('/')}
                  variant="ghost"
                  onClick={() => navigate('/')}
                >
                  Home
                </Button>
                <Button
                  className={navBtnClass('/login')}
                  variant="ghost"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  className={navBtnClass('/register')}
                  variant="ghost"
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
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  className={navBtnClass('/profile')}
                  variant="ghost"
                  onClick={() => navigate('/profile')}
                >
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button
                  className={navBtnBase + " " + navBtnHover + " before:w-0"}
                  variant="ghost"
                  onClick={onLogout}
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}