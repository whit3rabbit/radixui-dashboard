/**
 * @file Tracking.tsx
 * @description This file defines the System Tracking page component for the dashboard.
 * It provides a user interface for monitoring the status and performance of various
 * network systems or devices. Features include filtering, different view modes (grid/list),
 * and actions for individual systems. All data is currently mock data with simulated real-time updates.
 */
import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  Flex,
  Heading, 
  Text, 
  Badge, 
  Button, 
  IconButton,
  Progress,
  Select,
  TextField,
  Grid,
  Tabs,
  DropdownMenu,
  Separator
} from '@radix-ui/themes'
import { 
  DesktopIcon,
  MobileIcon,
  UpdateIcon,
  CrossCircledIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  DotsHorizontalIcon,
  ReloadIcon,
  FileTextIcon,
  BellIcon
} from '@radix-ui/react-icons'
import { useToast } from '../../components/notifications/toast-context' // For showing toast messages

/**
 * @typedef {'desktop' | 'server' | 'laptop' | 'mobile'} SystemType
 * @description Represents the type of a system being tracked.
 */
type SystemType = 'desktop' | 'server' | 'laptop' | 'mobile';

/**
 * @typedef {'online' | 'offline' | 'warning'} SystemStatus
 * @description Represents the operational status of a system.
 */
type SystemStatus = 'online' | 'offline' | 'warning';

/**
 * @interface System
 * @description Defines the structure for a system object being tracked.
 * @property {string} id - Unique identifier for the system.
 * @property {string} name - Display name of the system.
 * @property {string} ipAddress - IP address of the system.
 * @property {SystemType} type - The type of the system (e.g., 'desktop', 'server').
 * @property {string} os - Operating system running on the system.
 * @property {string} osVersion - Version of the operating system.
 * @property {SystemStatus} status - Current operational status of the system.
 * @property {number} cpuUsage - Current CPU utilization percentage.
 * @property {number} memoryUsage - Current memory utilization percentage.
 * @property {number} diskUsage - Current disk space utilization percentage.
 * @property {number} uptime - System uptime in hours.
 * @property {Date} lastSeen - Timestamp of when the system was last detected or reported status.
 * @property {string} department - Department the system belongs to.
 * @property {string} location - Physical or logical location of the system.
 * @property {number} alerts - Number of active alerts for this system.
 */
interface System {
  id: string;
  name: string;
  ipAddress: string;
  type: SystemType;
  os: string;
  osVersion: string;
  status: SystemStatus;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: number; // in hours
  lastSeen: Date;
  department: string;
  location: string;
  alerts: number;
}

// TODO: Replace mockSystems with actual data fetched from an API or data source.
/**
 * @const mockSystems
 * @description An array of mock system data used for demonstration purposes.
 */
