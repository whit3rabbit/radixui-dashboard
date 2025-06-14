import { Card, Flex, Text, IconButton, Button, Box } from '@radix-ui/themes'
import { 
  Cross2Icon, 
  CheckCircledIcon, 
  CrossCircledIcon, 
  ExclamationTriangleIcon,
  InfoCircledIcon 
} from '@radix-ui/react-icons'
import { useToast } from './toast-context'
import type { ToastMessage, ToastType } from './toast-context'

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircledIcon width="20" height="20" />,
  error: <CrossCircledIcon width="20" height="20" />,
  warning: <ExclamationTriangleIcon width="20" height="20" />,
  info: <InfoCircledIcon width="20" height="20" />
}

const toastColors: Record<ToastType, string> = {
  success: 'green',
  error: 'red',
  warning: 'orange',
  info: 'blue'
}

export function Toast() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <Box
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        maxWidth: '400px'
      }}
    >
      <Flex direction="column" gap="2">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </Flex>
    </Box>
  )
}

function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  const color = toastColors[toast.type]
  const icon = toastIcons[toast.type]

  return (
    <Card
      style={{
        minWidth: '300px',
        animation: 'slideIn 0.3s ease-out',
        boxShadow: 'var(--shadow-5)'
      }}
    >
      <Flex gap="3" align="start">
        <Box style={{ color: `var(--${color}-9)`, flexShrink: 0 }}>
          {icon}
        </Box>
        
        <Box style={{ flex: 1 }}>
          <Text weight="medium" size="2">
            {toast.title}
          </Text>
          {toast.description && (
            <Text size="2" color="gray" style={{ marginTop: '4px' }}>
              {toast.description}
            </Text>
          )}
          {toast.action && (
            <Button
              size="1"
              variant="ghost"
              color={color as any}
              onClick={toast.action.onClick}
              style={{ marginTop: '8px' }}
            >
              {toast.action.label}
            </Button>
          )}
        </Box>
        
        <IconButton
          size="1"
          variant="ghost"
          color="gray"
          onClick={onClose}
        >
          <Cross2Icon />
        </IconButton>
      </Flex>
    </Card>
  )
}

// Add animation keyframes
const style = document.createElement('style')
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`
document.head.appendChild(style)