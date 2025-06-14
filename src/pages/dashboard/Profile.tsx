/**
 * @file Profile.tsx
 * @description This file defines the User Profile page component for the dashboard.
 * It allows users to manage their general profile information (name, email, avatar),
 * change their password, update notification and appearance preferences, and delete their account.
 * The page uses a tabbed interface to organize these settings.
 */
import { useState } from 'react'
import { Card, Flex, Heading, Text, TextField, Button, Separator, Avatar, Box, Switch, Select, Tabs, Badge, Callout, AlertDialog, IconButton } from '@radix-ui/themes'
import { PersonIcon, EnvelopeClosedIcon, LockClosedIcon, BellIcon, GlobeIcon, TrashIcon, ExclamationTriangleIcon, CheckCircledIcon, CameraIcon } from '@radix-ui/react-icons'
import { useAuth } from '../../lib/auth-context' // Auth context for user data and actions
import { useTheme } from '../../lib/theme-context' // Theme context for current theme info
import { validateEmail, validateName, validatePassword, validatePasswordMatch } from '../../lib/validation' // Validation utilities
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator' // Component for password strength

/**
 * @typedef ProfileFormData
 * @description Defines the structure for the user's general profile form data.
 * @property {string} name - User's full name.
 * @property {string} email - User's email address.
 */
type ProfileFormData = {
  name: string;
  email: string;
};

/**
 * @typedef ProfileFormErrors
 * @description Defines the structure for storing errors related to the profile form.
 * @property {string} [name] - Error message for the name field.
 * @property {string} [email] - Error message for the email field.
 * @property {string} [general] - General error message (e.g., from API response).
 */
type ProfileFormErrors = {
  name?: string;
  email?: string;
  general?: string;
};

/**
 * @typedef PasswordFormData
 * @description Defines the structure for the change password form data.
 * @property {string} currentPassword - User's current password.
 * @property {string} newPassword - User's desired new password.
 * @property {string} confirmPassword - Confirmation of the new password.
 */
type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

/**
 * @typedef PasswordFormErrors
 * @description Defines the structure for storing errors related to the change password form.
 * @property {string} [currentPassword] - Error message for the current password field.
 * @property {string} [newPassword] - Error message for the new password field.
 * @property {string} [confirmPassword] - Error message for the confirm password field.
 * @property {string} [general] - General error message.
 */
type PasswordFormErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
};

/**
 * @typedef UserSettingsData
 * @description Defines the structure for user preferences/settings.
 * @property {boolean} emailNotifications - Whether email notifications are enabled.
 * @property {boolean} marketingEmails - Whether marketing emails are enabled.
 * @property {'system' | 'light' | 'dark'} themePreference - User's preferred theme.
 * @property {string} language - User's preferred language (e.g., 'en', 'es').
 */
type UserSettingsData = {
  emailNotifications: boolean;
  marketingEmails: boolean;
  themePreference: 'system' | 'light' | 'dark';
  language: string;
};

/**
 * @function Profile
 * @description The main component for the User Profile page.
 * It provides a tabbed interface for users to manage their account details,
 * security settings, preferences, and account deletion.
 * @returns {JSX.Element} The rendered Profile page.
 */
