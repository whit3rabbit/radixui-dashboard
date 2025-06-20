/**
 * @file DashboardLayout.tsx
 * @description This file defines the main layout for the dashboard pages.
 * It includes a sidebar for navigation and a header with user information and actions.
 * The main content of each dashboard page is rendered via the <Outlet /> component.
 */
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { Flex, Box, Card, Text, IconButton, Separator, DropdownMenu, Avatar } from '@radix-ui/themes'
import {
  DashboardIcon, 
  PersonIcon, 
  GearIcon, 
  QuestionMarkCircledIcon,
  FileTextIcon,
  ChatBubbleIcon,
  ExitIcon,
  CubeIcon,
  ReaderIcon,
  PersonIcon as PeopleIcon,
  BarChartIcon,
  ComponentPlaceholderIcon,
  ActivityLogIcon,
  RocketIcon
} from '@radix-ui/react-icons'
import { useAuth } from '../lib/auth-context'
import { NotificationCenter } from './notifications/NotificationCenter'
import { ThemeSelector } from './ThemeSelector'

/**
 * @function DashboardLayout
 * @description The main layout component for the dashboard area.
 * It sets up the sidebar, header, and content area for all dashboard pages.
 * @returns {JSX.Element} The rendered dashboard layout.
 */
export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const handleLogout = () => {
    logout()
  }
  
  return (
    <Flex style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box width="250px" style={{ backgroundColor: 'var(--gray-2)', borderRight: '1px solid var(--gray-6)' }}>
        <Card radius="none" style={{ height: '100%', border: 'none' }}>
          <Box p="4" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Text size="5" weight="bold" style={{ display: 'block', marginBottom: '24px' }}>
              Dashboard
            </Text>
            
            <Flex direction="column" gap="2" style={{ flex: 1 }}>
              <Link to="/dashboard" asChild>
                <SidebarItem 
                  icon={<DashboardIcon />} 
                  label="Overview" 
                  active={location.pathname === '/dashboard'}
                />
              </Link>
              
              <Link to="/dashboard/forms" asChild>
                <SidebarItem 
                  icon={<ComponentPlaceholderIcon />} 
                  label="Forms" 
                  active={location.pathname === '/dashboard/forms'}
                />
              </Link>
              
              <Separator my="3" />
              
              <Link to="/dashboard/users" asChild>
                <SidebarItem 
                  icon={<PeopleIcon />} 
                  label="Users" 
                  active={location.pathname === '/dashboard/users'}
                />
              </Link>
              <Link to="/dashboard/products" asChild>
                <SidebarItem 
                  icon={<CubeIcon />} 
                  label="Products" 
                  active={location.pathname === '/dashboard/products'}
                />
              </Link>
              <Link to="/dashboard/orders" asChild>
                <SidebarItem 
                  icon={<ReaderIcon />} 
                  label="Orders" 
                  active={location.pathname === '/dashboard/orders'}
                />
              </Link>
              <Link to="/dashboard/transactions" asChild>
                <SidebarItem 
                  icon={<ActivityLogIcon />} 
                  label="Transactions" 
                  active={location.pathname === '/dashboard/transactions'}
                />
              </Link>
              <Link to="/dashboard/analytics" asChild>
                <SidebarItem 
                  icon={<BarChartIcon />} 
                  label="Analytics" 
                  active={location.pathname === '/dashboard/analytics'}
                />
              </Link>
              <Link to="/dashboard/tracking" asChild>
                <SidebarItem 
                  icon={<RocketIcon />} 
                  label="Tracking" 
                  active={location.pathname === '/dashboard/tracking'}
                />
              </Link>
              
              <Separator my="3" />
              
              {/* These items are not links, so they don't need asChild. They might be placeholders or trigger other actions. */}
              <SidebarItem icon={<FileTextIcon />} label="Projects" />
              <SidebarItem icon={<ChatBubbleIcon />} label="Messages" />
              <SidebarItem icon={<PersonIcon />} label="Team" />
              
              <Separator my="3" />
              
              <Link to="/dashboard/settings" asChild>
                <SidebarItem 
                  icon={<GearIcon />} 
                  label="Settings" 
                  active={location.pathname === '/dashboard/settings'}
                />
              </Link>
              {/* This item is not a link. */}
              <SidebarItem icon={<QuestionMarkCircledIcon />} label="Help" />
              
              <Box style={{ flex: 1 }} /> {/* Spacer */}
              
              <Separator my="3" />
              
              {/* This is an onClick handler on a Box. Added cursor: pointer for better UX. */}
              <Box onClick={handleLogout} style={{ cursor: 'pointer' }}>
                <SidebarItem icon={<ExitIcon />} label="Logout" />
              </Box>
            </Flex>
          </Box>
        </Card>
      </Box>

      {/* Main Content */}
      <Flex direction="column" style={{ flex: 1 }}>
        {/* Header */}
        <Box style={{ backgroundColor: 'var(--gray-1)', borderBottom: '1px solid var(--gray-6)' }}>
          <Flex justify="between" align="center" p="4">
            <Text size="6" weight="bold">Welcome back, {user?.name || 'User'}!</Text>
            <Flex align="center" gap="3">
              <NotificationCenter />
              <ThemeSelector />
              
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <IconButton variant="ghost" size="3">
                    <Avatar
                      size="2"
                      fallback={user?.name?.charAt(0) || 'U'}
                      radius="full"
                    />
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item onClick={() => navigate('/dashboard/profile')}>
                    <PersonIcon />
                    Profile
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => navigate('/dashboard/settings')}>
                    <GearIcon />
                    Settings
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item color="red" onClick={handleLogout}>
                    <ExitIcon />
                    Logout
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Flex>
          </Flex>
        </Box>

        {/* Page Content */}
        <Box p="6" style={{ flex: 1 }}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  )
}

/**
 * @interface SidebarItemProps
 * @description Defines the props for the SidebarItem component.
 * @property {React.ReactNode} icon - The icon to display for the sidebar item.
 * @property {string} label - The text label for the sidebar item.
 * @property {boolean} [active=false] - Whether the sidebar item is currently active.
 */
interface SidebarItemProps extends Omit<React.ComponentPropsWithoutRef<typeof Flex>, 'children'> {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

/**
 * @function SidebarItem
 * @description A component to render individual items in the sidebar.
 * It's designed to be used with `asChild` prop from `Link` components.
 * @param {SidebarItemProps} props - The props for the SidebarItem component.
 * @returns {JSX.Element} The rendered sidebar item.
 */
function SidebarItem({ icon, label, active = false, style, ...props }: SidebarItemProps) {
  return (
    <Flex
      align="center"
      gap="3"
      p="2"
      style={{
        borderRadius: 'var(--radius-3)', // Using Radix token for 6px radius
        backgroundColor: active ? 'var(--accent-a4)' : 'transparent', // Using accent alpha color for active state
        transition: 'background-color 0.15s ease',
        textDecoration: 'none', // Ensure no underline from link
        color: 'inherit', // Ensure text color inherits correctly
        ...style,
      }}
      className="sidebar-item" // Retained for any specific CSS hover effects not covered by Radix
      {...props} // Spread props from Link (e.g., href, onClick)
    >
      {icon}
      <Text size="2" weight="medium">{label}</Text>
    </Flex>
  );
}