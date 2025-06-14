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
import { useToast } from '../../components/notifications/toast-context'

interface System {
  id: string
  name: string
  ipAddress: string
  type: 'desktop' | 'server' | 'laptop' | 'mobile'
  os: string
  osVersion: string
  status: 'online' | 'offline' | 'warning'
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  uptime: number // in hours
  lastSeen: Date
  department: string
  location: string
  alerts: number
}

// Mock data
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
]

export default function Tracking() {
  const { showToast } = useToast()
  const [systems, setSystems] = useState<System[]>(mockSystems)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystems(prev => prev.map(system => ({
        ...system,
        cpuUsage: Math.max(0, Math.min(100, system.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(0, Math.min(100, system.memoryUsage + (Math.random() - 0.5) * 5)),
        lastSeen: system.status === 'online' ? new Date() : system.lastSeen
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const filteredSystems = systems.filter(system => {
    if (statusFilter !== 'all' && system.status !== statusFilter) return false
    if (typeFilter !== 'all' && system.type !== typeFilter) return false
    if (departmentFilter !== 'all' && system.department !== departmentFilter) return false
    if (searchTerm && !system.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !system.ipAddress.includes(searchTerm)) return false
    return true
  })

  const getStatusIcon = (status: System['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircledIcon />
      case 'offline':
        return <CrossCircledIcon />
      case 'warning':
        return <ExclamationTriangleIcon />
    }
  }

  const getStatusColor = (status: System['status']) => {
    switch (status) {
      case 'online':
        return 'green'
      case 'offline':
        return 'red'
      case 'warning':
        return 'orange'
    }
  }

  const getSystemIcon = (type: System['type']) => {
    switch (type) {
      case 'desktop':
      case 'server':
      case 'laptop':
        return <DesktopIcon />
      case 'mobile':
        return <MobileIcon />
    }
  }

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return 'red'
    if (usage >= 70) return 'orange'
    return 'green'
  }

  const formatUptime = (hours: number) => {
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    return `${days}d ${remainingHours}h`
  }

  const handleRestart = (system: System) => {
    showToast({
      type: 'info',
      title: 'Restart initiated',
      description: `Restarting ${system.name}...`
    })
  }

  const handleViewLogs = (system: System) => {
    showToast({
      type: 'info',
      title: 'Opening logs',
      description: `Viewing logs for ${system.name}`
    })
  }

  const handleSendAlert = (system: System) => {
    showToast({
      type: 'success',
      title: 'Alert sent',
      description: `Alert sent to administrators for ${system.name}`
    })
  }

  const onlineCount = systems.filter(s => s.status === 'online').length
  const offlineCount = systems.filter(s => s.status === 'offline').length
  const warningCount = systems.filter(s => s.status === 'warning').length
  const totalAlerts = systems.reduce((sum, s) => sum + s.alerts, 0)

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
                <CheckCircledIcon color="green" />
              </Flex>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Offline Systems</Text>
              <Flex align="center" gap="2">
                <Text size="6" weight="bold" color="red">{offlineCount}</Text>
                <CrossCircledIcon color="red" />
              </Flex>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Warnings</Text>
              <Flex align="center" gap="2">
                <Text size="6" weight="bold" color="orange">{warningCount}</Text>
                <ExclamationTriangleIcon color="orange" />
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
                style={{ minWidth: '200px' }}
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
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--gray-6)' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>System</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>OS</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Department</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>CPU</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Memory</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Disk</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Uptime</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSystems.map((system) => (
                    <tr key={system.id} style={{ borderBottom: '1px solid var(--gray-4)' }}>
                      <td style={{ padding: '12px' }}>
                        <Flex align="center" gap="2">
                          {getSystemIcon(system.type)}
                          <Box>
                            <Text size="2" weight="medium">{system.name}</Text>
                            <Text size="1" color="gray">{system.ipAddress}</Text>
                          </Box>
                        </Flex>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Badge color={getStatusColor(system.status)} variant="soft">
                          {system.status}
                        </Badge>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Text size="2">{system.os} {system.osVersion}</Text>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Text size="2">{system.department}</Text>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Text size="2" color={getUsageColor(system.cpuUsage) as any}>
                          {system.cpuUsage}%
                        </Text>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Text size="2" color={getUsageColor(system.memoryUsage) as any}>
                          {system.memoryUsage}%
                        </Text>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Text size="2" color={getUsageColor(system.diskUsage) as any}>
                          {system.diskUsage}%
                        </Text>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Text size="2">{formatUptime(system.uptime)}</Text>
                      </td>
                      <td style={{ padding: '12px' }}>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Card>
        )}
      </Flex>
    </Box>
  )
}