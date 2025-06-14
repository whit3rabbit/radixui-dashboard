/**
 * @file PasswordStrengthIndicator.tsx
 * @description This file defines a component that displays the strength of a password.
 * It provides visual feedback (a colored bar and text) based on the password's complexity.
 */
import { Flex, Text, Box } from '@radix-ui/themes'
import { validatePasswordStrength } from '../lib/validation'

/**
 * @interface PasswordStrengthIndicatorProps
 * @description Defines the props for the PasswordStrengthIndicator component.
 * @property {string} password - The password string to evaluate.
 */
interface PasswordStrengthIndicatorProps {
  password: string;
}

/**
 * @function PasswordStrengthIndicator
 * @description A component that visually indicates the strength of a given password.
 * It uses the `validatePasswordStrength` function to assess the password and displays
 * a strength bar, a strength label (Weak, Medium, Strong), and optional feedback.
 * Returns null if no password is provided.
 * @param {PasswordStrengthIndicatorProps} props - The props for the component.
 * @returns {JSX.Element | null} The rendered password strength indicator or null.
 */
export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const { score, feedback, strength } = validatePasswordStrength(password);
  
  const strengthColors = {
    weak: 'red',
    medium: 'orange',
    strong: 'green'
  };
  
  const strengthLabels = {
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong'
  };
  
  return (
    <Box mt="2">
      <Flex gap="1" mb="1">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Box
            key={index}
            style={{
              height: '3px',
              flex: 1,
              backgroundColor: index <= score 
                ? `var(--${strengthColors[strength]}-9)` 
                : 'var(--gray-6)',
              borderRadius: '2px',
              transition: 'background-color 0.3s ease'
            }}
          />
        ))}
      </Flex>
      <Flex justify="between" align="center">
        <Text size="1" color={strengthColors[strength] as any}>
          {strengthLabels[strength]}
        </Text>
        {feedback && (
          <Text size="1" color="gray">
            {feedback}
          </Text>
        )}
      </Flex>
    </Box>
  );
}