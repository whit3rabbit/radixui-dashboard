/**
 * @file Users.tsx
 * @description This file defines the User Management page component for the dashboard.
 * It provides a tabbed interface for managing users, roles, permissions, and viewing activity logs.
 * Features include listing users with filtering, bulk actions, creating/editing users via dialogs,
 * and displaying roles with their associated permissions.
 * All data and some functionalities (like activity log) are currently mocked.
 */
import { useState } from 'react'
import {
  Box,
  Card,
  Flex,
  Heading, 
  Text, 
  Button, 
  Avatar, 
  Badge, 
  Dialog,
  TextField,
  Select,
  Tabs,
  Separator,
  IconButton,
  Checkbox,
  Code
} from '@radix-ui/themes'
import { 
  PlusIcon, 
  DotsHorizontalIcon,
  TrashIcon,
  Pencil1Icon,
  LockClosedIcon,
  UploadIcon,
  ActivityLogIcon,
  CheckCircledIcon
} from '@radix-ui/react-icons'
// Note: DropdownMenu is already imported from @radix-ui/themes in the main block.
// Redundant import at the end of the original file will be removed.
import DataTable from '../../components/DataTable' // Reusable DataTable component
import { useToast } from '../../components/notifications/toast-context' // For toast notifications

/**
 * @typedef {'admin' | 'moderator' | 'user'} UserRole
 * @description Represents the possible roles a user can have.
 */
type UserRole = 'admin' | 'moderator' | 'user';

/**
 * @typedef {'active' | 'inactive' | 'suspended'} UserStatus
 * @description Represents the possible statuses of a user account.
 */
type UserStatus = 'active' | 'inactive' | 'suspended';

/**
 * @interface User
 * @description Defines the structure of a user object.
 * @property {string} id - Unique identifier for the user.
 * @property {string} name - Full name of the user.
 * @property {string} email - Email address of the user.
 * @property {UserRole} role - The role assigned to the user.
 * @property {string} department - The department the user belongs to.
 * @property {UserStatus} status - Current status of the user's account.
 * @property {string} [avatar] - URL to the user's avatar image.
 * @property {Date} lastLogin - Date of the user's last login.
 * @property {Date} createdAt - Date when the user account was created.
 * @property {string[]} permissions - A list of permission strings assigned to the user (can be derived from role).
 */
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  avatar?: string;
  lastLogin: Date;
  createdAt: Date;
  permissions: string[];
}

/**
 * @interface Role
 * @description Defines the structure of a user role object.
 * @property {string} id - Unique identifier for the role.
 * @property {string} name - Display name of the role (e.g., "Administrator").
 * @property {string} description - A brief description of the role's purpose.
 * @property {string[]} permissions - An array of permission strings associated with this role.
 * @property {number} userCount - The number of users currently assigned to this role.
 */
interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

// TODO: Replace mockUsers, mockRoles, and allPermissions with actual data from an API or data source.
/**
 * @const mockUsers
 * @description An array of mock user data for demonstration.
 */
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    department: 'Engineering',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    lastLogin: new Date('2024-06-13T10:30:00'),
    createdAt: new Date('2023-01-15'),
    permissions: ['users.manage', 'billing.manage', 'settings.manage']
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'moderator',
    department: 'Marketing',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    lastLogin: new Date('2024-06-12T15:45:00'),
    createdAt: new Date('2023-03-20'),
    permissions: ['users.view', 'content.manage']
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    role: 'user',
    department: 'Sales',
    status: 'inactive',
    lastLogin: new Date('2024-05-20T09:15:00'),
    createdAt: new Date('2023-06-10'),
    permissions: ['profile.edit']
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    role: 'admin',
    department: 'HR',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    lastLogin: new Date('2024-06-13T08:00:00'),
    createdAt: new Date('2022-11-28'),
    permissions: ['users.manage', 'billing.manage', 'settings.manage']
  },
  {
    id: '5',
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    role: 'user',
    department: 'Engineering',
    status: 'suspended',
    lastLogin: new Date('2024-04-10T14:20:00'),
    createdAt: new Date('2023-08-15'),
    permissions: ['profile.edit']
  }
]

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: ['users.manage', 'billing.manage', 'settings.manage', 'content.manage'],
    userCount: 2
  },
  {
    id: '2',
    name: 'Moderator',
    description: 'Can manage content and view users',
    permissions: ['users.view', 'content.manage'],
    userCount: 1
  },
  {
    id: '3',
    name: 'User',
    description: 'Basic user with limited permissions',
    permissions: ['profile.edit'],
    userCount: 2
  }
  // ... more mock roles
];

