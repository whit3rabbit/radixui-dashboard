/**
 * @file Settings.tsx
 * @description This file defines the Settings page component for the dashboard.
 * It provides a multi-tabbed interface for users to configure various aspects
 * of the application, including general settings, appearance, notifications,
 * security, integrations (API keys, webhooks), and a demo of UI components.
 * It utilizes local state for managing settings and dialogs, and mock data/functions
 * for operations like saving settings and managing API keys/webhooks.
 */
import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  Flex,
  Heading, 
  Text, 
  Tabs, 
  TextField, 
  Button,
  Select,
  Switch,
  Separator,
  Badge,
  Table,
  IconButton,
  Dialog,
  TextArea,
  Callout
} from '@radix-ui/themes'
import { 
  GearIcon, 
  BellIcon, 
  LockClosedIcon, 
  Link2Icon,
  PlusIcon,
  TrashIcon,
  CopyIcon,
  EyeOpenIcon,
  EyeNoneIcon,
  ReloadIcon,
  InfoCircledIcon,
  MixerHorizontalIcon
} from '@radix-ui/react-icons'
import { useToast } from '../../components/notifications/toast-context' // Toast notifications
import { ThemeSelector } from '../../components/ThemeSelector' // Theme selection dialog
import { useTheme } from '../../lib/theme-context' // Theme context
import {
  EnhancedTextField,
  EnhancedSelect,
  EnhancedSwitch
} from '../../components/ui/FormField' // Enhanced form components
import { LoadingOverlay, Skeleton } from '../../components/ui/LoadingSpinner' // Loading indicators
import { storage } from '../../lib/secure-storage' // Secure storage utility

/**
 * @typedef GeneralSettingsData
 * @description Structure for general application settings.
 */
type GeneralSettingsData = {
  companyName: string;
  companyEmail: string;
  timezone: string;
  language: string;
  dateFormat: string;
  timeFormat: string;
};

/**
 * @typedef AppearanceSettingsData
 * @description Structure for appearance-related settings.
 */
type AppearanceSettingsData = {
  sidebarCollapsed: boolean;
  compactMode: boolean;
  showAnimations: boolean;
  highlightColor: string;
};

/**
 * @typedef NotificationSettingsData
 * @description Structure for notification preferences.
 */
type NotificationSettingsData = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  weeklyDigest: boolean;
  instantAlerts: boolean;
  marketingEmails: boolean;
};

/**
 * @typedef SecuritySettingsData
 * @description Structure for security-related settings.
 */
type SecuritySettingsData = {
  twoFactorEnabled: boolean;
  sessionTimeout: string; // e.g., '30' minutes
  ipWhitelist: string[];
};

/**
 * @typedef ApiKeyData
 * @description Structure for an API key object.
 */
type ApiKeyData = {
  id: string;
  name: string;
  key: string; // The actual key string (partially masked for display)
  created: Date;
  lastUsed: Date | null;
};

/**
 * @typedef WebhookData
 * @description Structure for a webhook configuration.
 */
type WebhookData = {
  id: string;
  url: string;
  events: string[]; // Array of event names this webhook listens to
  active: boolean;
};

/**
 * @function Settings
 * @description The main component for the Settings page.
 * It provides a tabbed interface for managing various application settings.
 * Each tab handles a different category of settings (General, Appearance, Notifications, etc.).
 * @returns {JSX.Element} The rendered Settings page.
 */