export default function Profile() {
  const { user, updateProfile, logout } = useAuth(); // Auth context for user data and actions
  const { theme } = useTheme(); // Theme context to display current theme as info

  // --- State for General Profile Information Form ---
  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [profileLoading, setProfileLoading] = useState(false); // Loading state for profile update
  const [profileSuccess, setProfileSuccess] = useState(false); // Success state for profile update
  const [profileErrors, setProfileErrors] = useState<ProfileFormErrors>({}); // Errors for profile form

  // --- State for Change Password Form ---
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false); // Loading state for password change
  const [passwordSuccess, setPasswordSuccess] = useState(false); // Success state for password change
  const [passwordErrors, setPasswordErrors] = useState<PasswordFormErrors>({}); // Errors for password form

  // --- State for User Preferences/Settings ---
  const [settings, setSettings] = useState<UserSettingsData>({
    emailNotifications: true,
    marketingEmails: false,
    themePreference: 'system', // Default or load from user preferences via API
    language: 'en', // Default or load from user preferences via API
  });

  /**
   * @function handleProfileSubmit
   * @description Handles submission of the general profile information form.
   * Validates input and calls `updateProfile` from auth context.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(false); // Reset success message on new submission

    const nameError = validateName(profileData.name);
    const emailError = validateEmail(profileData.email);

    if (nameError || emailError) {
      setProfileErrors({
        name: nameError || undefined,
        email: emailError || undefined,
      });
      return;
    }

    setProfileErrors({});
    setProfileLoading(true);

    // In a real app, avatar update would be handled separately, likely via file upload.
    const result = await updateProfile({
      name: profileData.name,
      email: profileData.email,
    });

    setProfileLoading(false);

    if (result.success) {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000); // Hide success message after 3s
    } else {
      setProfileErrors({ general: result.error || 'Failed to update profile.' });
    }
  };

  /**
   * @function handlePasswordSubmit
   * @description Handles submission of the change password form.
   * Validates input and simulates an API call for password change.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(false); // Reset success message

    const currentPasswordError = !passwordData.currentPassword ? 'Current password is required' : null;
    const newPasswordError = validatePassword(passwordData.newPassword);
    const confirmPasswordError = validatePasswordMatch(passwordData.newPassword, passwordData.confirmPassword);

    if (currentPasswordError || newPasswordError || confirmPasswordError) {
      setPasswordErrors({
        currentPassword: currentPasswordError || undefined,
        newPassword: newPasswordError || undefined,
        confirmPassword: confirmPasswordError || undefined,
      });
      return;
    }

    setPasswordErrors({});
    setPasswordLoading(true);

    // TODO: Replace with actual API call to change password.
    // This would typically involve sending currentPassword and newPassword.
    // Example: const result = await authApi.changePassword(passwordData.currentPassword, passwordData.newPassword);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

    setPasswordLoading(false);
    // Assuming API call is successful for demo:
    setPasswordSuccess(true);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Clear form
    setTimeout(() => setPasswordSuccess(false), 3000); // Hide success message
    // if (!result.success) {
    //   setPasswordErrors({ general: result.error || 'Failed to change password.' });
    // }
  };

  // TODO: Implement handleSettingsSubmit if these settings need to be saved to a backend.
  // const handleSettingsSubmit = async () => { ... }

  return (
    <Box>
      <Flex direction="column" gap="6">
        <Box>
          <Heading size="8" mb="2">Profile</Heading>
          <Text color="gray">Manage your account settings and preferences</Text>
        </Box>

        <Tabs.Root defaultValue="general">
          <Tabs.List>
            <Tabs.Trigger value="general">General</Tabs.Trigger>
            <Tabs.Trigger value="security">Security</Tabs.Trigger>
            <Tabs.Trigger value="preferences">Preferences</Tabs.Trigger>
            <Tabs.Trigger value="danger">Danger Zone</Tabs.Trigger>
          </Tabs.List>

          <Box mt="6">
            <Tabs.Content value="general">
              <Card>
                <form onSubmit={handleProfileSubmit}>
                  <Flex direction="column" gap="4">
                    <Heading size="4">Profile Information</Heading>
                    
                    {profileSuccess && (
                      <Callout.Root color="green">
                        <Callout.Icon>
                          <CheckCircledIcon />
                        </Callout.Icon>
                        <Callout.Text>Profile updated successfully!</Callout.Text>
                      </Callout.Root>
                    )}
                    
                    {profileErrors.general && (
                      <Callout.Root color="red">
                        <Callout.Icon>
                          <ExclamationTriangleIcon />
                        </Callout.Icon>
                        <Callout.Text>{profileErrors.general}</Callout.Text>
                      </Callout.Root>
                    )}
                    
                    <Flex align="center" gap="4" mb="4">
                      <Box position="relative">
                        <Avatar
                          size="6"
                          fallback={user?.name.charAt(0) || 'U'}
                          radius="full"
                        />
                        <IconButton
                          size="1"
                          variant="solid"
                          radius="full" // borderRadius: '50%'
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                          }}
                        >
                          <CameraIcon />
                        </IconButton>
                      </Box>
                      <Box>
                        <Text size="2" weight="medium">Profile Photo</Text>
                        <Text size="1" color="gray">Upload a new avatar</Text>
                      </Box>
                    </Flex>
                    
                    <Box>
                      <Text size="2" weight="medium" mb="1">Full Name</Text>
                      <TextField.Root
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        placeholder="Enter your name"
                        color={profileErrors.name ? "red" : undefined}
                        variant={profileErrors.name ? "soft" : undefined}
                      >
                        <TextField.Slot>
                          <PersonIcon />
                        </TextField.Slot>
                      </TextField.Root>
                      {profileErrors.name && (
                        <Text size="1" color="red" mt="1">{profileErrors.name}</Text>
                      )}
                    </Box>
                    
                    <Box>
                      <Text size="2" weight="medium" mb="1">Email</Text>
                      <TextField.Root
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        placeholder="Enter your email"
                        color={profileErrors.email ? "red" : undefined}
                        variant={profileErrors.email ? "soft" : undefined}
                      >
                        <TextField.Slot>
                          <EnvelopeClosedIcon />
                        </TextField.Slot>
                      </TextField.Root>
                      {profileErrors.email && (
                        <Text size="1" color="red" mt="1">{profileErrors.email}</Text>
                      )}
                    </Box>
                    
                    <Button type="submit" loading={profileLoading}>
                      Save Changes
                    </Button>
                  </Flex>
                </form>
              </Card>
            </Tabs.Content>

            <Tabs.Content value="security">
              <Card>
                <form onSubmit={handlePasswordSubmit}>
                  <Flex direction="column" gap="4">
                    <Heading size="4">Change Password</Heading>
                    
                    {passwordSuccess && (
                      <Callout.Root color="green">
                        <Callout.Icon>
                          <CheckCircledIcon />
                        </Callout.Icon>
                        <Callout.Text>Password changed successfully!</Callout.Text>
                      </Callout.Root>
                    )}
                    
                    {passwordErrors.general && (
                      <Callout.Root color="red">
                        <Callout.Icon>
                          <ExclamationTriangleIcon />
                        </Callout.Icon>
                        <Callout.Text>{passwordErrors.general}</Callout.Text>
                      </Callout.Root>
                    )}
                    
                    <Box>
                      <Text size="2" weight="medium" mb="1">Current Password</Text>
                      <TextField.Root
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        placeholder="Enter current password"
                        color={passwordErrors.currentPassword ? "red" : undefined}
                        variant={passwordErrors.currentPassword ? "soft" : undefined}
                      >
                        <TextField.Slot>
                          <LockClosedIcon />
                        </TextField.Slot>
                      </TextField.Root>
                      {passwordErrors.currentPassword && (
                        <Text size="1" color="red" mt="1">{passwordErrors.currentPassword}</Text>
                      )}
                    </Box>
                    
                    <Box>
                      <Text size="2" weight="medium" mb="1">New Password</Text>
                      <TextField.Root
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        placeholder="Enter new password"
                        color={passwordErrors.newPassword ? "red" : undefined}
                        variant={passwordErrors.newPassword ? "soft" : undefined}
                      >
                        <TextField.Slot>
                          <LockClosedIcon />
                        </TextField.Slot>
                      </TextField.Root>
                      {passwordErrors.newPassword && (
                        <Text size="1" color="red" mt="1">{passwordErrors.newPassword}</Text>
                      )}
                      <PasswordStrengthIndicator password={passwordData.newPassword} />
                    </Box>
                    
                    <Box>
                      <Text size="2" weight="medium" mb="1">Confirm New Password</Text>
                      <TextField.Root
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        placeholder="Confirm new password"
                        color={passwordErrors.confirmPassword ? "red" : undefined}
                        variant={passwordErrors.confirmPassword ? "soft" : undefined}
                      >
                        <TextField.Slot>
                          <LockClosedIcon />
                        </TextField.Slot>
                      </TextField.Root>
                      {passwordErrors.confirmPassword && (
                        <Text size="1" color="red" mt="1">{passwordErrors.confirmPassword}</Text>
                      )}
                    </Box>
                    
                    <Button type="submit" loading={passwordLoading}>
                      Update Password
                    </Button>
                  </Flex>
                </form>
              </Card>
            </Tabs.Content>

            <Tabs.Content value="preferences">
              <Flex direction="column" gap="4">
                <Card>
                  <Flex direction="column" gap="4">
                    <Heading size="4">Notifications</Heading>
                    
                    <Flex justify="between" align="center">
                      <Flex direction="column" gap="1">
                        <Flex align="center" gap="2">
                          <BellIcon />
                          <Text weight="medium">Email Notifications</Text>
                        </Flex>
                        <Text size="2" color="gray">Receive email updates about your account activity</Text>
                      </Flex>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                      />
                    </Flex>
                    
                    <Separator />
                    
                    <Flex justify="between" align="center">
                      <Flex direction="column" gap="1">
                        <Flex align="center" gap="2">
                          <EnvelopeClosedIcon />
                          <Text weight="medium">Marketing Emails</Text>
                        </Flex>
                        <Text size="2" color="gray">Receive emails about new features and updates</Text>
                      </Flex>
                      <Switch
                        checked={settings.marketingEmails}
                        onCheckedChange={(checked) => setSettings({...settings, marketingEmails: checked})}
                      />
                    </Flex>
                  </Flex>
                </Card>

                <Card>
                  <Flex direction="column" gap="4">
                    <Heading size="4">Appearance</Heading>
                    
                    <Box>
                      <Flex align="center" gap="2" mb="2">
                        <Text weight="medium">Theme Preference</Text>
                        <Badge color="blue" variant="soft">Current: {theme}</Badge>
                      </Flex>
                      <Select.Root value={settings.themePreference} onValueChange={(value: any) => setSettings({...settings, themePreference: value})}>
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Item value="system">System</Select.Item>
                          <Select.Item value="light">Light</Select.Item>
                          <Select.Item value="dark">Dark</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </Box>
                    
                    <Box>
                      <Flex align="center" gap="2" mb="2">
                        <GlobeIcon />
                        <Text weight="medium">Language</Text>
                      </Flex>
                      <Select.Root value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Item value="en">English</Select.Item>
                          <Select.Item value="es">Spanish</Select.Item>
                          <Select.Item value="fr">French</Select.Item>
                          <Select.Item value="de">German</Select.Item>
                          <Select.Item value="ja">Japanese</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </Box>
                  </Flex>
                </Card>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="danger">
              <Card>
                <Flex direction="column" gap="4">
                  <Flex direction="column" gap="2">
                    <Heading size="4" color="red">Danger Zone</Heading>
                    <Text color="gray">These actions are irreversible. Please be certain.</Text>
                  </Flex>
                  
                  <Separator />
                  
                  <Flex justify="between" align="center">
                    <Box>
                      <Text weight="medium">Delete Account</Text>
                      <Text size="2" color="gray">Permanently delete your account and all data</Text>
                    </Box>
                    <AlertDialog.Root>
                      <AlertDialog.Trigger>
                        <Button color="red" variant="soft">
                          <TrashIcon />
                          Delete Account
                        </Button>
                      </AlertDialog.Trigger>
                      <AlertDialog.Content maxWidth="450px">
                        <AlertDialog.Title>Delete Account</AlertDialog.Title>
                        <AlertDialog.Description size="2">
                          Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                        </AlertDialog.Description>
                        <Flex gap="3" mt="4" justify="end">
                          <AlertDialog.Cancel>
                            <Button variant="soft" color="gray">Cancel</Button>
                          </AlertDialog.Cancel>
                          <AlertDialog.Action>
                            <Button variant="solid" color="red" onClick={logout}>Delete Account</Button>
                          </AlertDialog.Action>
                        </Flex>
                      </AlertDialog.Content>
                    </AlertDialog.Root>
                  </Flex>
                </Flex>
              </Card>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Flex>
    </Box>
  )
}