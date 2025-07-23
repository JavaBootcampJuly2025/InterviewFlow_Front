import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { API_BASE_URL } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { ApiResponse, LoginPageProps, LoginRequest, UserResponse } from '../../definitions/interfaces';

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loginUser = async (loginData: LoginRequest): Promise<UserResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid email or password');
      }
      if (response.status === 400) {
        throw new Error('Please check your email and password');
      }
      throw new Error('Login failed. Please try again.');
    }

    const apiResponse: ApiResponse = await response.json();

    if (!apiResponse.success) {
      throw new Error(apiResponse.message || 'Login failed');
    }

    const userData = apiResponse.data;
    if (userData.access_token) {
      localStorage.setItem('access_token', userData.access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('Token stored:', userData.access_token.substring(0, 20) + '...');
    } else {
      console.error('No access_token in response:', userData);
    }

    return apiResponse.data;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }

      if (!email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }

      const loginData: LoginRequest = {
        email: email.trim(),
        password: password
      };

      const userData = await loginUser(loginData);

      const transformedUserData = {
        id: userData.id.toString(),
        email: userData.email,
        name: userData.userName,
        userName: userData.userName,
      };

      onLogin(transformedUserData);
      navigate('/dashboard');

    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className='p-3 gap-2'>
        <CardHeader className="text-center">
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription className='text-sm'>
            Sign in to your account to continue tracking your applications
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
                  placeholder="Enter your password"
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-primary hover:underline text-sm"
                disabled={isLoading}
              >
                Register
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}