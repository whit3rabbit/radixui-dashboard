/**
 * @file ErrorBoundary.tsx
 * @description This file defines an ErrorBoundary component, a hook for error handling
 * in functional components (`useErrorHandler`), and a simple `ErrorFallback` component.
 * These utilities help in gracefully handling and displaying errors in the application.
 */
import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Flex, Card, Heading, Text, Button, Code, Box, Callout } from '@radix-ui/themes'
import { ExclamationTriangleIcon, ReloadIcon, HomeIcon } from '@radix-ui/react-icons'

/**
 * @interface ErrorBoundaryState
 * @description Defines the state for the ErrorBoundary component.
 * @property {boolean} hasError - Whether an error has been caught.
 * @property {Error} [error] - The caught error object.
 * @property {ErrorInfo} [errorInfo] - Additional information about the error (e.g., component stack).
 */
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

/**
 * @interface ErrorBoundaryProps
 * @description Defines the props for the ErrorBoundary component.
 * @property {ReactNode} children - The child components that this boundary will wrap.
 * @property {ReactNode} [fallback] - A custom fallback UI to render when an error occurs.
 * @property {(error: Error, errorInfo: ErrorInfo) => void} [onError] - Callback function when an error is caught.
 * @property {boolean} [showErrorDetails=false] - Whether to display detailed error messages in the default fallback UI.
 */
interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showErrorDetails?: boolean
}

/**
 * @class ErrorBoundary
 * @extends Component<ErrorBoundaryProps, ErrorBoundaryState>
 * @description A React component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the crashed component tree.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   * @constructor
   * @param {ErrorBoundaryProps} props - The props for the component.
   */
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  /**
   * @static
   * @function getDerivedStateFromError
   * @description Lifecycle method to update state so the next render will show the fallback UI.
   * @param {Error} error - The error that was thrown.
   * @returns {ErrorBoundaryState} The new state indicating an error has occurred.
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  /**
   * @function componentDidCatch
   * @description Lifecycle method to log error information.
   * @param {Error} error - The error that was thrown.
   * @param {ErrorInfo} errorInfo - An object with a componentStack key containing information about which component threw the error.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })

    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Call optional error handler
    this.props.onError?.(error, errorInfo)
  }

  /**
   * @function handleRetry
   * @description Resets the error state, allowing the children to be re-rendered.
   * This should be used if the error might be transient.
   */
  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  /**
   * @function handleGoHome
   * @description Navigates the user to the home page.
   */
  handleGoHome = () => {
    window.location.href = '/' // Consider using react-router's navigate for SPA navigation
  }

  /**
   * @function render
   * @description Renders the component. If an error has occurred, it displays the fallback UI.
   * Otherwise, it renders the children.
   * @returns {ReactNode} The rendered output.
   */
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Flex
          align="center"
          justify="center"
          style={{
            minHeight: '400px',
            padding: '2rem'
          }}
        >
          <Card style={{ maxWidth: '600px', width: '100%' }}>
            <Flex direction="column" gap="4" align="center">
              <Box>
                <ExclamationTriangleIcon 
                  width="48" 
                  height="48" 
                  color="var(--red-9)" 
                />
              </Box>
              
              <Box style={{ textAlign: 'center' }}>
                <Heading size="6" mb="2">
                  Oops! Something went wrong
                </Heading>
                <Text color="gray">
                  We're sorry, but something unexpected happened. Please try refreshing the page or go back to the home page.
                </Text>
              </Box>

              {this.props.showErrorDetails && this.state.error && (
                <Box style={{ width: '100%' }}>
                  <Callout.Root color="red" size="1">
                    <Callout.Icon>
                      <ExclamationTriangleIcon />
                    </Callout.Icon>
                    <Callout.Text>
                      <Text size="2" weight="medium">Error Details</Text>
                      <Box mt="2">
                        <Code size="1" style={{ display: 'block', whiteSpace: 'pre-wrap' }}>
                          {this.state.error.message}
                        </Code>
                      </Box>
                    </Callout.Text>
                  </Callout.Root>
                </Box>
              )}

              <Flex gap="3" justify="center">
                <Button variant="soft" onClick={this.handleRetry}>
                  <ReloadIcon />
                  Try Again
                </Button>
                <Button variant="outline" onClick={this.handleGoHome}>
                  <HomeIcon />
                  Go Home
                </Button>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      )
    }

    return this.props.children
  }
}

/**
 * @function useErrorHandler
 * @description A custom React hook for programmatic error handling in functional components.
 * This hook allows a component to throw an error that can be caught by the nearest ErrorBoundary.
 * @returns {{ handleError: (error: Error) => void, resetError: () => void }}
 *          An object containing `handleError` to trigger an error, and `resetError` to clear it (though clearing is less common here).
 * @example
 * const { handleError } = useErrorHandler();
 * try {
 *   // some operation
 * } catch (e) {
 *   handleError(e);
 * }
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  /**
   * @function resetError
   * @description Resets the error state.
   */
  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  /**
   * @function handleError
   * @description Sets the error state, which will cause the useEffect to throw it.
   * @param {Error} error - The error to handle.
   */
  const handleError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      // Re-throw the error so the nearest ErrorBoundary can catch it.
      throw error;
    }
  }, [error]);

  return { handleError, resetError };
}

/**
 * @interface ErrorFallbackProps
 * @description Defines the props for the ErrorFallback component.
 * @property {Error} [error] - The error object, if available.
 * @property {() => void} [resetError] - A function to call to attempt to recover from the error (e.g., re-render).
 * @property {string} [message="Something went wrong"] - A custom message to display.
 */
interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  message?: string;
}

/**
 * @function ErrorFallback
 * @description A simple, reusable component to display as a fallback UI when an error occurs.
 * @param {ErrorFallbackProps} props - The props for the component.
 * @returns {JSX.Element} The rendered error fallback UI.
 */
export function ErrorFallback({
  error,
  resetError,
  message = "Something went wrong"
}: ErrorFallbackProps) {
  return (
    <Card>
      <Flex direction="column" gap="3" align="center" p="4">
        <ExclamationTriangleIcon width="32" height="32" color="var(--red-9)" />
        <Text size="3" weight="medium" align="center">
          {message}
        </Text>
        {error?.message && (
          <Text size="2" color="gray" align="center">
            {error.message}
          </Text>
        )}
        {resetError && (
          <Button size="2" onClick={resetError}>
            <ReloadIcon />
            Try again
          </Button>
        )}
      </Flex>
    </Card>
  )
}