const mockSystems: System[] = [
  {
    id: 'SYS001',
    name: 'DESKTOP-MAIN',
    ipAddress: '192.168.1.100',
    type: 'desktop',
    os: 'Windows',
    osVersion: '11 Pro',
    status: 'online',
    cpuUsage: 45,
    memoryUsage: 72,
    diskUsage: 65,
    uptime: 168,
    lastSeen: new Date(),
    department: 'Engineering',
    location: 'Building A - Floor 3',
    alerts: 0
  },
  {
    id: 'SYS002',
    name: 'WEB-SERVER-01',
    ipAddress: '10.0.0.50',
    type: 'server',
    os: 'Ubuntu',
    osVersion: '22.04 LTS',
    status: 'online',
    cpuUsage: 78,
    memoryUsage: 85,
    diskUsage: 82,
    uptime: 720,
    lastSeen: new Date(),
    department: 'IT Operations',
    location: 'Data Center',
    alerts: 2
  },
  {
    id: 'SYS003',
    name: 'LAPTOP-SALES-03',
    ipAddress: '192.168.1.155',
    type: 'laptop',
    os: 'macOS',
    osVersion: 'Sonoma 14.2',
    status: 'warning',
    cpuUsage: 92,
    memoryUsage: 88,
    diskUsage: 95,
    uptime: 48,
    lastSeen: new Date(Date.now() - 1000 * 60 * 5),
    department: 'Sales',
    location: 'Remote',
    alerts: 3
  },
  {
    id: 'SYS004',
    name: 'DB-SERVER-02',
    ipAddress: '10.0.0.52',
    type: 'server',
    os: 'CentOS',
    osVersion: '8.5',
    status: 'online',
    cpuUsage: 32,
    memoryUsage: 45,
    diskUsage: 78,
    uptime: 2160,
    lastSeen: new Date(),
    department: 'IT Operations',
    location: 'Data Center',
    alerts: 0
  },
  {
    id: 'SYS005',
    name: 'DESKTOP-HR-01',
    ipAddress: '192.168.1.201',
    type: 'desktop',
    os: 'Windows',
    osVersion: '10 Pro',
    status: 'offline',
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    uptime: 0,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2),
    department: 'Human Resources',
    location: 'Building B - Floor 2',
    alerts: 1
  },
  {
    id: 'SYS006',
    name: 'MOBILE-DEV-01',
    ipAddress: '192.168.1.180',
    type: 'mobile',
    os: 'iOS',
    osVersion: '17.2',
    status: 'online',
    cpuUsage: 25,
    memoryUsage: 40,
    diskUsage: 35,
    uptime: 24,
    lastSeen: new Date(),
    department: 'Development',
    location: 'Mobile',
    alerts: 0
  }
  // ... more mock systems
];

/**
 * @function Tracking
 * @description The main component for the System Tracking page.
 * It displays a dashboard for monitoring various systems, allowing users to filter,
 * switch views (grid/list), and perform actions on individual systems.
 * @returns {JSX.Element} The rendered System Tracking page.
 */
