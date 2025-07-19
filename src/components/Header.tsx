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
                  variant={currentPath === '/' ? 'default' : 'ghost'}
                  onClick={() => navigate('/')}
                >
                  Home
                </Button>
                <Button
                  variant={currentPath === '/login' ? 'default' : 'ghost'}
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  variant={currentPath === '/register' ? 'default' : 'outline'}
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant={currentPath === '/dashboard' ? 'default' : 'ghost'}
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  variant={currentPath === '/profile' ? 'default' : 'ghost'}
                  onClick={() => navigate('/profile')}
                >
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button variant="ghost" onClick={onLogout}>
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