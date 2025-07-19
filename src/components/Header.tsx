import { Button } from './ui/button';
import { BriefcaseIcon, UserIcon, SettingsIcon } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function Header({ currentPage, onNavigate, isAuthenticated, onLogout }: HeaderProps) {
  return (
    <header className="border-b bg-white/80 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BriefcaseIcon className="h-8 w-8 text-primary" />
            <h1 
              className="cursor-pointer hover:text-primary transition-colors"
              onClick={() => onNavigate('home')}
            >
              JobTracker
            </h1>
          </div>
          
          <nav className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button
                  variant={currentPage === 'home' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('home')}
                >
                  Home
                </Button>
                <Button
                  variant={currentPage === 'login' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('login')}
                >
                  Login
                </Button>
                <Button
                  variant={currentPage === 'register' ? 'default' : 'outline'}
                  onClick={() => onNavigate('register')}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  variant={currentPage === 'profile' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('profile')}
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