export default function Tracking() {
  const { showToast } = useToast(); // Hook for displaying toast notifications
  const [systems, setSystems] = useState<System[]>(mockSystems); // State for the list of systems
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // State for current view mode
  const [statusFilter, setStatusFilter] = useState('all'); // Filter by system status
  const [typeFilter, setTypeFilter] = useState('all'); // Filter by system type
  const [departmentFilter, setDepartmentFilter] = useState('all'); // Filter by department
  const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering

  // Effect to simulate real-time updates to system metrics (CPU, memory)
  useEffect(() => {
    const interval = setInterval(() => {
      setSystems(prevSystems => prevSystems.map(system => {
        // Only update 'online' systems for more realistic simulation
        if (system.status === 'online') {
          return {
            ...system,
            // Simulate realistic fluctuations
            cpuUsage: Math.max(10, Math.min(95, system.cpuUsage + (Math.random() - 0.45) * 15)),
            memoryUsage: Math.max(20, Math.min(90, system.memoryUsage + (Math.random() - 0.4) * 10)),
            lastSeen: new Date()
          };
        }
        return system; // Return unchanged if not online
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  /**
   * @const filteredSystems
   * @description Memoized list of systems after applying current filters and search term.
   */
  const filteredSystems = systems.filter(system => {
    if (statusFilter !== 'all' && system.status !== statusFilter) return false;
    if (typeFilter !== 'all' && system.type !== typeFilter) return false;
    if (departmentFilter !== 'all' && system.department !== departmentFilter) return false;
    if (searchTerm &&
        !system.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !system.ipAddress.includes(searchTerm) &&
        !system.os.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !system.location.toLowerCase().includes(searchTerm.toLowerCase())
       ) return false;
    return true;
  });

  /**
   * @function getStatusIcon
   * @description Returns an icon component based on the system's status.
   * @param {SystemStatus} status - The status of the system.
   * @returns {JSX.Element} The corresponding icon.
   */
  const getStatusIcon = (status: SystemStatus): JSX.Element => {
    switch (status) {
      case 'online':
        return <CheckCircledIcon />;
      case 'offline':
        return <CrossCircledIcon />;
      case 'warning':
        return <ExclamationTriangleIcon />;
      default: // Should not happen with SystemStatus type
        return <ExclamationTriangleIcon />;
    }
  };

  /**
   * @function getStatusColor
   * @description Returns a color name (from Radix theme colors) based on system status.
   * @param {SystemStatus} status - The status of the system.
   * @returns {'green' | 'red' | 'orange'} The color name.
   */
  const getStatusColor = (status: SystemStatus): 'green' | 'red' | 'orange' => {
    switch (status) {
      case 'online':
        return 'green';
      case 'offline':
        return 'red';
      case 'warning':
        return 'orange';
      default:
        return 'gray'; // Fallback, though status is typed
    }
  };

  /**
   * @function getSystemIcon
   * @description Returns an icon component based on the system's type.
   * @param {SystemType} type - The type of the system.
   * @returns {JSX.Element} The corresponding icon.
   */
  const getSystemIcon = (type: SystemType): JSX.Element => {
    switch (type) {
      case 'desktop':
      case 'server':
      case 'laptop':
        return <DesktopIcon />;
      case 'mobile':
        return <MobileIcon />;
      default: // Should not happen with SystemType
        return <DesktopIcon />;
    }
  };

  /**
   * @function getUsageColor
   * @description Returns a color name based on resource usage percentage.
   * Used for progress bars (CPU, memory, disk).
   * @param {number} usage - The usage percentage (0-100).
   * @returns {'green' | 'orange' | 'red'} The color name.
   */
  const getUsageColor = (usage: number): 'green' | 'orange' | 'red' => {
    if (usage >= 90) return 'red';
    if (usage >= 70) return 'orange';
    return 'green';
  };

  /**
   * @function formatUptime
   * @description Formats uptime from hours into a human-readable string (e.g., "Xd Yh").
   * @param {number} hours - The uptime in hours.
   * @returns {string} The formatted uptime string.
   */
  const formatUptime = (hours: number): string => {
    if (hours < 0) return 'N/A'; // Handle potential negative or invalid uptime
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };

  // --- Action Handlers (placeholders, show toasts for now) ---
  /**
   * @function handleRestart
   * @description Placeholder to simulate restarting a system. Shows a toast.
   * @param {System} system - The system to restart.
   */
  const handleRestart = (system: System) => {
    // TODO: Implement actual restart logic (e.g., API call)
    showToast({
      type: 'info',
      title: 'Restart Initiated',
      description: `Restarting system: ${system.name} (${system.ipAddress})...`
    });
  };

  /**
   * @function handleViewLogs
   * @description Placeholder to simulate viewing logs for a system. Shows a toast.
   * @param {System} system - The system whose logs to view.
   */
  const handleViewLogs = (system: System) => {
    // TODO: Implement logic to navigate to or display logs
    showToast({
      type: 'info',
      title: 'Opening Logs',
      description: `Viewing logs for system: ${system.name}.`
    });
  };

  /**
   * @function handleSendAlert
   * @description Placeholder to simulate sending an alert for a system. Shows a toast.
   * @param {System} system - The system to send an alert for.
   */
  const handleSendAlert = (system: System) => {
    // TODO: Implement actual alert sending logic
    showToast({
      type: 'success',
      title: 'Alert Sent',
      description: `Alert dispatched for system: ${system.name}.`
    });
  };

  // --- Derived Data for Summary Cards ---
  const onlineCount = filteredSystems.filter(s => s.status === 'online').length;
  const offlineCount = filteredSystems.filter(s => s.status === 'offline').length;
  const warningCount = filteredSystems.filter(s => s.status === 'warning').length;
  const totalAlerts = filteredSystems.reduce((sum, s) => sum + s.alerts, 0);

  return (
    <Box>
      <Flex direction="column" gap="6">
        <Flex justify="between" align="center">
          <Box>
            <Heading size="8" mb="2">System Tracking</Heading>
            <Text color="gray">Monitor and manage network systems in real-time</Text>
          </Box>
          <Button>
            <UpdateIcon />
            Refresh All
          </Button>
        </Flex>

        {/* Summary Cards */}
        <Grid columns={{ initial: '2', sm: '4' }} gap="4">
          <Card>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Online Systems</Text>
              <Flex align="center" gap="2">
                <Text size="6" weight="bold" color="green">{onlineCount}</Text>
                <CheckCircledIcon style={{ color: 'var(--green-9)' }} />
              </Flex>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Offline Systems</Text>
              <Flex align="center" gap="2">
                <Text size="6" weight="bold" color="red">{offlineCount}</Text>
                <CrossCircledIcon style={{ color: 'var(--red-9)' }} />
              </Flex>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Warnings</Text>
              <Flex align="center" gap="2">
                <Text size="6" weight="bold" color="orange">{warningCount}</Text>
                <ExclamationTriangleIcon style={{ color: 'var(--orange-9)' }} />
              </Flex>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Active Alerts</Text>
              <Flex align="center" gap="2">
                <Text size="6" weight="bold">{totalAlerts}</Text>
                <BellIcon />
              </Flex>
            </Flex>
          </Card>
        </Grid>

        {/* Filters and View Toggle */}
        <Card>
          <Flex justify="between" align="center" gap="3" wrap="wrap">
            <Flex gap="3" wrap="wrap" style={{ flex: 1 }}>
              <TextField.Root 
                placeholder="Search by name or IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                minWidth="200px"
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon />
                </TextField.Slot>
              </TextField.Root>
              
              <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
                <Select.Trigger placeholder="Status" />
                <Select.Content>
                  <Select.Item value="all">All Status</Select.Item>
                  <Select.Item value="online">Online</Select.Item>
                  <Select.Item value="offline">Offline</Select.Item>
                  <Select.Item value="warning">Warning</Select.Item>
                </Select.Content>
              </Select.Root>
              
              <Select.Root value={typeFilter} onValueChange={setTypeFilter}>
                <Select.Trigger placeholder="Type" />
                <Select.Content>
                  <Select.Item value="all">All Types</Select.Item>
                  <Select.Item value="desktop">Desktop</Select.Item>
                  <Select.Item value="server">Server</Select.Item>
                  <Select.Item value="laptop">Laptop</Select.Item>
                  <Select.Item value="mobile">Mobile</Select.Item>
                </Select.Content>
              </Select.Root>
              
              <Select.Root value={departmentFilter} onValueChange={setDepartmentFilter}>
                <Select.Trigger placeholder="Department" />
                <Select.Content>
                  <Select.Item value="all">All Departments</Select.Item>
                  <Select.Item value="Engineering">Engineering</Select.Item>
                  <Select.Item value="IT Operations">IT Operations</Select.Item>
                  <Select.Item value="Sales">Sales</Select.Item>
                  <Select.Item value="Human Resources">HR</Select.Item>
                  <Select.Item value="Development">Development</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>
            
            <Tabs.Root value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')}>
              <Tabs.List>
                <Tabs.Trigger value="grid">Grid</Tabs.Trigger>
                <Tabs.Trigger value="list">List</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </Flex>
        </Card>

        {/* Systems Display */}
        {viewMode === 'grid' ? (
          <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap="4">
            {filteredSystems.map((system) => (
              <Card key={system.id}>
                <Flex direction="column" gap="3">
                  <Flex justify="between" align="start">
                    <Flex align="center" gap="2">
                      <Box style={{ color: `var(--${getStatusColor(system.status)}-9)` }}>
                        {getSystemIcon(system.type)}
                      </Box>
                      <Box>
                        <Text weight="medium">{system.name}</Text>
                        <Text size="1" color="gray">{system.ipAddress}</Text>
                      </Box>
                    </Flex>
                    <Flex align="center" gap="2">
                      {system.alerts > 0 && (
                        <Badge color="red" variant="solid" size="1">
                          {system.alerts}
                        </Badge>
                      )}
                      <Badge color={getStatusColor(system.status)} variant="soft">
                        {getStatusIcon(system.status)}
                        {system.status}
                      </Badge>
                    </Flex>
                  </Flex>
                  
                  <Flex direction="column" gap="2">
                    <Flex justify="between" align="center">
                      <Text size="1" color="gray">OS</Text>
                      <Text size="1">{system.os} {system.osVersion}</Text>
                    </Flex>
                    <Flex justify="between" align="center">
                      <Text size="1" color="gray">Department</Text>
                      <Text size="1">{system.department}</Text>
                    </Flex>
                    <Flex justify="between" align="center">
                      <Text size="1" color="gray">Location</Text>
                      <Text size="1">{system.location}</Text>
                    </Flex>
                    <Flex justify="between" align="center">
                      <Text size="1" color="gray">Uptime</Text>
                      <Text size="1">{formatUptime(system.uptime)}</Text>
                    </Flex>
                  </Flex>
                  
                  <Separator />
                  
                  <Flex direction="column" gap="2">
                    <Box>
                      <Flex justify="between" mb="1">
                        <Text size="1" color="gray">CPU</Text>
                        <Text size="1" color={getUsageColor(system.cpuUsage)}>{system.cpuUsage}%</Text>
                      </Flex>
                      <Progress value={system.cpuUsage} color={getUsageColor(system.cpuUsage) as any} />
                    </Box>
                    <Box>
                      <Flex justify="between" mb="1">
                        <Text size="1" color="gray">Memory</Text>
                        <Text size="1" color={getUsageColor(system.memoryUsage)}>{system.memoryUsage}%</Text>
                      </Flex>
                      <Progress value={system.memoryUsage} color={getUsageColor(system.memoryUsage) as any} />
                    </Box>
                    <Box>
                      <Flex justify="between" mb="1">
                        <Text size="1" color="gray">Disk</Text>
                        <Text size="1" color={getUsageColor(system.diskUsage)}>{system.diskUsage}%</Text>
                      </Flex>
                      <Progress value={system.diskUsage} color={getUsageColor(system.diskUsage) as any} />
                    </Box>
                  </Flex>
                  
                  <Flex justify="between" align="center">
                    <Text size="1" color="gray">
                      Last seen: {system.lastSeen.toLocaleTimeString()}
                    </Text>
                    
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <IconButton size="1" variant="ghost">
                          <DotsHorizontalIcon />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item onClick={() => handleRestart(system)}>
                          <ReloadIcon />
                          Restart
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onClick={() => handleViewLogs(system)}>
                          <FileTextIcon />
                          View Logs
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onClick={() => handleSendAlert(system)}>
                          <BellIcon />
                          Send Alert
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Grid>
        ) : (
          <Card>
            <Box style={{ overflowX: 'auto' }}>
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>System</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>OS</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Department</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>CPU</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Memory</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Disk</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Uptime</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredSystems.map((system) => (
                    <Table.Row key={system.id}>
                      <Table.Cell>
                        <Flex align="center" gap="2">
                          {getSystemIcon(system.type)}
                          <Box>
                            <Text size="2" weight="medium">{system.name}</Text>
                            <Text size="1" color="gray">{system.ipAddress}</Text>
                          </Box>
                        </Flex>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color={getStatusColor(system.status)} variant="soft">
                          {system.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{system.os} {system.osVersion}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{system.department}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2" color={getUsageColor(system.cpuUsage) as any}>
                          {system.cpuUsage}%
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2" color={getUsageColor(system.memoryUsage) as any}>
                          {system.memoryUsage}%
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2" color={getUsageColor(system.diskUsage) as any}>
                          {system.diskUsage}%
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2">{formatUptime(system.uptime)}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger>
                            <IconButton size="1" variant="ghost">
                              <DotsHorizontalIcon />
                            </IconButton>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Item onClick={() => handleRestart(system)}>
                              <ReloadIcon />
                              Restart
                            </DropdownMenu.Item>
                            <DropdownMenu.Item onClick={() => handleViewLogs(system)}>
                              <FileTextIcon />
                              View Logs
                            </DropdownMenu.Item>
                            <DropdownMenu.Item onClick={() => handleSendAlert(system)}>
                              <BellIcon />
                              Send Alert
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Card>
        )}
      </Flex>
    </Box>
  )
}