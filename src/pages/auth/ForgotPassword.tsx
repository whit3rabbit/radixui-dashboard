import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Card, Flex, Heading, Text, TextField, Button, Box, IconButton, Callout } from '@radix-ui/themes'
import { EnvelopeClosedIcon, SunIcon, MoonIcon, ArrowLeftIcon, CheckCircledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { useTheme } from '../../lib/theme-context'
import { validateEmail } from '../../lib/validation'

export default function ForgotPassword() {
  const { theme, toggleTheme } = useTheme()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const emailError = validateEmail(email)
    if (emailError) {
      setError(emailError)
      return
    }
    
    setError(null)
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    setIsSubmitted(true)
  }
  
  return (
    <Container size="1" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {/* Theme Toggle */}
      <IconButton 
        size="3" 
        variant="ghost" 
        onClick={toggleTheme}
        style={{ position: 'absolute', top: '20px', right: '20px' }}
      >
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      </IconButton>
      
      <Card size="4" style={{ width: '100%', maxWidth: '400px' }}>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="4">
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Flex align="center" gap="2" mb="2">
                  <ArrowLeftIcon />
                  <Text size="2" color="gray">Back to login</Text>
                </Flex>
              </Link>
              
              <Flex direction="column" align="center" gap="2" mb="4">
                <Heading size="6">Forgot password?</Heading>
                <Text color="gray" align="center">
                  Enter your email address and we'll send you a link to reset your password.
                </Text>
              </Flex>

              {error && (
                <Callout.Root color="red" role="alert">
                  <Callout.Icon>
                    <ExclamationTriangleIcon />
                  </Callout.Icon>
                  <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
              )}

              <Box>
                <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '4px' }}>
                  Email
                </Text>
                <TextField.Root 
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  color={error ? "red" : undefined}
                  variant={error ? "soft" : undefined}
                >
                  <TextField.Slot>
                    <EnvelopeClosedIcon height="16" width="16" />
                  </TextField.Slot>
                </TextField.Root>
              </Box>

              <Button size="3" type="submit" loading={isLoading}>
                Send Reset Link
              </Button>
            </Flex>
          </form>
        ) : (
          <Flex direction="column" gap="4" align="center">
            <Flex direction="column" align="center" gap="3" mb="4">
              <Box style={{ color: 'var(--green-9)' }}>
                <CheckCircledIcon width="48" height="48" />
              </Box>
              <Heading size="6">Check your email</Heading>
              <Text color="gray" align="center">
                We've sent a password reset link to <Text weight="medium">{email}</Text>
              </Text>
            </Flex>

            <Callout.Root>
              <Callout.Text>
                Didn't receive an email? Check your spam folder or try again with a different email address.
              </Callout.Text>
            </Callout.Root>

            <Button variant="soft" size="3" asChild style={{ width: '100%' }}>
              <Link to="/login">Back to login</Link>
            </Button>
          </Flex>
        )}
      </Card>
    </Container>
  )
}