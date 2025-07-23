import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { EyeIcon, EyeOffIcon, UserIcon, KeyIcon, SaveIcon } from 'lucide-react';
import { userApi } from '../../utils/userApi';

interface ProfilePageProps {
  user: any;
  onUserUpdate: (user: any) => void;
}

export function ProfilePage({ user, onUserUpdate }: ProfilePageProps) {
  const [name, setName] = useState(user?.userName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    let ignore = false;
    async function fetchProfile() {
      try {
        const profile = await userApi.getProfile();
        if (!ignore && profile) {
          setName(profile.userName || '');
          setEmail(profile.email || '');
        }
      } catch (e) {
        console.error('Failed to fetch profile:', e);
      }
    }
    fetchProfile();
    return () => { ignore = true; };
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      // PATCH expects { username, email }
      const result = await userApi.changeProfile({
        username: name,
        email: email,
      });

      if (result.success) {
        const updatedUser = {
          ...user,
          userName: name,
          email: email
        };
        onUserUpdate(updatedUser);
        setProfileSuccess(result.message);
      } else {
        setProfileError(result.message);
      }
    } catch (err) {
      setProfileError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (!currentPassword) {
      setPasswordError('Current password is required');
      setIsLoading(false);
      return;
    }

    try {
      const result = await userApi.changePassword({
        currentPassword,
        newPassword,
      });

      if (result.success) {
        setPasswordSuccess(result.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(result.message);
      }
    } catch (err) {
      setPasswordError('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1>Profile Management</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile Information */}
        <Card className="py-2 gap-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
            <CardDescription className='text-sm'>
              Update your name and email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Separate alert for profile */}
            {(profileError || profileSuccess) && (
              <Alert
                variant={profileError ? "destructive" : "success"}
                success={!!profileSuccess}
              >
                <AlertDescription success={!!profileSuccess}>
                  {profileError || profileSuccess}
                </AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2 mt-3">
                <Label htmlFor="name">Username</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your username"
                  required
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
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                <SaveIcon className="h-4 w-4 mr-2" />
                {isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card className="py-2 gap-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <KeyIcon className="h-5 w-5" />
              <span>Change Password</span>
            </CardTitle>
            <CardDescription className='text-sm'>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Separate alert for password */}
            {(passwordError || passwordSuccess) && (
              <Alert
                variant={passwordError ? "destructive" : "success"}
                className="mb-4"
                success={!!passwordSuccess}
              >
                <AlertDescription success={!!passwordSuccess}>
                  {passwordError || passwordSuccess}
                </AlertDescription>
              </Alert>
            )}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                <KeyIcon className="h-4 w-4 mr-2" />
                {isLoading ? 'Changing...' : 'Change Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Account Statistics */}
      <Card className="py-2 gap-2">
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
          <CardDescription>
            Your account activity and usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">42</div>
              <div className="text-sm text-muted-foreground">Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm text-muted-foreground">Interviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">Offers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">15</div>
              <div className="text-sm text-muted-foreground">Days Active</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}