export default function Settings() {
  const { showToast } = useToast(); // Hook for displaying toast notifications
  const { theme, availableThemes } = useTheme(); // Theme context for current theme and available themes
  const [isLoading, setIsLoading] = useState(false); // Global loading state for operations like saving general settings

  // --- State for different settings categories ---
  const [generalSettings, setGeneralSettings] = useState<GeneralSettingsData>({
    companyName: 'Acme Corporation',
    companyEmail: 'contact@acme.com',
    timezone: 'America/New_York',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  });

  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettingsData>({
    sidebarCollapsed: false,
    compactMode: false,
    showAnimations: true,
    highlightColor: 'blue'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsData>({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    weeklyDigest: true,
    instantAlerts: true,
    marketingEmails: false
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettingsData>({
    twoFactorEnabled: false,
    sessionTimeout: '30', // Default to 30 minutes
    ipWhitelist: ['192.168.1.1', '10.0.0.1'] // Example IP addresses
  });

  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([
    // Mock API keys
    { id: '1', name: 'Production API', key: 'sk_live_...abc123', created: new Date('2024-01-15'), lastUsed: new Date('2024-06-12') },
    { id: '2', name: 'Development API', key: 'sk_test_...def456', created: new Date('2024-03-20'), lastUsed: new Date('2024-06-13') }
  ]);

  const [webhooks, setWebhooks] = useState<WebhookData[]>([
    // Mock webhooks
    { id: '1', url: 'https://api.example.com/webhook', events: ['user.created', 'payment.completed'], active: true },
    { id: '2', url: 'https://backup.example.com/hook', events: ['order.shipped'], active: false }
  ]);

  // --- State for dialogs and UI interactions ---
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false); // Controls API key creation dialog
  const [showWebhookDialog, setShowWebhookDialog] = useState(false); // Controls webhook creation dialog
  const [showApiKey, setShowApiKey] = useState<string | null>(null); // ID of the API key whose full value is currently shown

  /**
   * @function handleSaveGeneral
   * @description Simulates saving general settings and shows a toast notification.
   */
  const handleSaveGeneral = async () => {
    setIsLoading(true);
    // TODO: Replace with actual API call to save generalSettings
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    showToast({
      type: 'success',
      title: 'Settings saved',
      description: 'General settings have been updated successfully'
    });
    setIsLoading(false);
  };

  /**
   * @function handleSaveAppearance
   * @description Simulates saving appearance settings and shows a toast.
   */
  const handleSaveAppearance = () => {
    // TODO: Implement saving appearanceSettings (e.g., to localStorage or backend)
    showToast({
      type: 'success',
      title: 'Appearance updated',
      description: 'Your appearance preferences have been saved'
    });
  };

  /**
   * @function handleSaveNotifications
   * @description Simulates saving notification settings and shows a toast.
   */
  const handleSaveNotifications = () => {
    // TODO: Implement saving notificationSettings
    showToast({
      type: 'success',
      title: 'Notification preferences saved',
      description: 'Your notification settings have been updated'
    });
  };

  /**
   * @function handleSaveSecurity
   * @description Simulates saving security settings and shows a toast.
   */
  const handleSaveSecurity = () => {
    // TODO: Implement saving securitySettings
    showToast({
      type: 'success',
      title: 'Security settings updated',
      description: 'Your security preferences have been saved'
    });
  };

  /**
   * @function createApiKey
   * @description Simulates creating a new API key, adds it to the local state, and shows a toast.
   * @param {string} name - The name for the new API key.
   */
  const createApiKey = (name: string) => {
    // TODO: In a real app, the key would be generated by the backend.
    const newKey: ApiKeyData = {
      id: Date.now().toString(),
      name,
      key: `sk_live_${Math.random().toString(36).substring(2, 15)}`, // Mock key generation
      created: new Date(),
      lastUsed: null
    };
    setApiKeys([...apiKeys, newKey]);
    setShowApiKeyDialog(false); // Close dialog
    showToast({
      type: 'success',
      title: 'API key created',
      description: `New API key "${name}" has been generated.`
    });
  };

  /**
   * @function deleteApiKey
   * @description Simulates deleting an API key from local state and shows a toast.
   * @param {string} id - The ID of the API key to delete.
   */
  const deleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    showToast({
      type: 'success',
      title: 'API key deleted',
      description: 'The selected API key has been removed.'
    });
  };

  // TODO: Implement similar create/delete functions for webhooks.

  return (
    <Box>
      <Flex direction="column" gap="6">
        <Box>
          <Heading size="8" mb="2">Settings</Heading>
          <Text color="gray">Manage your application settings and preferences</Text>
        </Box>

        <Tabs.Root defaultValue="general">
          <Tabs.List>
            <Tabs.Trigger value="general">
              <GearIcon />
              General
            </Tabs.Trigger>
            <Tabs.Trigger value="appearance">
              Appearance
            </Tabs.Trigger>
            <Tabs.Trigger value="notifications">
              <BellIcon />
              Notifications
            </Tabs.Trigger>
            <Tabs.Trigger value="security">
              <LockClosedIcon />
              Security
            </Tabs.Trigger>
            <Tabs.Trigger value="integrations">
              <Link2Icon />
              Integrations
            </Tabs.Trigger>
            <Tabs.Trigger value="demo">
              <InfoCircledIcon />
              Component Demo
            </Tabs.Trigger>
          </Tabs.List>

          <Box mt="6">
            {/* General Settings */}
            <Tabs.Content value="general">
              <LoadingOverlay loading={isLoading} message="Saving settings...">
                <Card>
                <Flex direction="column" gap="6">
                  <Box>
                    <Heading size="4" mb="4">General Settings</Heading>
                    
                    <Flex direction="column" gap="4">
                      <Box>
                        <Text size="2" weight="medium" mb="2">Company Name</Text>
                        <TextField.Root
                          value={generalSettings.companyName}
                          onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
                          placeholder="Enter company name"
                        />
                      </Box>

                      <Box>
                        <Text size="2" weight="medium" mb="2">Contact Email</Text>
                        <TextField.Root
                          type="email"
                          value={generalSettings.companyEmail}
                          onChange={(e) => setGeneralSettings({...generalSettings, companyEmail: e.target.value})}
                          placeholder="Enter contact email"
                        />
                      </Box>

                      <Flex gap="4">
                        <Box style={{ flex: 1 }}>
                          <Text size="2" weight="medium" mb="2">Timezone</Text>
                          <Select.Root value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings({...generalSettings, timezone: value})}>
                            <Select.Trigger />
                            <Select.Content>
                              <Select.Item value="America/New_York">Eastern Time (ET)</Select.Item>
                              <Select.Item value="America/Chicago">Central Time (CT)</Select.Item>
                              <Select.Item value="America/Denver">Mountain Time (MT)</Select.Item>
                              <Select.Item value="America/Los_Angeles">Pacific Time (PT)</Select.Item>
                              <Select.Item value="UTC">UTC</Select.Item>
                            </Select.Content>
                          </Select.Root>
                        </Box>

                        <Box style={{ flex: 1 }}>
                          <Text size="2" weight="medium" mb="2">Language</Text>
                          <Select.Root value={generalSettings.language} onValueChange={(value) => setGeneralSettings({...generalSettings, language: value})}>
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

                      <Flex gap="4">
                        <Box style={{ flex: 1 }}>
                          <Text size="2" weight="medium" mb="2">Date Format</Text>
                          <Select.Root value={generalSettings.dateFormat} onValueChange={(value) => setGeneralSettings({...generalSettings, dateFormat: value})}>
                            <Select.Trigger />
                            <Select.Content>
                              <Select.Item value="MM/DD/YYYY">MM/DD/YYYY</Select.Item>
                              <Select.Item value="DD/MM/YYYY">DD/MM/YYYY</Select.Item>
                              <Select.Item value="YYYY-MM-DD">YYYY-MM-DD</Select.Item>
                            </Select.Content>
                          </Select.Root>
                        </Box>

                        <Box style={{ flex: 1 }}>
                          <Text size="2" weight="medium" mb="2">Time Format</Text>
                          <Select.Root value={generalSettings.timeFormat} onValueChange={(value) => setGeneralSettings({...generalSettings, timeFormat: value})}>
                            <Select.Trigger />
                            <Select.Content>
                              <Select.Item value="12h">12-hour</Select.Item>
                              <Select.Item value="24h">24-hour</Select.Item>
                            </Select.Content>
                          </Select.Root>
                        </Box>
                      </Flex>
                    </Flex>
                  </Box>

                  <Flex justify="end">
                    <Button onClick={handleSaveGeneral}>Save Changes</Button>
                  </Flex>
                </Flex>
              </Card>
              </LoadingOverlay>
            </Tabs.Content>

            {/* Appearance Settings */}
            <Tabs.Content value="appearance">
              <Flex direction="column" gap="4">
                <Card>
                  <Flex direction="column" gap="6">
                    <Heading size="4">Theme Settings</Heading>
                    
                    <Callout.Root>
                      <Callout.Icon>
                        <InfoCircledIcon />
                      </Callout.Icon>
                      <Callout.Text>
                        Current theme: <Text weight="medium">{availableThemes.find(t => t.id === theme)?.name}</Text>
                      </Callout.Text>
                    </Callout.Root>
                    
                    <Box>
                      <Text weight="medium" mb="3">Choose Theme</Text>
                      <ThemeSelector 
                        trigger={
                          <Button variant="outline">
                            <MixerHorizontalIcon />
                            Change Theme
                          </Button>
                        }
                      />
                    </Box>
                  </Flex>
                </Card>

                <Card>
                  <Flex direction="column" gap="6">
                    <Heading size="4">Interface Settings</Heading>
                    
                    <Flex direction="column" gap="4">
                      <Flex justify="between" align="center">
                        <Box>
                          <Text weight="medium">Collapsed Sidebar</Text>
                          <Text size="2" color="gray">Start with sidebar in collapsed state</Text>
                        </Box>
                        <Switch
                          checked={appearanceSettings.sidebarCollapsed}
                          onCheckedChange={(checked) => setAppearanceSettings({...appearanceSettings, sidebarCollapsed: checked})}
                        />
                      </Flex>

                    <Separator />

                    <Flex justify="between" align="center">
                      <Box>
                        <Text weight="medium">Compact Mode</Text>
                        <Text size="2" color="gray">Reduce spacing and padding throughout the UI</Text>
                      </Box>
                      <Switch
                        checked={appearanceSettings.compactMode}
                        onCheckedChange={(checked) => setAppearanceSettings({...appearanceSettings, compactMode: checked})}
                      />
                    </Flex>

                    <Separator />

                    <Flex justify="between" align="center">
                      <Box>
                        <Text weight="medium">Animations</Text>
                        <Text size="2" color="gray">Enable smooth transitions and animations</Text>
                      </Box>
                      <Switch
                        checked={appearanceSettings.showAnimations}
                        onCheckedChange={(checked) => setAppearanceSettings({...appearanceSettings, showAnimations: checked})}
                      />
                    </Flex>

                    <Separator />

                    <Box>
                      <Text weight="medium" mb="2">Highlight Color</Text>
                      <Select.Root value={appearanceSettings.highlightColor} onValueChange={(value) => setAppearanceSettings({...appearanceSettings, highlightColor: value})}>
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Item value="blue">Blue</Select.Item>
                          <Select.Item value="green">Green</Select.Item>
                          <Select.Item value="red">Red</Select.Item>
                          <Select.Item value="purple">Purple</Select.Item>
                          <Select.Item value="orange">Orange</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </Box>
                  </Flex>

                  <Flex justify="end">
                    <Button onClick={handleSaveAppearance}>Save Changes</Button>
                  </Flex>
                </Flex>
              </Card>

              <Card>
                <Flex direction="column" gap="4">
                  <Heading size="4">Storage Information</Heading>
                  
                  <Box>
                    <Text size="2" color="gray" mb="2">
                      Secure storage usage and availability
                    </Text>
                    
                    {(() => {
                      const storageInfo = storage.utils.getInfo()
                      return (
                        <Flex direction="column" gap="2">
                          <Flex justify="between">
                            <Text size="2">Storage Available:</Text>
                            <Badge color="green">Available</Badge>
                          </Flex>
                          <Flex justify="between">
                            <Text size="2">Total Items:</Text>
                            <Text size="2">{storageInfo.totalItems}</Text>
                          </Flex>
                          <Flex justify="between">
                            <Text size="2">Used Space:</Text>
                            <Text size="2">{storageInfo.totalSize} KB</Text>
                          </Flex>
                        </Flex>
                      )
                    })()}
                    
                    <Button 
                      size="1" 
                      variant="soft" 
                      color="red" 
                      mt="3"
                      onClick={() => {
                        storage.utils.clearAll()
                        showToast({
                          type: 'success',
                          title: 'Storage cleared',
                          description: 'All stored data has been removed'
                        })
                      }}
                    >
                      Clear All Data
                    </Button>
                  </Box>
                </Flex>
              </Card>
              </Flex>
            </Tabs.Content>

            {/* Notification Settings */}
            <Tabs.Content value="notifications">
              <Card>
                <Flex direction="column" gap="6">
                  <Heading size="4">Notification Preferences</Heading>
                  
                  <Flex direction="column" gap="4">
                    <Flex justify="between" align="center">
                      <Box>
                        <Text weight="medium">Email Notifications</Text>
                        <Text size="2" color="gray">Receive updates via email</Text>
                      </Box>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                      />
                    </Flex>

                    <Separator />

                    <Flex justify="between" align="center">
                      <Box>
                        <Text weight="medium">Push Notifications</Text>
                        <Text size="2" color="gray">Receive browser push notifications</Text>
                      </Box>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                      />
                    </Flex>

                    <Separator />

                    <Flex justify="between" align="center">
                      <Box>
                        <Text weight="medium">SMS Notifications</Text>
                        <Text size="2" color="gray">Receive text message alerts</Text>
                      </Box>
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                      />
                    </Flex>

                    <Separator />

                    <Flex justify="between" align="center">
                      <Box>
                        <Text weight="medium">Weekly Digest</Text>
                        <Text size="2" color="gray">Receive a weekly summary of activity</Text>
                      </Box>
                      <Switch
                        checked={notificationSettings.weeklyDigest}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weeklyDigest: checked})}
                      />
                    </Flex>

                    <Separator />

                    <Flex justify="between" align="center">
                      <Box>
                        <Text weight="medium">Instant Alerts</Text>
                        <Text size="2" color="gray">Get notified immediately for important events</Text>
                      </Box>
                      <Switch
                        checked={notificationSettings.instantAlerts}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, instantAlerts: checked})}
                      />
                    </Flex>

                    <Separator />

                    <Flex justify="between" align="center">
                      <Box>
                        <Text weight="medium">Marketing Emails</Text>
                        <Text size="2" color="gray">Receive product updates and promotions</Text>
                      </Box>
                      <Switch
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, marketingEmails: checked})}
                      />
                    </Flex>
                  </Flex>

                  <Flex justify="end">
                    <Button onClick={handleSaveNotifications}>Save Changes</Button>
                  </Flex>
                </Flex>
              </Card>
            </Tabs.Content>

            {/* Security Settings */}
            <Tabs.Content value="security">
              <Flex direction="column" gap="4">
                <Card>
                  <Flex direction="column" gap="6">
                    <Heading size="4">Security Settings</Heading>
                    
                    <Flex direction="column" gap="4">
                      <Flex justify="between" align="center">
                        <Box>
                          <Text weight="medium">Two-Factor Authentication</Text>
                          <Text size="2" color="gray">Add an extra layer of security to your account</Text>
                        </Box>
                        <Switch
                          checked={securitySettings.twoFactorEnabled}
                          onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorEnabled: checked})}
                        />
                      </Flex>

                      <Separator />

                      <Box>
                        <Text weight="medium" mb="2">Session Timeout</Text>
                        <Select.Root value={securitySettings.sessionTimeout} onValueChange={(value) => setSecuritySettings({...securitySettings, sessionTimeout: value})}>
                          <Select.Trigger />
                          <Select.Content>
                            <Select.Item value="15">15 minutes</Select.Item>
                            <Select.Item value="30">30 minutes</Select.Item>
                            <Select.Item value="60">1 hour</Select.Item>
                            <Select.Item value="120">2 hours</Select.Item>
                            <Select.Item value="never">Never</Select.Item>
                          </Select.Content>
                        </Select.Root>
                      </Box>
                    </Flex>

                    <Flex justify="end">
                      <Button onClick={handleSaveSecurity}>Save Changes</Button>
                    </Flex>
                  </Flex>
                </Card>

                <Card>
                  <Flex direction="column" gap="4">
                    <Flex justify="between" align="center">
                      <Heading size="4">API Keys</Heading>
                      <Button size="2" onClick={() => setShowApiKeyDialog(true)}>
                        <PlusIcon />
                        Create Key
                      </Button>
                    </Flex>

                    <Table.Root>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Key</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Last Used</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {apiKeys.map((apiKey) => (
                          <Table.Row key={apiKey.id}>
                            <Table.Cell>{apiKey.name}</Table.Cell>
                            <Table.Cell>
                              <Flex align="center" gap="2">
                                <Text size="2" style={{ fontFamily: 'monospace' }}>
                                  {showApiKey === apiKey.id ? apiKey.key : '••••••••••••'}
                                </Text>
                                <IconButton
                                  size="1"
                                  variant="ghost"
                                  onClick={() => setShowApiKey(showApiKey === apiKey.id ? null : apiKey.id)}
                                >
                                  {showApiKey === apiKey.id ? <EyeNoneIcon /> : <EyeOpenIcon />}
                                </IconButton>
                                <IconButton
                                  size="1"
                                  variant="ghost"
                                  onClick={() => {
                                    navigator.clipboard.writeText(apiKey.key)
                                    showToast({
                                      type: 'success',
                                      title: 'Copied to clipboard'
                                    })
                                  }}
                                >
                                  <CopyIcon />
                                </IconButton>
                              </Flex>
                            </Table.Cell>
                            <Table.Cell>{apiKey.created.toLocaleDateString()}</Table.Cell>
                            <Table.Cell>{apiKey.lastUsed?.toLocaleDateString() || 'Never'}</Table.Cell>
                            <Table.Cell>
                              <IconButton
                                size="1"
                                variant="ghost"
                                color="red"
                                onClick={() => deleteApiKey(apiKey.id)}
                              >
                                <TrashIcon />
                              </IconButton>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  </Flex>
                </Card>
              </Flex>
            </Tabs.Content>

            {/* Integrations */}
            <Tabs.Content value="integrations">
              <Card>
                <Flex direction="column" gap="4">
                  <Flex justify="between" align="center">
                    <Heading size="4">Webhooks</Heading>
                    <Button size="2" onClick={() => setShowWebhookDialog(true)}>
                      <PlusIcon />
                      Add Webhook
                    </Button>
                  </Flex>

                  <Table.Root>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeaderCell>URL</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Events</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {webhooks.map((webhook) => (
                        <Table.Row key={webhook.id}>
                          <Table.Cell>
                            <Text size="2" style={{ fontFamily: 'monospace' }}>
                              {webhook.url}
                            </Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Flex gap="1" wrap="wrap">
                              {webhook.events.map((event) => (
                                <Badge key={event} variant="soft" size="1">
                                  {event}
                                </Badge>
                              ))}
                            </Flex>
                          </Table.Cell>
                          <Table.Cell>
                            <Badge color={webhook.active ? 'green' : 'gray'} variant="soft">
                              {webhook.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell>
                            <Flex gap="2">
                              <IconButton size="1" variant="ghost">
                                <ReloadIcon />
                              </IconButton>
                              <IconButton
                                size="1"
                                variant="ghost"
                                color="red"
                                onClick={() => setWebhooks(webhooks.filter(w => w.id !== webhook.id))}
                              >
                                <TrashIcon />
                              </IconButton>
                            </Flex>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Flex>
              </Card>
            </Tabs.Content>

            {/* Component Demo Tab */}
            <Tabs.Content value="demo">
              <Flex direction="column" gap="6">
                <Card>
                  <Box p="6">
                    <Heading size="4" mb="4">Enhanced Components Demo</Heading>
                    <Text color="gray" mb="6">
                      Showcase of the enhanced form components with validation, loading states, and theme integration.
                    </Text>
                    
                    <Flex direction="column" gap="6">
                      {/* Theme Selector Demo */}
                      <Box>
                        <Heading size="3" mb="3">Theme System</Heading>
                        <Flex align="center" gap="4">
                          <Text size="2">Current theme: <Badge color="blue">{theme}</Badge></Text>
                          <ThemeSelector />
                        </Flex>
                      </Box>

                      <Separator />

                      {/* Enhanced Form Fields Demo */}
                      <Box>
                        <Heading size="3" mb="3">Enhanced Form Components</Heading>
                        <Flex direction="column" gap="4">
                          <EnhancedTextField
                            label="Email Address"
                            type="email"
                            placeholder="user@example.com"
                            required
                            helperText="This field supports validation and has enhanced styling"
                          />
                          
                          <EnhancedSelect
                            label="Country"
                            placeholder="Select your country"
                            required
                            options={[
                              { value: 'us', label: 'United States' },
                              { value: 'ca', label: 'Canada' },
                              { value: 'uk', label: 'United Kingdom' },
                              { value: 'au', label: 'Australia' }
                            ]}
                            helperText="Enhanced select with validation states"
                          />
                          
                          <EnhancedSwitch
                            label="Enable notifications"
                            helperText="Toggle notifications on or off"
                          />
                        </Flex>
                      </Box>

                      <Separator />

                      {/* Loading States Demo */}
                      <Box>
                        <Heading size="3" mb="3">Loading States</Heading>
                        <Flex direction="column" gap="4">
                          <Skeleton loading={false} lines={3}>
                            <Text>This text shows skeleton loading when the loading prop is true.</Text>
                            <Text>Multiple lines can be rendered as skeletons.</Text>
                            <Text>Perfect for creating loading placeholders.</Text>
                          </Skeleton>
                          
                          <Button 
                            onClick={() => {
                              setIsLoading(true);
                              setTimeout(() => setIsLoading(false), 2000);
                            }}
                          >
                            Test Loading Overlay
                          </Button>
                        </Flex>
                      </Box>

                      <Separator />

                      {/* Storage Information */}
                      <Box>
                        <Heading size="3" mb="3">Secure Storage Information</Heading>
                        <StorageInfoDisplay />
                      </Box>
                    </Flex>
                  </Box>
                </Card>
              </Flex>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Flex>

      {/* Create API Key Dialog */}
      <Dialog.Root open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Create API Key</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Create a new API key for accessing the API programmatically.
          </Dialog.Description>
          
          <Flex direction="column" gap="3">
            <Box>
              <Text size="2" weight="medium" mb="1">Key Name</Text>
              <TextField.Root placeholder="e.g., Production Server" />
            </Box>
          </Flex>
          
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Cancel</Button>
            </Dialog.Close>
            <Button onClick={() => createApiKey('New API Key')}>Create Key</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Add Webhook Dialog */}
      <Dialog.Root open={showWebhookDialog} onOpenChange={setShowWebhookDialog}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Add Webhook</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Configure a new webhook endpoint to receive event notifications.
          </Dialog.Description>
          
          <Flex direction="column" gap="3">
            <Box>
              <Text size="2" weight="medium" mb="1">Webhook URL</Text>
              <TextField.Root placeholder="https://api.example.com/webhook" />
            </Box>
            
            <Box>
              <Text size="2" weight="medium" mb="1">Events</Text>
              <TextArea placeholder="Select events to listen for..." />
            </Box>
          </Flex>
          
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Cancel</Button>
            </Dialog.Close>
            <Button>Add Webhook</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  )
}

/**
 * @function StorageInfoDisplay
 * @description A sub-component within the Settings page to display information
 * about the application's usage of secure local storage.
 * It shows total items, used space, and provides an option to clear storage.
 * @returns {JSX.Element} The rendered storage information display.
 */
function StorageInfoDisplay() {
  const [storageInfo, setStorageInfo] = useState<ReturnType<typeof storage.utils.getInfo> | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    // Simulate fetching storage info, or if it's synchronous, just set it.
    // Adding a timeout to demonstrate skeleton loading.
    setTimeout(() => {
      try {
        const info = storage.utils.getInfo(); // Use namespaced util
        setStorageInfo(info);
      } catch (error) {
        console.error("Failed to get storage info:", error);
        showToast({type: 'error', title: 'Storage Error', description: 'Could not retrieve storage information.'});
      }
      setLoading(false);
    }, 500); // Reduced timeout for faster display
  }, [showToast]); // Added showToast to dependency array if it's stable

  const handleClearStorage = () => {
    try {
      storage.utils.clearAll(); // Use namespaced util
      setStorageInfo(storage.utils.getInfo()); // Refresh info
      showToast({
        type: 'success',
        title: 'Storage Cleared',
        description: 'All application data has been cleared from local storage.'
      });
    } catch (error) {
      console.error("Failed to clear storage:", error);
      showToast({type: 'error', title: 'Storage Error', description: 'Could not clear storage.'});
    }
  };

  const handleCleanupStorage = () => {
    try {
      const cleanedCount = storage.utils.cleanup(); // Use namespaced util
      setStorageInfo(storage.utils.getInfo()); // Refresh info
      showToast({
        type: 'info',
        title: 'Storage Cleanup',
        description: `${cleanedCount} expired item(s) removed.`
      });
    } catch (error) {
      console.error("Failed to cleanup storage:", error);
      showToast({type: 'error', title: 'Storage Error', description: 'Could not cleanup storage.'});
    }
  };

  if (loading) {
    // Ensure Skeleton has children or a defined height/width to prevent rendering issues
    return <Skeleton loading={true} lines={3} height="20px"><Text>Loading storage info...</Text></Skeleton>;
  }

  return (
    <Flex direction="column" gap="3">
      <Box>
        <Text size="2" weight="medium">Storage Statistics</Text>
        <Flex gap="4" mt="2" wrap="wrap">
          <Badge color="blue" variant="soft">
            Total Items: {storageInfo?.totalItems || 0}
          </Badge>
          <Badge color="green" variant="soft">
            Used Space: {storageInfo?.totalSize || 0} KB
          </Badge>
          {storageInfo && storageInfo.expiredItems && storageInfo.expiredItems.length > 0 && (
            <Badge color="orange" variant="soft">
              Expired Items: {storageInfo.expiredItems.length}
            </Badge>
          )}
        </Flex>
      </Box>

      <Flex gap="3" mt="2">
        <Button
          size="2"
          variant="soft"
          onClick={handleCleanupStorage}
        >
          <ReloadIcon />
          Cleanup Expired
        </Button>
        <Button
          size="2"
          variant="outline"
          color="red"
          onClick={handleClearStorage}
        >
          <TrashIcon />
          Clear All Storage
        </Button>
      </Flex>

      <Callout.Root color="blue" size="1" mt="2">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          <Text size="1">
            Storage is automatically encrypted and includes expiration management. 
            Data is validated on retrieval and corrupted items are cleaned up automatically.
          </Text>
        </Callout.Text>
      </Callout.Root>
    </Flex>
  );
}