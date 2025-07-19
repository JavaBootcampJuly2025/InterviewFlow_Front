import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

interface RegistrationPageProps {
  onNavigate: (page: string) => void;
  onLogin: (userData: any) => void;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface UserResponse {
  id: number;
  email: string;
  userName: string;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: UserResponse;
}

const API_BASE_URL = 'http://localhost:8080/api';

export function RegistrationPage({ onNavigate, onLogin }: RegistrationPageProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const registerUser = async (registerData: RegisterRequest): Promise<UserResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errorResponse = await response.json().catch(() => null);
        if (errorResponse?.message) {
          // Handle validation errors
          if (errorResponse.data && typeof errorResponse.data === 'object') {
            const validationErrors = Object.values(errorResponse.data).join(', ');
            throw new Error(validationErrors);
          }
          throw new Error(errorResponse.message);
        }
        throw new Error('Invalid registration data. Please check your inputs.');
      }
      if (response.status === 409) {
        throw new Error('Email already exists. Please use a different email address.');
      }
      throw new Error('Registration failed. Please try again.');
    }

    const apiResponse: ApiResponse = await response.json();
    
    // Check if the API response indicates success
    if (!apiResponse.success) {
      throw new Error(apiResponse.message || 'Registration failed');
    }

    // Return the actual user data from the API response
    return apiResponse.data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validation checks
      if (!username.trim() || !email || !password) {
        setError('Please fill in all fields');
        return;
      }

      if (username.trim().length < 2 || username.trim().length > 50) {
        setError('Full name must be between 2 and 50 characters');
        return;
      }

      if (!email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      const registerData: RegisterRequest = {
        username: username.trim(),
        email: email.trim(),
        password: password
      };

      const userData = await registerUser(registerData);
      
      // Store user email for future reference (if needed)
      localStorage.setItem('userEmail', email);
      
      // Transform API response to match expected format
      const transformedUserData = {
        id: userData.id.toString(),
        email: userData.email,
        name: userData.userName,
        userName: userData.userName,
      };
      
      // Automatically log in the user after successful registration
      onLogin(transformedUserData);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>
            Join Interview Flow and start organizing your job search today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Full Name</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your full name (2-50 characters)"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min 6 characters)"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                disabled={isLoading}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-primary hover:underline"
                disabled={isLoading}
              >
                Sign in
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}