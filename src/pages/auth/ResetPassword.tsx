import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Container, Card, Flex, Heading, Text, TextField, Button, Box, IconButton, Callout } from '@radix-ui/themes'
import { LockClosedIcon, SunIcon, MoonIcon, EyeOpenIcon, EyeClosedIcon, CheckCircledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { useTheme } from '../../lib/theme-context'
import { validatePassword, validatePasswordMatch } from '../../lib/validation'
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator'

export default function ResetPassword() {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const passwordError = validatePassword(formData.password)
    const confirmPasswordError = validatePasswordMatch(formData.password, formData.confirmPassword)
    
    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError || undefined,
        confirmPassword: confirmPasswordError || undefined,
      })
      return
    }
    
    if (!token) {
      setErrors({ general: 'Invalid or expired reset link' })
      return
    }
    
    setErrors({})
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    setIsSubmitted(true)
    
    // Redirect to login after 3 seconds
    setTimeout(() => {
      navigate('/login')
    }, 3000)
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
              <Flex direction="column" align="center" gap="2" mb="4">
                <Heading size="6">Reset your password</Heading>
                <Text color="gray" align="center">
                  Enter your new password below
                </Text>
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
                    New Password
                  </Text>
                  <TextField.Root 
                    placeholder="Enter new password" 
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                  <PasswordStrengthIndicator password={formData.password} />
                </Box>

                <Box>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '4px' }}>
                    Confirm New Password
                  </Text>
                  <TextField.Root 
                    placeholder="Confirm new password" 
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    color={errors.confirmPassword ? "red" : undefined}
                    variant={errors.confirmPassword ? "soft" : undefined}
                  >
                    <TextField.Slot>
                      <LockClosedIcon height="16" width="16" />
                    </TextField.Slot>
                    <TextField.Slot side="right">
                      <IconButton
                        size="1"
                        variant="ghost"
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                      </IconButton>
                    </TextField.Slot>
                  </TextField.Root>
                  {errors.confirmPassword && (
                    <Text size="1" color="red" mt="1">{errors.confirmPassword}</Text>
                  )}
                </Box>
              </Flex>

              <Button size="3" type="submit" loading={isLoading}>
                Reset Password
              </Button>

              <Flex justify="center" gap="1">
                <Text size="2" color="gray">
                  Remember your password?
                </Text>
                <Link to="/login">
                  <Text size="2" color="blue" style={{ textDecoration: 'none' }}>
                    Sign in
                  </Text>
                </Link>
              </Flex>
            </Flex>
          </form>
        ) : (
          <Flex direction="column" gap="4" align="center">
            <Flex direction="column" align="center" gap="3" mb="4">
              <Box style={{ color: 'var(--green-9)' }}>
                <CheckCircledIcon width="48" height="48" />
              </Box>
              <Heading size="6">Password reset successful</Heading>
              <Text color="gray" align="center">
                Your password has been reset successfully. Redirecting you to login...
              </Text>
            </Flex>

            <Button size="3" asChild style={{ width: '100%' }}>
              <Link to="/login">Go to login</Link>
            </Button>
          </Flex>
        )}
      </Card>
    </Container>
  )
}