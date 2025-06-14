import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Card, Flex, Heading, Text, TextField, Button, Separator, Box, IconButton, Callout } from '@radix-ui/themes'
import { EnvelopeClosedIcon, LockClosedIcon, SunIcon, MoonIcon, EyeOpenIcon, EyeClosedIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { useTheme } from '../../lib/theme-context'
import { useAuth } from '../../lib/auth-context'
import { validateEmail, validatePassword } from '../../lib/validation'

export default function Login() {
  const { theme, toggleTheme } = useTheme()
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate fields
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    
    if (emailError || passwordError) {
      setErrors({
        email: emailError || undefined,
        password: passwordError || undefined,
      })
      return
    }
    
    setErrors({})
    setIsLoading(true)
    
    const result = await login(email, password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setErrors({ general: result.error })
      setIsLoading(false)
    }
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
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4">
            <Flex direction="column" align="center" gap="2" mb="4">
              <Heading size="6">Welcome back</Heading>
              <Text color="gray">Sign in to your account</Text>
            </Flex>

            {errors.general && (
              <Callout.Root color="red" role="alert">
                <Callout.Icon>
                  <ExclamationTriangleIcon />
                </Callout.Icon>
                <Callout.Text>{errors.general}</Callout.Text>
              </Callout.Root>
            )}

            <Flex direction="column" gap="3">
              <Box>
                <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '4px' }}>
                  Email
                </Text>
                <TextField.Root 
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  color={errors.email ? "red" : undefined}
                  variant={errors.email ? "soft" : undefined}
                >
                  <TextField.Slot>
                    <EnvelopeClosedIcon height="16" width="16" />
                  </TextField.Slot>
                </TextField.Root>
                {errors.email && (
                  <Text size="1" color="red" mt="1">{errors.email}</Text>
                )}
              </Box>

              <Box>
                <Flex justify="between" align="center" mb="1">
                  <Text size="2" weight="medium">
                    Password
                  </Text>
                  <Link to="/forgot-password">
                    <Text size="1" color="gray">Forgot password?</Text>
                  </Link>
                </Flex>
                <TextField.Root 
                  placeholder="Enter your password" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  color={errors.password ? "red" : undefined}
                  variant={errors.password ? "soft" : undefined}
                >
                  <TextField.Slot>
                    <LockClosedIcon height="16" width="16" />
                  </TextField.Slot>
                  <TextField.Slot side="right">
                    <IconButton
                      size="1"
                      variant="ghost"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                    </IconButton>
                  </TextField.Slot>
                </TextField.Root>
                {errors.password && (
                  <Text size="1" color="red" mt="1">{errors.password}</Text>
                )}
              </Box>
            </Flex>

            <Button size="3" style={{ marginTop: '8px' }} type="submit" loading={isLoading}>
              Sign In
            </Button>

            <Separator my="4" />

            <Flex direction="column" gap="2">
              <Button variant="outline" size="3" type="button">
                Continue with Google
              </Button>
              <Button variant="outline" size="3" type="button">
                Continue with GitHub
              </Button>
            </Flex>

            <Flex justify="center" gap="1" mt="4">
              <Text size="2" color="gray">
                Don't have an account?
              </Text>
              <Link to="/register">
                <Text size="2" color="blue" style={{ textDecoration: 'none' }}>
                  Sign up
                </Text>
              </Link>
            </Flex>
          </Flex>
        </form>
      </Card>
    </Container>
  )
}