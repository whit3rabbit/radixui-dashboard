/**
 * @file toast-context.tsx
 * @description This file defines the context for managing and displaying toast notifications.
 * It provides a `ToastProvider` to wrap the application and a `useToast` hook
 * to allow components to trigger toast messages.
 */
import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { Toast } from './Toast' // The UI component for displaying toasts

/**
 * @typedef {'success' | 'error' | 'warning' | 'info'} ToastType
 * @description Defines the possible types for a toast message, influencing its appearance and icon.
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info'

/**
 * @interface ToastMessage
 * @description Defines the structure of a toast message object.
 * @property {string} id - Unique identifier for the toast.
 * @property {ToastType} type - The type of the toast (e.g., 'success', 'error').
 * @property {string} title - The main title text of the toast.
 * @property {string} [description] - Optional additional details for the toast.
 * @property {number} [duration=5000] - How long the toast should be visible in milliseconds. 0 or negative means it stays until manually closed.
 * @property {{ label: string; onClick: () => void; }} [action] - Optional action button for the toast.
 */
export interface ToastMessage {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * @interface ToastContextType
 * @description Defines the shape of the Toast context.
 * @property {ToastMessage[]} toasts - An array of currently active toast messages.
 * @property {(toast: Omit<ToastMessage, 'id'>) => void} showToast - Function to add a new toast.
 * @property {(id: string) => void} removeToast - Function to remove a toast by its ID.
 */
interface ToastContextType {
  toasts: ToastMessage[]
  showToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void
}

/**
 * @const ToastContext
 * @description React context for toast notifications.
 */
const ToastContext = createContext<ToastContextType | undefined>(undefined)

/**
 * @function ToastProvider
 * @description Provides the toast context to its children.
 * It manages the state of toasts and includes the <Toast /> component to render them.
 * @param {{ children: ReactNode }} props - Props for the component.
 * @property {ReactNode} children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} The ToastProvider component.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  /**
   * @function removeToast
   * @description Callback to remove a toast message by its ID.
   * Memoized with useCallback.
   * @param {string} id - The ID of the toast to remove.
   */
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  /**
   * @function showToast
   * @description Callback to add a new toast message.
   * It generates an ID for the toast and sets a timeout to automatically remove it
   * if a duration is specified. Memoized with useCallback.
   * @param {Omit<ToastMessage, 'id'>} toast - The toast message object (without ID).
   */
  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString() // Simple ID generation
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration || 5000
    }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <Toast />
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}