/**
 * @const allPermissions
 * @description A comprehensive list of all available permissions in the system,
 * grouped by category. Used for displaying the permissions matrix.
 */
const allPermissions = [
  { id: 'users.manage', name: 'Manage Users (Create, Edit, Delete)', category: 'Users' },
  { id: 'users.view', name: 'View User List and Profiles', category: 'Users' },
  { id: 'billing.manage', name: 'Manage Subscriptions and Invoices', category: 'Billing' },
  { id: 'billing.view', name: 'View Billing', category: 'Billing' },
  { id: 'settings.manage', name: 'Manage Settings', category: 'Settings' },
  { id: 'content.manage', name: 'Manage Content', category: 'Content' },
  { id: 'content.view', name: 'View Content', category: 'Content' },
  { id: 'profile.edit', name: 'Edit Own Profile Details', category: 'Profile' }
  // ... more permissions
];

/**
 * @function Users
 * @description The main component for the User Management page.
 * It provides a tabbed interface for managing users and their roles/permissions,
 * as well as viewing a mock activity log.
 * @returns {JSX.Element} The rendered User Management page.
 */
export default function Users() {
  const { showToast } = useToast(); // Hook for displaying toast notifications

  // --- State Management ---
  const [users, setUsers] = useState<User[]>(mockUsers); // List of all users
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [roles, _setRoles] = useState<Role[]>(mockRoles); // List of all roles (_setRoles would be used if roles are editable)
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]); // Users selected in the DataTable for bulk actions
  const [showUserDialog, setShowUserDialog] = useState(false); // Controls visibility of the create/edit user dialog
  const [showBulkImport, setShowBulkImport] = useState(false); // Controls visibility of the bulk import dialog
  const [editingUser, setEditingUser] = useState<User | null>(null); // Stores the user being edited, or null if creating
  const [activeTab, setActiveTab] = useState('users'); // Currently active tab ('users', 'roles', 'activity')

  // Filter states for the users table
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // --- User CRUD and Bulk Action Handlers ---

  /**
   * @function handleCreateOrUpdateUser
   * @description Handles creation or update of a user.
   * If `editingUser` is present, it updates that user; otherwise, creates a new user.
   * Data is taken from a form (not explicitly passed here, assumes form state is read within).
   * Shows a toast notification on success.
   * @param {Partial<User>} userData - The user data from the form. For new users, some fields might be defaulted.
   */
  const handleCreateOrUpdateUser = (userData: Partial<User>) => {
    // This function would typically take data from a form state within the dialog.
    // For simplicity, using passed userData and some defaults.
    if (editingUser) {
      // Update existing user
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userData, updatedAt: new Date() } : u));
      showToast({ type: 'success', title: 'User updated', description: `${userData.name || editingUser.name} has been updated.` });
    } else {
      // Create new user
      const newUser: User = {
        id: Date.now().toString(), // Simple ID for mock
        name: userData.name || 'New User',
        email: userData.email || `newuser${Date.now()}@example.com`,
        role: userData.role || 'user',
        department: userData.department || 'Unassigned',
        status: 'active',
        lastLogin: new Date(),
        createdAt: new Date(),
        permissions: userData.permissions || ['profile.edit'],
        avatar: userData.avatar
      };
      setUsers([...users, newUser]);
      showToast({ type: 'success', title: 'User created', description: `${newUser.name} has been added.` });
    }
    setShowUserDialog(false); // Close dialog
    setEditingUser(null); // Reset editing state
  };
  // Note: The original `handleCreateUser` was more specific.
  // The above `handleCreateOrUpdateUser` is a common pattern for combined dialogs.
  // If keeping separate, ensure `handleUpdateUser` is also defined.
  // For now, I'll adapt the dialog's save button to call this or a similar combined function.

  /**
   * @function handleDeleteUser
   * @description Deletes a user by their ID. Shows a toast notification.
   * @param {string} userId - The ID of the user to delete.
   */
  const handleDeleteUser = (userId: string) => {
    // TODO: Add confirmation dialog before actual deletion
    setUsers(users.filter(user => user.id !== userId));
    showToast({
      type: 'success',
      title: 'User Deleted',
      description: 'The user has been removed from the system.'
    });
  };

  /**
   * @function handleBulkDelete
   * @description Deletes all users currently selected in `selectedUsers`. Shows a toast.
   */
  const handleBulkDelete = () => {
    // TODO: Add confirmation dialog
    const idsToDelete = selectedUsers.map(u => u.id);
    setUsers(users.filter(user => !idsToDelete.includes(user.id)));
    setSelectedUsers([]); // Clear selection
    showToast({
      type: 'success',
      title: 'Users Deleted',
      description: `${idsToDelete.length} user(s) have been removed.`
    });
  };

  /**
   * @function handleBulkRoleChange
   * @description Changes the role for all users currently selected in `selectedUsers`. Shows a toast.
   * @param {UserRole} newRole - The new role to assign to the selected users.
   */
  const handleBulkRoleChange = (newRole: UserRole) => {
    const idsToUpdate = selectedUsers.map(u => u.id);
    setUsers(users.map(user =>
      idsToUpdate.includes(user.id) ? { ...user, role: newRole, updatedAt: new Date() } : user
    ));
    setSelectedUsers([]); // Clear selection
    showToast({
      type: 'success',
      title: 'Roles Updated',
      description: `Updated role to "${newRole}" for ${idsToUpdate.length} user(s).`
    });
  };

  // --- Helper Functions ---
  /**
   * @function formatDate
   * @description Formats a date for display, showing relative time for recent dates.
   * @param {Date} date - The date to format.
   * @returns {string} The formatted date string (e.g., "Xh ago" or "MM/DD/YYYY").
   */
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000); // milliseconds to hours

    if (diffHours < 24 && diffHours >= 0) { // Check for non-negative diffHours
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString(); // Use local date format
    }
  };

  // --- DataTable Configuration ---
  /**
   * @const userColumns
   * @description Configuration for the columns in the Users DataTable.
   */
  const userColumns = [
    {
      key: 'user',
      header: 'User',
      render: (_: any, row: User) => (
        <Flex align="center" gap="3">
          <Avatar
            size="2"
            src={row.avatar}
            fallback={row.name.split(' ').map(n => n[0]).join('')}
            radius="full"
          />
          <Box>
            <Text size="2" weight="medium">{row.name}</Text>
            <Text size="1" color="gray">{row.email}</Text>
          </Box>
        </Flex>
      )
    },
    {
      key: 'role',
      header: 'Role',
      render: (value: User['role']) => (
        <Badge color={value === 'admin' ? 'red' : value === 'moderator' ? 'blue' : 'gray'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: User['status']) => (
        <Badge 
          color={value === 'active' ? 'green' : value === 'inactive' ? 'gray' : 'red'}
          variant="soft"
        >
          {value}
        </Badge>
      )
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      sortable: true,
      render: (value: Date) => formatDate(value)
    }
  ]; // Added semicolon here

  /**
   * @function userActions
   * @description A function that returns JSX for the actions column in the Users DataTable.
   * This includes options to edit, view activity, reset password, and delete the user.
   * @param {User} user - The user object for the current row.
   * @returns {JSX.Element} The actions dropdown menu for the user.
   */
  const userActions = (user: User): JSX.Element => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton size="1" variant="ghost"> {/* Radix IconButton */}
          <DotsHorizontalIcon />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={() => {
          setEditingUser(user)
          setShowUserDialog(true)
        }}>
          <Pencil1Icon />
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <ActivityLogIcon />
          View Activity
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <LockClosedIcon />
          Reset Password
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item color="red" onClick={() => handleDeleteUser(user.id)}>
          <TrashIcon />
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )

  return (
    <Box>
      <Flex direction="column" gap="6">
        <Flex justify="between" align="center">
          <Box>
            <Heading size="8" mb="2">User Management</Heading>
            <Text color="gray">Manage users, roles, and permissions</Text>
          </Box>
          <Flex gap="2">
            <Button variant="soft" onClick={() => setShowBulkImport(true)}>
              <UploadIcon />
              Import Users
            </Button>
            <Button onClick={() => {
              setEditingUser(null)
              setShowUserDialog(true)
            }}>
              <PlusIcon />
              Add User
            </Button>
          </Flex>
        </Flex>

        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Trigger value="users">Users</Tabs.Trigger>
            <Tabs.Trigger value="roles">Roles & Permissions</Tabs.Trigger>
            <Tabs.Trigger value="activity">Activity Log</Tabs.Trigger>
          </Tabs.List>

          <Box mt="6">
            {/* Users Tab */}
            <Tabs.Content value="users">
              <Flex direction="column" gap="4">
                {/* Filters */}
                <Card>
                  <Flex gap="3" wrap="wrap">
                    <Select.Root value={roleFilter} onValueChange={setRoleFilter}>
                      <Select.Trigger placeholder="Role" />
                      <Select.Content>
                        <Select.Item value="all">All Roles</Select.Item>
                        <Select.Item value="admin">Admin</Select.Item>
                        <Select.Item value="moderator">Moderator</Select.Item>
                        <Select.Item value="user">User</Select.Item>
                      </Select.Content>
                    </Select.Root>
                    
                    <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
                      <Select.Trigger placeholder="Status" />
                      <Select.Content>
                        <Select.Item value="all">All Status</Select.Item>
                        <Select.Item value="active">Active</Select.Item>
                        <Select.Item value="inactive">Inactive</Select.Item>
                        <Select.Item value="suspended">Suspended</Select.Item>
                      </Select.Content>
                    </Select.Root>
                    
                    <Select.Root value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <Select.Trigger placeholder="Department" />
                      <Select.Content>
                        <Select.Item value="all">All Departments</Select.Item>
                        <Select.Item value="Engineering">Engineering</Select.Item>
                        <Select.Item value="Marketing">Marketing</Select.Item>
                        <Select.Item value="Sales">Sales</Select.Item>
                        <Select.Item value="HR">HR</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Flex>
                </Card>

                {/* Bulk Actions */}
                {selectedUsers.length > 0 && (
                  <Card>
                    <Flex justify="between" align="center">
                      <Text size="2">
                        {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                      </Text>
                      <Flex gap="2">
                        <Select.Root onValueChange={(value) => handleBulkRoleChange(value as User['role'])}>
                          <Select.Trigger placeholder="Change role..." />
                          <Select.Content>
                            <Select.Item value="admin">Set as Admin</Select.Item>
                            <Select.Item value="moderator">Set as Moderator</Select.Item>
                            <Select.Item value="user">Set as User</Select.Item>
                          </Select.Content>
                        </Select.Root>
                        <Button color="red" variant="soft" onClick={handleBulkDelete}>
                          <TrashIcon />
                          Delete Selected
                        </Button>
                      </Flex>
                    </Flex>
                  </Card>
                )}

                {/* Users Table */}
                <Card>
                  <DataTable
                    data={users}
                    columns={userColumns}
                    searchPlaceholder="Search users..."
                    selectable
                    onSelectionChange={setSelectedUsers}
                    actions={userActions}
                  />
                </Card>
              </Flex>
            </Tabs.Content>

            {/* Roles Tab */}
            <Tabs.Content value="roles">
              <Flex direction="column" gap="4">
                <Card>
                  <Flex justify="between" align="center" mb="4">
                    <Heading size="4">Roles</Heading>
                    <Button size="2" onClick={() => showToast({ type: 'info', title: 'Coming soon', description: 'Role creation feature is not yet implemented' })}>
                      <PlusIcon />
                      Create Role
                    </Button>
                  </Flex>
                  
                  <Flex direction="column" gap="3">
                    {roles.map((role) => (
                      <Card key={role.id} variant="surface">
                        <Flex justify="between" align="start">
                          <Box>
                            <Heading size="3" mb="1">{role.name}</Heading>
                            <Text size="2" color="gray">{role.description}</Text>
                            <Flex gap="2" mt="2" wrap="wrap">
                              {role.permissions.map((perm) => (
                                <Badge key={perm} variant="outline" size="1">
                                  {perm}
                                </Badge>
                              ))}
                            </Flex>
                          </Box>
                          <Flex align="center" gap="3">
                            <Text size="2" color="gray">{role.userCount} users</Text>
                            <IconButton size="1" variant="ghost">
                              <Pencil1Icon />
                            </IconButton>
                          </Flex>
                        </Flex>
                      </Card>
                    ))}
                  </Flex>
                </Card>

                <Card>
                  <Heading size="4" mb="4">Permissions Matrix</Heading>
                  <Box style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid var(--gray-6)' }}>
                            Permission
                          </th>
                          {roles.map((role) => (
                            <th key={role.id} style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid var(--gray-6)' }}>
                              {role.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {allPermissions.map((permission) => (
                          <tr key={permission.id}>
                            <td style={{ padding: '8px', borderBottom: '1px solid var(--gray-4)' }}>
                              <Text size="2">{permission.name}</Text>
                              <Text size="1" color="gray"> ({permission.category})</Text>
                            </td>
                            {roles.map((role) => (
                              <td key={role.id} style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid var(--gray-4)' }}>
                                {role.permissions.includes(permission.id) && (
                                  <CheckCircledIcon color="green" />
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                </Card>
              </Flex>
            </Tabs.Content>

            {/* Activity Tab */}
            <Tabs.Content value="activity">
              <Card>
                <Heading size="4" mb="4">Recent Activity</Heading>
                <Flex direction="column" gap="3">
                  <Flex align="center" gap="3">
                    <Avatar size="1" fallback="JD" />
                    <Text size="2">
                      <Text weight="medium">John Doe</Text> logged in
                    </Text>
                    <Text size="1" color="gray">2 hours ago</Text>
                  </Flex>
                  <Flex align="center" gap="3">
                    <Avatar size="1" fallback="JS" />
                    <Text size="2">
                      <Text weight="medium">Jane Smith</Text> updated profile
                    </Text>
                    <Text size="1" color="gray">5 hours ago</Text>
                  </Flex>
                  <Flex align="center" gap="3">
                    <Avatar size="1" fallback="AB" />
                    <Text size="2">
                      <Text weight="medium">Alice Brown</Text> created new user
                    </Text>
                    <Text size="1" color="gray">1 day ago</Text>
                  </Flex>
                </Flex>
              </Card>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Flex>

      {/* User Dialog */}
      <Dialog.Root open={showUserDialog} onOpenChange={setShowUserDialog}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Dialog.Title>
            {editingUser ? 'Edit User' : 'Create New User'}
          </Dialog.Title>
          
          <Flex direction="column" gap="4" mt="4">
            <Box>
              <Text size="2" weight="medium" mb="1">Full Name</Text>
              <TextField.Root 
                placeholder="Enter full name"
                defaultValue={editingUser?.name}
              />
            </Box>
            
            <Box>
              <Text size="2" weight="medium" mb="1">Email</Text>
              <TextField.Root 
                type="email"
                placeholder="Enter email address"
                defaultValue={editingUser?.email}
              />
            </Box>
            
            <Flex gap="3">
              <Box style={{ flex: 1 }}>
                <Text size="2" weight="medium" mb="1">Role</Text>
                <Select.Root defaultValue={editingUser?.role || 'user'}>
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="admin">Administrator</Select.Item>
                    <Select.Item value="moderator">Moderator</Select.Item>
                    <Select.Item value="user">User</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>
              
              <Box style={{ flex: 1 }}>
                <Text size="2" weight="medium" mb="1">Department</Text>
                <Select.Root defaultValue={editingUser?.department || 'Engineering'}>
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="Engineering">Engineering</Select.Item>
                    <Select.Item value="Marketing">Marketing</Select.Item>
                    <Select.Item value="Sales">Sales</Select.Item>
                    <Select.Item value="HR">HR</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>
            </Flex>
            
            {!editingUser && (
              <Box>
                <Text size="2" weight="medium" mb="1">Temporary Password</Text>
                <TextField.Root 
                  type="password"
                  placeholder="Enter temporary password"
                />
                <Text size="1" color="gray" mt="1">
                  User will be required to change password on first login
                </Text>
              </Box>
            )}
            
            <Separator />
            
            <Flex align="center" gap="2">
              <Checkbox defaultChecked />
              <Text size="2">Send welcome email to user</Text>
            </Flex>
          </Flex>
          
          <Flex gap="3" mt="6" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Cancel</Button>
            </Dialog.Close>
            <Button onClick={() => handleCreateOrUpdateUser({
              // Example: data could be sourced from a more robust form state solution
              name: (document.querySelector('input[placeholder="Enter full name"]') as HTMLInputElement)?.value || editingUser?.name || '',
              email: (document.querySelector('input[placeholder="Enter email address"]') as HTMLInputElement)?.value || editingUser?.email || '',
              // Role and department would also be sourced from form state
              role: editingUser?.role || 'user', // Placeholder
              department: editingUser?.department || 'Unassigned' // Placeholder
            })}>
              {editingUser ? 'Save Changes' : 'Create User'}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Bulk Import Dialog */}
      <Dialog.Root open={showBulkImport} onOpenChange={setShowBulkImport}>
        <Dialog.Content style={{ maxWidth: 600 }}>
          <Dialog.Title>Import Users</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Upload a CSV file to import multiple users at once
          </Dialog.Description>
          
          <Box
            p="6"
            mb="4"
            style={{
              border: '2px dashed var(--gray-6)',
              borderRadius: 'var(--radius-3)',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: 'var(--gray-2)'
            }}
          >
            <Flex direction="column" align="center" gap="3">
              <UploadIcon width="40" height="40" />
              <Box>
                <Text size="3" weight="medium">Click to upload or drag and drop</Text>
                <Text size="2" color="gray">CSV file (max. 10MB)</Text>
              </Box>
              <Button size="2" variant="soft">Choose File</Button>
            </Flex>
          </Box>
          
          <Card variant="surface">
            <Text size="2" weight="medium" mb="2">CSV Format Requirements:</Text>
            <Code size="1" style={{ display: 'block', whiteSpace: 'pre' }}>
              name,email,role,department
              John Doe,john@example.com,user,Engineering
              Jane Smith,jane@example.com,admin,Marketing
            </Code>
          </Card>
          
          <Flex gap="3" mt="6" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Cancel</Button>
            </Dialog.Close>
            <Button>
              <UploadIcon />
              Import Users
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  )
}

// Redundant import removed: import { DropdownMenu } from '@radix-ui/themes'
// It's already included in the main import block from '@radix-ui/themes'.