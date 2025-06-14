import { Flex, Text, Box } from '@radix-ui/themes'
import { validatePasswordStrength } from '../lib/validation'

interface PasswordStrengthIndicatorProps {
  password: string;
}

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