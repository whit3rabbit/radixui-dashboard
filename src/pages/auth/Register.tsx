/**
 * @file Register.tsx
 * @description This file defines the Register page component.
 * It allows new users to create an account by providing their name, email, and password.
 * It includes form validation, password strength indication, terms agreement,
 * and handles the registration process.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Card, Flex, Heading, Text, TextField, Button, Separator, Box, IconButton, Callout, Checkbox } from '@radix-ui/themes'
import { EnvelopeClosedIcon, LockClosedIcon, PersonIcon, SunIcon, MoonIcon, EyeOpenIcon, EyeClosedIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { useTheme } from '../../lib/theme-context'
import { useAuth } from '../../lib/auth-context'
import { validateEmail, validatePassword, validatePasswordMatch, validateName } from '../../lib/validation' // Validation utilities
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator' // Component to show password strength

/**
 * @typedef RegisterFormData
 * @description Defines the structure for the registration form data.
 * @property {string} name - User's full name.
 * @property {string} email - User's email address.
 * @property {string} password - User's chosen password.
 * @property {string} confirmPassword - Confirmation of the password.
 * @property {boolean} agreeToTerms - Whether the user has agreed to terms and conditions.
 */
type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
};

/**
 * @typedef RegisterErrors
 * @description Defines the structure for storing registration form errors.
 * @property {string} [name] - Error message for the name field.
 * @property {string} [email] - Error message for the email field.
 * @property {string} [password] - Error message for the password field.
 * @property {string} [confirmPassword] - Error message for the confirm password field.
 * @property {string} [agreeToTerms] - Error message for the terms agreement checkbox.
 * @property {string} [general] - General error message (e.g., from API response).
 */
type RegisterErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
};

/**
 * @function Register
 * @description A component that renders the registration page.
 * It includes a form for user details, validates input, shows password strength,
 * handles terms agreement, calls the register function from `AuthContext`,
 * and navigates to the dashboard on successful registration or displays errors.
 * @returns {JSX.Element} The rendered Register page.
 */
export default function Register() {
  const { theme, toggleTheme } = useTheme(); // Theme context for light/dark mode
  const { register } = useAuth(); // Auth context for registration functionality
  const navigate = useNavigate(); // React Router hook for navigation

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false); // Toggle visibility for password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle visibility for confirm password
  const [isLoading, setIsLoading] = useState(false); // Manage loading state during registration
  const [errors, setErrors] = useState<RegisterErrors>({}); // Store form validation errors

  /**
   * @function handleSubmit
   * @description Handles the registration form submission.
   * It validates all form fields, calls the register function, and handles the response.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validatePasswordMatch(formData.password, formData.confirmPassword);
    const agreeToTermsError = !formData.agreeToTerms ? 'You must agree to the terms and conditions' : null;

    if (nameError || emailError || passwordError || confirmPasswordError || agreeToTermsError) {
      setErrors({
        name: nameError || undefined,
        email: emailError || undefined,
        password: passwordError || undefined,
        confirmPassword: confirmPasswordError || undefined,
        agreeToTerms: agreeToTermsError || undefined,
      });
      return; // Stop submission if validation fails
    }

    setErrors({}); // Clear previous errors
    setIsLoading(true); // Set loading state

    const result = await register(formData.email, formData.password, formData.name); // Attempt registration

    if (result.success) {
      navigate('/dashboard'); // Navigate to dashboard on successful registration
    } else {
      // Set general error from registration attempt
      setErrors({ general: result.error });
      setIsLoading(false); // Reset loading state
    }
  };

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
              <Heading size="6">Create account</Heading>
              <Text color="gray">Get started with your free account</Text>
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
                  Full Name
                </Text>
                <TextField.Root 
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  color={errors.name ? "red" : undefined}
                  variant={errors.name ? "soft" : undefined}
                >
                  <TextField.Slot>
                    <PersonIcon height="16" width="16" />
                  </TextField.Slot>
                </TextField.Root>
                {errors.name && (
                  <Text size="1" color="red" mt="1">{errors.name}</Text>
                )}
              </Box>

              <Box>
                <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '4px' }}>
                  Email
                </Text>
                <TextField.Root 
                  placeholder="Enter your email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '4px' }}>
                  Password
                </Text>
                <TextField.Root 
                  placeholder="Create a password" 
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
                  Confirm Password
                </Text>
                <TextField.Root 
                  placeholder="Confirm your password" 
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

              <Flex align="center" gap="2">
                <Checkbox 
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData({...formData, agreeToTerms: checked as boolean})}
                />
                <Text size="2">
                  I agree to the{' '}
                  <Link to="/terms" style={{ textDecoration: 'none' }}>
                    <Text size="2" color="blue">Terms and Conditions</Text>
                  </Link>
                </Text>
              </Flex>
              {errors.agreeToTerms && (
                <Text size="1" color="red" mt="-2">{errors.agreeToTerms}</Text>
              )}
            </Flex>

            <Button size="3" style={{ marginTop: '8px' }} type="submit" loading={isLoading}>
              Create Account
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
                Already have an account?
              </Text>
              <Link to="/login">
                <Text size="2" color="blue" style={{ textDecoration: 'none' }}>
                  Sign in
                </Text>
              </Link>
            </Flex>
          </Flex>
        </form>
      </Card>
    </Container>
  )
}