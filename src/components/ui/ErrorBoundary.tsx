import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Flex, Card, Heading, Text, Button, Code, Box, Callout } from '@radix-ui/themes'
import { ExclamationTriangleIcon, ReloadIcon, HomeIcon } from '@radix-ui/react-icons'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showErrorDetails?: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

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

// Hook-based error boundary for functional components
// eslint-disable-next-line react-refresh/only-export-components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const handleError = React.useCallback((error: Error) => {
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { handleError, resetError }
}

// Simple error fallback component
interface ErrorFallbackProps {
  error?: Error
  resetError?: () => void
  message?: string
}

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