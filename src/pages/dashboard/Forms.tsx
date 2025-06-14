/**
 * @file Forms.tsx
 * @description This file defines the Forms page component for the dashboard.
 * It serves as a comprehensive showcase of various form elements, input types,
 * selection controls, and form layouts available within the application,
 * primarily utilizing Radix UI theme components.
 * It demonstrates the look and feel and basic state management for these components.
 */
import { useState } from 'react'
import {
  Box,
  Card,
  Flex,
  Heading, 
  Text, 
  TextField, 
  TextArea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  Slider,
  Button,
  Badge,
  Separator,
  Grid
} from '@radix-ui/themes'
import { 
  MagnifyingGlassIcon,
  EnvelopeClosedIcon,
  LockClosedIcon,
  UploadIcon,
  CheckCircledIcon
} from '@radix-ui/react-icons'

/**
 * @typedef MultiStepFormData
 * @description Defines the structure for the data collected in the multi-step form example.
 * @property {string} firstName - User's first name.
 * @property {string} lastName - User's last name.
 * @property {string} email - User's email address.
 * @property {string} company - User's company name.
 * @property {string} role - User's role in the company.
 * @property {boolean} notifications - Whether the user opts into notifications.
 */
type MultiStepFormData = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  notifications: boolean;
};

/**
 * @function Forms
 * @description The main component for the Forms showcase page.
 * It displays a variety of form components and layouts with their basic states managed.
 * This page is intended for demonstration and testing of form elements.
 * @returns {JSX.Element} The rendered Forms page.
 */
