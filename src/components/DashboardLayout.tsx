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
      <Box style={{ width: '250px', backgroundColor: 'var(--gray-2)', borderRight: '1px solid var(--gray-6)' }}>
        <Card style={{ height: '100%', border: 'none', borderRadius: 0 }}>
          <Box p="4" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Text size="5" weight="bold" style={{ display: 'block', marginBottom: '24px' }}>
              Dashboard
            </Text>
            
            <Flex direction="column" gap="2" style={{ flex: 1 }}>
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <SidebarItem 
                  icon={<DashboardIcon />} 
                  label="Overview" 
                  active={location.pathname === '/dashboard'}
                />
              </Link>
              
              <Link to="/dashboard/forms" style={{ textDecoration: 'none' }}>
                <SidebarItem 
                  icon={<ComponentPlaceholderIcon />} 
                  label="Forms" 
                  active={location.pathname === '/dashboard/forms'}
                />
              </Link>
              
              <Separator my="3" />
              
              <Link to="/dashboard/users" style={{ textDecoration: 'none' }}>
                <SidebarItem 
                  icon={<PeopleIcon />} 
                  label="Users" 
                  active={location.pathname === '/dashboard/users'}
                />
              </Link>
              <Link to="/dashboard/products" style={{ textDecoration: 'none' }}>
                <SidebarItem 
                  icon={<CubeIcon />} 
                  label="Products" 
                  active={location.pathname === '/dashboard/products'}
                />
              </Link>
              <Link to="/dashboard/orders" style={{ textDecoration: 'none' }}>
                <SidebarItem 
                  icon={<ReaderIcon />} 
                  label="Orders" 
                  active={location.pathname === '/dashboard/orders'}
                />
              </Link>
              <Link to="/dashboard/transactions" style={{ textDecoration: 'none' }}>
                <SidebarItem 
                  icon={<ActivityLogIcon />} 
                  label="Transactions" 
                  active={location.pathname === '/dashboard/transactions'}
                />
              </Link>
              <Link to="/dashboard/analytics" style={{ textDecoration: 'none' }}>
                <SidebarItem 
                  icon={<BarChartIcon />} 
                  label="Analytics" 
                  active={location.pathname === '/dashboard/analytics'}
                />
              </Link>
              <Link to="/dashboard/tracking" style={{ textDecoration: 'none' }}>
                <SidebarItem 
                  icon={<RocketIcon />} 
                  label="Tracking" 
                  active={location.pathname === '/dashboard/tracking'}
                />
              </Link>
              
              <Separator my="3" />
              
              <SidebarItem icon={<FileTextIcon />} label="Projects" />
              <SidebarItem icon={<ChatBubbleIcon />} label="Messages" />
              <SidebarItem icon={<PersonIcon />} label="Team" />
              
              <Separator my="3" />
              
              <Link to="/dashboard/settings" style={{ textDecoration: 'none' }}>
                <SidebarItem 
                  icon={<GearIcon />} 
                  label="Settings" 
                  active={location.pathname === '/dashboard/settings'}
                />
              </Link>
              <SidebarItem icon={<QuestionMarkCircledIcon />} label="Help" />
              
              <Box style={{ flex: 1 }} />
              
              <Separator my="3" />
              
              <Box onClick={handleLogout}>
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

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Flex 
      align="center" 
      gap="3" 
      p="2" 
      style={{ 
        borderRadius: '6px',
        cursor: 'pointer',
        backgroundColor: active ? 'var(--gray-4)' : 'transparent',
        transition: 'background-color 0.15s ease'
      }}
      className="sidebar-item"
    >
      {icon}
      <Text size="2" weight="medium">{label}</Text>
    </Flex>
  )
}