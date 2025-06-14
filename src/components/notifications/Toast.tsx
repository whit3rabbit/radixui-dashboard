/**
 * @file Toast.tsx
 * @description This file defines the Toast component, which is used to display
 * brief, auto-expiring messages (toasts) to the user. It works in conjunction
 * with the `toast-context` to manage and display toast messages.
 */
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

/**
 * @const toastIcons
 * @description A record mapping ToastType to corresponding icon components.
 * Used to display an icon next to the toast message based on its type.
 */
const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircledIcon width="20" height="20" />,
  error: <CrossCircledIcon width="20" height="20" />,
  warning: <ExclamationTriangleIcon width="20" height="20" />,
  info: <InfoCircledIcon width="20" height="20" />
}

/**
 * @const toastColors
 * @description A record mapping ToastType to color names (from Radix UI theme).
 * Used to set the color scheme of the toast based on its type.
 */
const toastColors: Record<ToastType, string> = {
  success: 'green',
  error: 'red',
  warning: 'orange',
  info: 'blue'
}

/**
 * @function Toast
 * @description The main Toast container component. It retrieves active toasts
 * from the `useToast` context and renders them as a list of `ToastItem` components.
 * Toasts are displayed in a fixed position on the screen (top-right by default).
 * Returns null if there are no toasts to display.
 * @returns {JSX.Element | null} The rendered list of toasts or null.
 */
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

/**
 * @interface ToastItemProps
 * @description Defines the props for the ToastItem component.
 * @property {ToastMessage} toast - The toast message object to display.
 * @property {() => void} onClose - Callback function to execute when the toast's close button is clicked.
 */
interface ToastItemProps {
  toast: ToastMessage;
  onClose: () => void;
}

/**
 * @function ToastItem
 * @description A component that renders an individual toast message.
 * It displays the toast's icon, title, description (optional), and an action button (optional).
 * It also includes a close button to dismiss the toast.
 * @param {ToastItemProps} props - The props for the component.
 * @returns {JSX.Element} The rendered toast item.
 */
function ToastItem({ toast, onClose }: ToastItemProps) {
  const color = toastColors[toast.type];
  const icon = toastIcons[toast.type];

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