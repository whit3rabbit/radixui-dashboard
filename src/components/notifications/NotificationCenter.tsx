import { useState } from 'react'
import { 
  IconButton, 
  Badge, 
  DropdownMenu, 
  Text, 
  Flex, 
  Box,
  Button,
  ScrollArea,
  Separator
} from '@radix-ui/themes'
import { 
  BellIcon, 
  DotFilledIcon,
  TrashIcon
} from '@radix-ui/react-icons'

export interface Notification {
  id: string
  title: string
  description: string
  timestamp: Date
  read: boolean
  type: 'info' | 'success' | 'warning' | 'error'
  action?: {
    label: string
    onClick: () => void
  }
}

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New user registered',
    description: 'John Doe just created an account',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    type: 'info'
  },
  {
    id: '2',
    title: 'Payment received',
    description: 'Payment of $1,234.56 has been processed',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    type: 'success'
  },
  {
    id: '3',
    title: 'Low stock alert',
    description: 'Product "Widget Pro" is running low on stock',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
    type: 'warning',
    action: {
      label: 'View Product',
      onClick: () => console.log('View product')
    }
  },
  {
    id: '4',
    title: 'System update available',
    description: 'Version 2.1.0 is ready to install',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    type: 'info'
  }
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [open, setOpen] = useState(false)
  
  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger>
        <Box position="relative">
          <IconButton variant="ghost" size="3">
            <BellIcon />
          </IconButton>
          {unreadCount > 0 && (
            <Badge 
              color="red" 
              variant="solid"
              size="1"
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                minWidth: '18px',
                height: '18px',
                borderRadius: '9px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px'
              }}
            >
              {unreadCount}
            </Badge>
          )}
        </Box>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content style={{ width: '360px', padding: 0 }}>
        <Box p="3">
          <Flex justify="between" align="center">
            <Text size="3" weight="medium">Notifications</Text>
            {unreadCount > 0 && (
              <Button size="1" variant="ghost" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </Flex>
        </Box>
        
        <Separator />
        
        <ScrollArea style={{ height: '400px' }}>
          {notifications.length === 0 ? (
            <Flex align="center" justify="center" p="6">
              <Text color="gray" size="2">No notifications</Text>
            </Flex>
          ) : (
            <Box>
              {notifications.map((notification) => (
                <Box
                  key={notification.id}
                  p="3"
                  style={{
                    backgroundColor: notification.read ? 'transparent' : 'var(--gray-2)',
                    borderBottom: '1px solid var(--gray-4)',
                    cursor: 'pointer'
                  }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <Flex justify="between" align="start" gap="2">
                    <Box style={{ flex: 1 }}>
                      <Flex align="center" gap="2" mb="1">
                        <Text size="2" weight="medium">
                          {notification.title}
                        </Text>
                        {!notification.read && (
                          <DotFilledIcon color="blue" />
                        )}
                      </Flex>
                      <Text size="1" color="gray">
                        {notification.description}
                      </Text>
                      <Flex align="center" gap="3" mt="2">
                        <Text size="1" color="gray">
                          {formatTimestamp(notification.timestamp)}
                        </Text>
                        {notification.action && (
                          <>
                            <Text size="1" color="gray">•</Text>
                            <Button
                              size="1"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                notification.action?.onClick()
                              }}
                            >
                              {notification.action.label}
                            </Button>
                          </>
                        )}
                      </Flex>
                    </Box>
                    <IconButton
                      size="1"
                      variant="ghost"
                      color="gray"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                    >
                      <TrashIcon />
                    </IconButton>
                  </Flex>
                </Box>
              ))}
            </Box>
          )}
        </ScrollArea>
        
        {notifications.length > 0 && (
          <>
            <Separator />
            <Box p="3">
              <Button size="2" variant="soft" style={{ width: '100%' }} onClick={clearAll}>
                Clear all notifications
              </Button>
            </Box>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}