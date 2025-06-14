import { Link } from 'react-router-dom'
import { Container, Flex, Heading, Text, Button, Card, Box, Code, Callout } from '@radix-ui/themes'
import { 
  HomeIcon, 
  ReloadIcon, 
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FileTextIcon
} from '@radix-ui/react-icons'
import { useState } from 'react'

export default function ServerError() {
  const [showDetails, setShowDetails] = useState(false)
  
  // Mock error details
  const errorDetails = {
    timestamp: new Date().toISOString(),
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred while processing your request',
    requestId: 'req_' + Math.random().toString(36).substring(7),
    stackTrace: `Error: Database connection timeout
    at DatabaseConnection.connect (/app/src/db/connection.js:42:15)
    at async UserService.findById (/app/src/services/user.service.js:18:5)
    at async UserController.getUser (/app/src/controllers/user.controller.js:25:20)
    at async /app/src/middleware/errorHandler.js:10:5`
  }

  const handleRetry = () => {
    window.location.reload()
  }

  const handleReportIssue = () => {
    // In a real app, this would open a support ticket or send an error report
    console.log('Reporting issue:', errorDetails)
  }

  return (
    <Container size="2" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Flex direction="column" align="center" gap="6" style={{ width: '100%', textAlign: 'center' }}>
        {/* 500 Illustration */}
        <Box>
          <Text size="9" weight="bold" style={{ fontSize: '120px', color: 'var(--red-9)' }}>
            500
          </Text>
        </Box>

        {/* Error Message */}
        <Flex direction="column" gap="2">
          <Heading size="7">Server Error</Heading>
          <Text size="3" color="gray">
            Something went wrong on our end. Please try again later.
          </Text>
        </Flex>

        {/* Error Alert */}
        <Card style={{ width: '100%', maxWidth: '600px' }}>
          <Callout.Root color="red" size="2">
            <Callout.Icon>
              <ExclamationTriangleIcon />
            </Callout.Icon>
            <Callout.Text>
              {errorDetails.message}
            </Callout.Text>
          </Callout.Root>
          
          {/* Technical Details Toggle */}
          <Box mt="3">
            <Button
              variant="ghost"
              size="2"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <ChevronUpIcon /> : <ChevronDownIcon />}
              {showDetails ? 'Hide' : 'Show'} Technical Details
            </Button>
          </Box>
          
          {/* Technical Details */}
          {showDetails && (
            <Box mt="3">
              <Flex direction="column" gap="3" align="start">
                <Box style={{ width: '100%' }}>
                  <Text size="2" weight="medium" color="gray">Request ID</Text>
                  <Code size="2">{errorDetails.requestId}</Code>
                </Box>
                
                <Box style={{ width: '100%' }}>
                  <Text size="2" weight="medium" color="gray">Timestamp</Text>
                  <Code size="2">{errorDetails.timestamp}</Code>
                </Box>
                
                <Box style={{ width: '100%' }}>
                  <Text size="2" weight="medium" color="gray">Error Code</Text>
                  <Code size="2">{errorDetails.errorCode}</Code>
                </Box>
                
                <Box style={{ width: '100%' }}>
                  <Text size="2" weight="medium" color="gray">Stack Trace</Text>
                  <Box
                    p="3"
                    style={{
                      backgroundColor: 'var(--gray-2)',
                      borderRadius: 'var(--radius-2)',
                      border: '1px solid var(--gray-6)',
                      textAlign: 'left',
                      overflowX: 'auto'
                    }}
                  >
                    <Code size="1" style={{ whiteSpace: 'pre-wrap' }}>
                      {errorDetails.stackTrace}
                    </Code>
                  </Box>
                </Box>
              </Flex>
            </Box>
          )}
        </Card>

        {/* Action Buttons */}
        <Flex gap="3" wrap="wrap" justify="center">
          <Button size="3" onClick={handleRetry}>
            <ReloadIcon />
            Try Again
          </Button>
          <Link to="/dashboard">
            <Button size="3" variant="soft">
              <HomeIcon />
              Go to Dashboard
            </Button>
          </Link>
          <Button size="3" variant="outline" onClick={handleReportIssue}>
            <FileTextIcon />
            Report Issue
          </Button>
        </Flex>

        {/* Status Page Link */}
        <Text size="2" color="gray">
          Check our{' '}
          <Link to="/status" style={{ color: 'var(--blue-9)' }}>
            status page
          </Link>
          {' '}for updates on system availability.
        </Text>
      </Flex>
    </Container>
  )
}