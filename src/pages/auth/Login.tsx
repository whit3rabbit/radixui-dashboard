/**
 * @file Login.tsx
 * @description This file defines the Login page component.
 * It allows users to sign in using their email and password.
 * It includes form validation, handles login attempts, displays errors,
 * and provides links for password recovery and registration.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Card, Flex, Heading, Text, TextField, Button, Separator, Box, IconButton, Callout } from '@radix-ui/themes'
import { EnvelopeClosedIcon, LockClosedIcon, SunIcon, MoonIcon, EyeOpenIcon, EyeClosedIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { useTheme } from '../../lib/theme-context'
import { useAuth } from '../../lib/auth-context'
import { validateEmail, validatePassword } from '../../lib/validation' // Validation utilities

/**
 * @typedef LoginErrors
 * @description Defines the structure for storing login form errors.
 * @property {string} [email] - Error message for the email field.
 * @property {string} [password] - Error message for the password field.
 * @property {string} [general] - General error message (e.g., from API response).
 */
type LoginErrors = {
  email?: string;
  password?: string;
  general?: string;
};

/**
 * @function Login
 * @description A component that renders the login page.
 * It includes a form for email and password, handles form submission,
 * validates input, calls the login function from `AuthContext`, and navigates
 * to the dashboard on successful login or displays errors.
 * @returns {JSX.Element} The rendered Login page.
 */
export default function Login() {
  const { theme, toggleTheme } = useTheme(); // Theme context for light/dark mode toggle
  const { login } = useAuth(); // Auth context for login functionality
  const navigate = useNavigate(); // React Router hook for navigation

  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [isLoading, setIsLoading] = useState(false); // State to manage loading status during login
  const [errors, setErrors] = useState<LoginErrors>({}); // State for storing form errors

  /**
   * @function handleSubmit
   * @description Handles the login form submission.
   * It validates email and password, calls the login function, and handles the response.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Validate fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError || undefined,
        password: passwordError || undefined,
      });
      return; // Stop submission if validation fails
    }

    setErrors({}); // Clear previous errors
    setIsLoading(true); // Set loading state

    const result = await login(email, password); // Attempt login

    if (result.success) {
      navigate('/dashboard'); // Navigate to dashboard on successful login
    } else {
      // Set general error from login attempt (e.g., "Invalid credentials")
      setErrors({ general: result.error });
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <Flex align="center" justify="center" style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Theme Toggle */}
      <IconButton 
        size="3" 
        variant="ghost" 
        onClick={toggleTheme}
        style={{ position: 'absolute', top: '20px', right: '20px' }} // Absolute positioning fine here
      >
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      </IconButton>
      
      <Container size="1"> {/* Container for width constraint */}
        <Card size="4" style={{ width: '100%' }} maxWidth="400px"> {/* Card takes full width of container, but max width */}
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
                <Text as="div" size="2" weight="medium" mb="1"> {/* display: 'block', marginBottom: '4px' */}
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
                  <Link to="/forgot-password" asChild>
                    <Text size="1" color="gray" style={{ cursor: 'pointer' }}>Forgot password?</Text>
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

            <Button size="3" mt="2" type="submit" loading={isLoading}> {/* marginTop: '8px' -> mt="2" */}
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
              <Link to="/register" asChild>
                <Text size="2" color="blue" style={{ cursor: 'pointer' }}> {/* Removed textDecoration, added cursor */}
                  Sign up
                </Text>
              </Link>
            </Flex>
          </Flex>
        </form>
        </Card>
      </Container>
    </Flex>
  )
}