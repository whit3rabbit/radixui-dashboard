/**
 * @file ServerError.tsx
 * @description This file defines the 500 Internal Server Error page component.
 * It is displayed when an unexpected server-side error occurs.
 * The page provides users with information about the error (including optional technical details),
 * and offers actions such as retrying, returning to the dashboard, or reporting the issue.
 */
import { Link } from 'react-router-dom'
import { Container, Flex, Heading, Text, Button, Card, Box, Code, Callout, Link as RadixLink } from '@radix-ui/themes';
import {
  HomeIcon,
  ReloadIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FileTextIcon
} from '@radix-ui/react-icons'
import { useState } from 'react'

/**
 * @interface ErrorDetails
 * @description Defines the structure for mock error details displayed on the page.
 * @property {string} timestamp - ISO string of when the error occurred.
 * @property {string} errorCode - A specific code for the error (e.g., 'INTERNAL_SERVER_ERROR').
 * @property {string} message - A user-friendly error message.
 * @property {string} requestId - A unique identifier for the request that caused the error.
 * @property {string} stackTrace - A (mock) stack trace for debugging.
 */
interface ErrorDetails {
  timestamp: string;
  errorCode: string;
  message: string;
  requestId: string;
  stackTrace: string;
}

/**
 * @function ServerError
 * @description A component that renders the 500 Internal Server Error page.
 * It displays error information, including toggleable technical details (mocked),
 * and provides users with actions like retrying the page load or navigating to safety.
 * @returns {JSX.Element} The rendered 500 Server Error page.
 */
export default function ServerError() {
  const [showDetails, setShowDetails] = useState(false); // State to toggle visibility of technical error details

  // Mock error details for demonstration. In a real application, these might come from error state or context.
  /**
   * @const errorDetails
   * @description Mock object containing details about the server error.
   */
  const errorDetails: ErrorDetails = {
    timestamp: new Date().toISOString(),
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred while processing your request.',
    requestId: 'req_' + Math.random().toString(36).substring(2, 11), // Generate a mock request ID
    stackTrace: `Error: Database connection timeout at DatabaseConnection.connect (/app/src/db/connection.js:42:15)
    at async UserService.findById (/app/src/services/user.service.js:18:5)
    at async UserController.getUser (/app/src/controllers/user.controller.js:25:20)
    at async /app/src/middleware/errorHandler.js:10:5
    ... (more lines)`
  };

  /**
   * @function handleRetry
   * @description Reloads the current page, effectively retrying the last action.
   */
  const handleRetry = () => {
    window.location.reload();
  };

  /**
   * @function handleReportIssue
   * @description Placeholder function for reporting an issue.
   * In a real application, this would integrate with a bug tracking or support system.
   * Currently, it logs the error details to the console.
   */
  const handleReportIssue = () => {
    // TODO: Implement actual issue reporting (e.g., send errorDetails to Sentry, LogRocket, or a custom backend)
    console.error('Issue reported by user:', errorDetails);
    alert('Thank you for reporting the issue. Our team has been notified.'); // Simple feedback
// ... other imports

// ... ErrorDetails interface and ServerError function component start

  };

  return (
    <Flex align="center" justify="center" style={{ minHeight: '100vh' }}>
      <Container size="2">
        <Flex direction="column" align="center" gap="6" style={{ width: '100%' }}> {/* Removed textAlign: 'center' */}
          {/* 500 Illustration */}
          <Box>
            <Text size="9" weight="bold" style={{ fontSize: '120px', color: 'var(--red-9)' }} align="center"> {/* Added align="center" */}
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
        <Box style={{ maxWidth: '600px', width: '100%' }}>
          <Card>
          <Callout.Root color="red" size="2">
            <Callout.Icon>
              <ExclamationTriangleIcon />
            </Callout.Icon>
            <Callout.Text>
              {errorDetails.message}
            </Callout.Text>
          </Callout.Root>
          </Card>
        </Box>
          
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
                <Box width="100%">
                  <Text size="2" weight="medium" color="gray">Request ID</Text>
                  <Code size="2">{errorDetails.requestId}</Code>
                </Box>
                
                <Box width="100%">
                  <Text size="2" weight="medium" color="gray">Timestamp</Text>
                  <Code size="2">{errorDetails.timestamp}</Code>
                </Box>
                
                <Box width="100%">
                  <Text size="2" weight="medium" color="gray">Error Code</Text>
                  <Code size="2">{errorDetails.errorCode}</Code>
                </Box>
                
                <Box width="100%">
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

        {/* Action Buttons */}
        <Flex gap="3" wrap="wrap" justify="center">
          <Button size="3" onClick={handleRetry}>
            <ReloadIcon />
            Try Again
          </Button>
          <Link to="/dashboard">
            <Button size="3" variant="soft" asChild>
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
          <RadixLink asChild href="/status">
            status page
          </RadixLink>
          {' '}for updates on system availability.
        </Text>
        </Flex>
      </Container>
    </Flex>
  )
}