export default function Forms() {
  // --- State for Basic Input Examples ---
  const [textValue, setTextValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('')
  const [textAreaValue, setTextAreaValue] = useState('');
  const [selectValue, setSelectValue] = useState('option1'); // Default value for a select example
  const [checkboxValue, setCheckboxValue] = useState(false); // State for a controlled checkbox
  const [radioValue, setRadioValue] = useState('1'); // State for a controlled radio group
  const [switchValue, setSwitchValue] = useState(false); // State for a controlled switch
  const [sliderValue, setSliderValue] = useState([50]); // State for a controlled slider

  // --- State for Multi-Step Form Example ---
  const [currentStep, setCurrentStep] = useState(1); // Current active step in the multi-step form
  const [formData, setFormData] = useState<MultiStepFormData>({ // Data collected across steps
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    notifications: true
  })

  return (
    <Box>
      <Flex direction="column" gap="6">
        <Box>
          <Heading size="8" mb="2">Form Components</Heading>
          <Text color="gray">Comprehensive showcase of form components and patterns</Text>
        </Box>

        {/* Basic Inputs */}
        <Card>
          <Heading size="4" mb="4">Basic Inputs</Heading>
          <Grid columns={{ initial: '1', md: '2' }} gap="4">
            <Box>
              <Text size="2" weight="medium" mb="2">Text Input</Text>
              <TextField.Root 
                placeholder="Enter text..."
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
              />
              <Text size="1" color="gray" mt="1">Basic text input field</Text>
            </Box>

            <Box>
              <Text size="2" weight="medium" mb="2">With Icon</Text>
              <TextField.Root placeholder="Search...">
                <TextField.Slot>
                  <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>
              <Text size="1" color="gray" mt="1">Input with leading icon</Text>
            </Box>

            <Box>
              <Text size="2" weight="medium" mb="2">Email Input</Text>
              <TextField.Root 
                type="email"
                placeholder="email@example.com"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
              >
                <TextField.Slot>
                  <EnvelopeClosedIcon height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>
              <Text size="1" color="gray" mt="1">Email input with validation</Text>
            </Box>

            <Box>
              <Text size="2" weight="medium" mb="2">Password Input</Text>
              <TextField.Root 
                type="password"
                placeholder="Enter password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
              >
                <TextField.Slot>
                  <LockClosedIcon height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>
              <Text size="1" color="gray" mt="1">Password input field</Text>
            </Box>

            <Box>
              <Text size="2" weight="medium" mb="2">Disabled Input</Text>
              <TextField.Root 
                placeholder="Disabled field"
                disabled
              />
              <Text size="1" color="gray" mt="1">Disabled state example</Text>
            </Box>

            <Box>
              <Text size="2" weight="medium" mb="2">Error State</Text>
              <TextField.Root 
                placeholder="Invalid input"
                color="red"
                variant="soft"
                defaultValue="Invalid data"
              />
              <Text size="1" color="red" mt="1">This field has an error</Text>
            </Box>
          </Grid>
        </Card>

        {/* Text Areas */}
        <Card>
          <Heading size="4" mb="4">Text Areas</Heading>
          <Grid columns={{ initial: '1', md: '2' }} gap="4">
            <Box>
              <Text size="2" weight="medium" mb="2">Basic Textarea</Text>
              <TextArea 
                placeholder="Enter your message..."
                value={textAreaValue}
                onChange={(e) => setTextAreaValue(e.target.value)}
                minHeight="100px"
              />
              <Text size="1" color="gray" mt="1">
                {textAreaValue.length}/500 characters
              </Text>
            </Box>

            <Box>
              <Text size="2" weight="medium" mb="2">Resizable Textarea</Text>
              <TextArea 
                placeholder="This textarea can be resized..."
                resize="vertical"
                minHeight="100px"
              />
              <Text size="1" color="gray" mt="1">Drag corner to resize</Text>
            </Box>
          </Grid>
        </Card>

        {/* Selects and Dropdowns */}
        <Card>
          <Heading size="4" mb="4">Selects and Dropdowns</Heading>
          <Grid columns={{ initial: '1', md: '3' }} gap="4">
            <Box>
              <Text size="2" weight="medium" mb="2">Basic Select</Text>
              <Select.Root value={selectValue} onValueChange={setSelectValue}>
                <Select.Trigger placeholder="Select an option" />
                <Select.Content>
                  <Select.Item value="option1">Option 1</Select.Item>
                  <Select.Item value="option2">Option 2</Select.Item>
                  <Select.Item value="option3">Option 3</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            <Box>
              <Text size="2" weight="medium" mb="2">Select with Groups</Text>
              <Select.Root>
                <Select.Trigger placeholder="Choose a fruit" />
                <Select.Content>
                  <Select.Group>
                    <Select.Label>Citrus</Select.Label>
                    <Select.Item value="orange">Orange</Select.Item>
                    <Select.Item value="lemon">Lemon</Select.Item>
                    <Select.Item value="lime">Lime</Select.Item>
                  </Select.Group>
                  <Select.Separator />
                  <Select.Group>
                    <Select.Label>Berries</Select.Label>
                    <Select.Item value="strawberry">Strawberry</Select.Item>
                    <Select.Item value="blueberry">Blueberry</Select.Item>
                    <Select.Item value="raspberry">Raspberry</Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </Box>

            <Box>
              <Text size="2" weight="medium" mb="2">Disabled Select</Text>
              <Select.Root disabled>
                <Select.Trigger placeholder="Disabled select" />
                <Select.Content>
                  <Select.Item value="option1">Option 1</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
          </Grid>
        </Card>

        {/* Checkboxes and Radio Groups */}
        <Card>
          <Heading size="4" mb="4">Checkboxes and Radio Groups</Heading>
          <Grid columns={{ initial: '1', md: '2' }} gap="6">
            <Box>
              <Text size="2" weight="medium" mb="3">Checkboxes</Text>
              <Flex direction="column" gap="3">
                <Flex align="center" gap="2">
                  <Checkbox 
                    checked={checkboxValue}
                    onCheckedChange={(checked) => setCheckboxValue(checked as boolean)}
                  />
                  <Text size="2">I agree to the terms and conditions</Text>
                </Flex>
                <Flex align="center" gap="2">
                  <Checkbox defaultChecked />
                  <Text size="2">Send me promotional emails</Text>
                </Flex>
                <Flex align="center" gap="2">
                  <Checkbox disabled />
                  <Text size="2" color="gray">Disabled checkbox</Text>
                </Flex>
              </Flex>
            </Box>

            <Box>
              <Text size="2" weight="medium" mb="3">Radio Group</Text>
              <RadioGroup.Root value={radioValue} onValueChange={setRadioValue}>
                <Flex direction="column" gap="2">
                  <Flex align="center" gap="2">
                    <RadioGroup.Item value="1" />
                    <Text size="2">Option 1</Text>
                  </Flex>
                  <Flex align="center" gap="2">
                    <RadioGroup.Item value="2" />
                    <Text size="2">Option 2</Text>
                  </Flex>
                  <Flex align="center" gap="2">
                    <RadioGroup.Item value="3" />
                    <Text size="2">Option 3</Text>
                  </Flex>
                </Flex>
              </RadioGroup.Root>
            </Box>
          </Grid>
        </Card>

        {/* Switches and Sliders */}
        <Card>
          <Heading size="4" mb="4">Switches and Sliders</Heading>
          <Grid columns={{ initial: '1', md: '2' }} gap="6">
            <Box>
              <Text size="2" weight="medium" mb="3">Switches</Text>
              <Flex direction="column" gap="3">
                <Flex justify="between" align="center">
                  <Text size="2">Enable notifications</Text>
                  <Switch 
                    checked={switchValue}
                    onCheckedChange={setSwitchValue}
                  />
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2">Dark mode</Text>
                  <Switch defaultChecked />
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" color="gray">Disabled switch</Text>
                  <Switch disabled />
                </Flex>
              </Flex>
            </Box>

            <Box>
              <Text size="2" weight="medium" mb="3">Sliders</Text>
              <Flex direction="column" gap="4">
                <Box>
                  <Flex justify="between" mb="2">
                    <Text size="2">Volume</Text>
                    <Text size="2" color="gray">{sliderValue[0]}%</Text>
                  </Flex>
                  <Slider 
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    max={100}
                    step={1}
                  />
                </Box>
                <Box>
                  <Flex justify="between" mb="2">
                    <Text size="2">Brightness</Text>
                    <Text size="2" color="gray">75%</Text>
                  </Flex>
                  <Slider defaultValue={[75]} max={100} step={1} />
                </Box>
              </Flex>
            </Box>
          </Grid>
        </Card>

        {/* File Upload */}
        <Card>
          <Heading size="4" mb="4">File Upload</Heading>
          <Box
            p="6"
            style={{
              border: '2px dashed var(--gray-6)',
              borderRadius: 'var(--radius-3)',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <Flex direction="column" align="center" gap="3">
              <UploadIcon width="40" height="40" />
              <Box>
                <Text size="3" weight="medium">Click to upload or drag and drop</Text>
                <Text size="2" color="gray">SVG, PNG, JPG or GIF (max. 800x400px)</Text>
              </Box>
              <Button size="2" variant="soft">Choose File</Button>
            </Flex>
          </Box>
        </Card>

        {/* Multi-Step Form */}
        <Card>
          <Heading size="4" mb="4">Multi-Step Form Example</Heading>
          
          {/* Progress Steps */}
          <Flex gap="2" mb="6">
            {[1, 2, 3].map((step) => (
              <Flex key={step} align="center" style={{ flex: 1 }}>
                <Badge 
                  color={currentStep >= step ? 'blue' : 'gray'}
                  variant={currentStep === step ? 'solid' : 'soft'}
                  size="2"
                  radius="full" // borderRadius: '50%'
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {currentStep > step ? <CheckCircledIcon /> : step}
                </Badge>
                {step < 3 && (
                  <Box 
                    style={{ 
                      flex: 1, 
                      height: '2px', 
                      backgroundColor: currentStep > step ? 'var(--blue-9)' : 'var(--gray-6)',
                      marginLeft: '8px'
                    }} 
                  />
                )}
              </Flex>
            ))}
          </Flex>

          {/* Step Content */}
          <Box minHeight="200px">
            {currentStep === 1 && (
              <Flex direction="column" gap="4">
                <Heading size="3">Personal Information</Heading>
                <Grid columns="2" gap="4">
                  <TextField.Root 
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                  <TextField.Root 
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </Grid>
                <TextField.Root 
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </Flex>
            )}

            {currentStep === 2 && (
              <Flex direction="column" gap="4">
                <Heading size="3">Company Details</Heading>
                <TextField.Root 
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
                <Select.Root value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                  <Select.Trigger placeholder="Select your role" />
                  <Select.Content>
                    <Select.Item value="developer">Developer</Select.Item>
                    <Select.Item value="designer">Designer</Select.Item>
                    <Select.Item value="manager">Manager</Select.Item>
                    <Select.Item value="other">Other</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
            )}

            {currentStep === 3 && (
              <Flex direction="column" gap="4">
                <Heading size="3">Review & Confirm</Heading>
                <Box>
                  <Text size="2" color="gray">Name</Text>
                  <Text>{formData.firstName} {formData.lastName}</Text>
                </Box>
                <Box>
                  <Text size="2" color="gray">Email</Text>
                  <Text>{formData.email}</Text>
                </Box>
                <Box>
                  <Text size="2" color="gray">Company</Text>
                  <Text>{formData.company}</Text>
                </Box>
                <Box>
                  <Text size="2" color="gray">Role</Text>
                  <Text style={{ textTransform: 'capitalize' }}>{formData.role}</Text>
                </Box>
              </Flex>
            )}
          </Box>

          {/* Navigation Buttons */}
          <Flex justify="between" mt="6">
            <Button 
              variant="soft" 
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button 
              onClick={() => {
                if (currentStep < 3) {
                  setCurrentStep(prev => prev + 1)
                } else {
                  // Submit form
                  console.log('Form submitted:', formData)
                }
              }}
            >
              {currentStep === 3 ? 'Submit' : 'Next'}
            </Button>
          </Flex>
        </Card>

        {/* Form Layouts */}
        <Card>
          <Heading size="4" mb="4">Form Layouts</Heading>
          
          <Flex direction="column" gap="6">
            {/* Inline Form */}
            <Box>
              <Text size="2" weight="medium" mb="3">Inline Form</Text>
              <Flex gap="2" align="end">
                <Box style={{ flex: 1 }}>
                  <TextField.Root placeholder="Enter email address" />
                </Box>
                <Button>Subscribe</Button>
              </Flex>
            </Box>

            <Separator />

            {/* Stacked Form */}
            <Box>
              <Text size="2" weight="medium" mb="3">Stacked Form</Text>
              <Flex direction="column" gap="3" maxWidth="400px">
                <Box>
                  <Text size="2" weight="medium" mb="1">Username</Text>
                  <TextField.Root placeholder="Enter username" />
                </Box>
                <Box>
                  <Text size="2" weight="medium" mb="1">Password</Text>
                  <TextField.Root type="password" placeholder="Enter password" />
                </Box>
                <Flex align="center" gap="2">
                  <Checkbox />
                  <Text size="2">Remember me</Text>
                </Flex>
                <Button>Sign In</Button>
              </Flex>
            </Box>

            <Separator />

            {/* Multi-Column Form */}
            <Box>
              <Text size="2" weight="medium" mb="3">Multi-Column Form</Text>
              <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                <Box>
                  <Text size="2" weight="medium" mb="1">First Name</Text>
                  <TextField.Root placeholder="John" />
                </Box>
                <Box>
                  <Text size="2" weight="medium" mb="1">Last Name</Text>
                  <TextField.Root placeholder="Doe" />
                </Box>
                <Box>
                  <Text size="2" weight="medium" mb="1">Email</Text>
                  <TextField.Root type="email" placeholder="john@example.com" />
                </Box>
                <Box>
                  <Text size="2" weight="medium" mb="1">Phone</Text>
                  <TextField.Root type="tel" placeholder="+1 (555) 000-0000" />
                </Box>
                <Box style={{ gridColumn: 'span 2' }}>
                  <Text size="2" weight="medium" mb="1">Address</Text>
                  <TextField.Root placeholder="123 Main St" />
                </Box>
                <Box>
                  <Text size="2" weight="medium" mb="1">City</Text>
                  <TextField.Root placeholder="New York" />
                </Box>
                <Box>
                  <Text size="2" weight="medium" mb="1">State</Text>
                  <Select.Root>
                    <Select.Trigger placeholder="Select state" />
                    <Select.Content>
                      <Select.Item value="ny">New York</Select.Item>
                      <Select.Item value="ca">California</Select.Item>
                      <Select.Item value="tx">Texas</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>
              </Grid>
              <Button mt="4">Save Profile</Button>
            </Box>
          </Flex>
        </Card>
      </Flex>
    </Box>
  )
}