import React from 'react';
import { 
  TextField, 
  TextArea, 
  Select, 
  Checkbox, 
  Switch,
  Flex, 
  Text, 
  Box,
  Callout
} from '@radix-ui/themes';
import { ExclamationTriangleIcon, CheckIcon } from '@radix-ui/react-icons';

// Base form field props
interface BaseFieldProps {
  label?: string;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  id?: string;
}

// Enhanced TextField with validation states
interface EnhancedTextFieldProps extends BaseFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  size?: '1' | '2' | '3';
  variant?: 'classic' | 'surface' | 'soft';
  maxLength?: number;
  autoComplete?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export function EnhancedTextField({
  label,
  error,
  success,
  required,
  disabled,
  helperText,
  id,
  leftSlot,
  rightSlot,
  ...fieldProps
}: EnhancedTextFieldProps) {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <Flex direction="column" gap="2">
      {label && (
        <Text as="label" htmlFor={fieldId} size="2" weight="medium">
          {label}
          {required && <Text color="red"> *</Text>}
        </Text>
      )}
      
      <TextField.Root
        id={fieldId}
        color={error ? 'red' : success ? 'green' : undefined}
        disabled={disabled}
        {...fieldProps}
      >
        {leftSlot && <TextField.Slot>{leftSlot}</TextField.Slot>}
        {rightSlot && <TextField.Slot side="right">{rightSlot}</TextField.Slot>}
      </TextField.Root>
      
      {(error || success || helperText) && (
        <Box>
          {error && (
            <Callout.Root color="red" size="1">
              <Callout.Icon>
                <ExclamationTriangleIcon />
              </Callout.Icon>
              <Callout.Text>
                <Text size="1">{error}</Text>
              </Callout.Text>
            </Callout.Root>
          )}
          
          {success && !error && (
            <Callout.Root color="green" size="1">
              <Callout.Icon>
                <CheckIcon />
              </Callout.Icon>
              <Callout.Text>
                <Text size="1">{success}</Text>
              </Callout.Text>
            </Callout.Root>
          )}
          
          {helperText && !error && !success && (
            <Text size="1" color="gray">
              {helperText}
            </Text>
          )}
        </Box>
      )}
    </Flex>
  );
}

// Enhanced TextArea
interface EnhancedTextAreaProps extends BaseFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  resize?: 'both' | 'horizontal' | 'vertical' | 'none';
  maxLength?: number;
}

export function EnhancedTextArea({
  label,
  error,
  success,
  required,
  disabled,
  helperText,
  id,
  ...fieldProps
}: EnhancedTextAreaProps) {
  const fieldId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <Flex direction="column" gap="2">
      {label && (
        <Text as="label" htmlFor={fieldId} size="2" weight="medium">
          {label}
          {required && <Text color="red"> *</Text>}
        </Text>
      )}
      
      <TextArea
        id={fieldId}
        color={error ? 'red' : success ? 'green' : undefined}
        disabled={disabled}
        {...fieldProps}
      />
      
      {(error || success || helperText) && (
        <Box>
          {error && (
            <Text size="1" color="red">
              {error}
            </Text>
          )}
          
          {success && !error && (
            <Text size="1" color="green">
              {success}
            </Text>
          )}
          
          {helperText && !error && !success && (
            <Text size="1" color="gray">
              {helperText}
            </Text>
          )}
        </Box>
      )}
    </Flex>
  );
}

// Enhanced Select
interface EnhancedSelectProps extends BaseFieldProps {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  size?: '1' | '2' | '3';
}

export function EnhancedSelect({
  label,
  error,
  success,
  required,
  disabled,
  helperText,
  id,
  options,
  placeholder,
  ...fieldProps
}: EnhancedSelectProps) {
  const fieldId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <Flex direction="column" gap="2">
      {label && (
        <Text as="label" htmlFor={fieldId} size="2" weight="medium">
          {label}
          {required && <Text color="red"> *</Text>}
        </Text>
      )}
      
      <Select.Root disabled={disabled} {...fieldProps}>
        <Select.Trigger
          id={fieldId}
          placeholder={placeholder}
          color={error ? 'red' : success ? 'green' : undefined}
        />
        <Select.Content>
          {options.map((option) => (
            <Select.Item
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      
      {(error || success || helperText) && (
        <Box>
          {error && (
            <Text size="1" color="red">
              {error}
            </Text>
          )}
          
          {success && !error && (
            <Text size="1" color="green">
              {success}
            </Text>
          )}
          
          {helperText && !error && !success && (
            <Text size="1" color="gray">
              {helperText}
            </Text>
          )}
        </Box>
      )}
    </Flex>
  );
}

// Enhanced Checkbox
interface EnhancedCheckboxProps extends BaseFieldProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: '1' | '2' | '3';
}

export function EnhancedCheckbox({
  label,
  error,
  success,
  required,
  disabled,
  helperText,
  id,
  ...fieldProps
}: EnhancedCheckboxProps) {
  const fieldId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <Flex direction="column" gap="2">
      <Flex align="center" gap="2">
        <Checkbox
          id={fieldId}
          color={error ? 'red' : success ? 'green' : undefined}
          disabled={disabled}
          {...fieldProps}
        />
        {label && (
          <Text as="label" htmlFor={fieldId} size="2">
            {label}
            {required && <Text color="red"> *</Text>}
          </Text>
        )}
      </Flex>
      
      {(error || success || helperText) && (
        <Box>
          {error && (
            <Text size="1" color="red">
              {error}
            </Text>
          )}
          
          {success && !error && (
            <Text size="1" color="green">
              {success}
            </Text>
          )}
          
          {helperText && !error && !success && (
            <Text size="1" color="gray">
              {helperText}
            </Text>
          )}
        </Box>
      )}
    </Flex>
  );
}

// Enhanced Switch
interface EnhancedSwitchProps extends BaseFieldProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: '1' | '2' | '3';
}

export function EnhancedSwitch({
  label,
  error,
  success,
  required,
  disabled,
  helperText,
  id,
  ...fieldProps
}: EnhancedSwitchProps) {
  const fieldId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <Flex direction="column" gap="2">
      <Flex align="center" gap="2">
        <Switch
          id={fieldId}
          color={error ? 'red' : success ? 'green' : undefined}
          disabled={disabled}
          {...fieldProps}
        />
        {label && (
          <Text as="label" htmlFor={fieldId} size="2">
            {label}
            {required && <Text color="red"> *</Text>}
          </Text>
        )}
      </Flex>
      
      {(error || success || helperText) && (
        <Box>
          {error && (
            <Text size="1" color="red">
              {error}
            </Text>
          )}
          
          {success && !error && (
            <Text size="1" color="green">
              {success}
            </Text>
          )}
          
          {helperText && !error && !success && (
            <Text size="1" color="gray">
              {helperText}
            </Text>
          )}
        </Box>
      )}
    </Flex>
  );
}

// Form validation utilities
// eslint-disable-next-line react-refresh/only-export-components
export const validators = {
  required: (value: any) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return undefined;
  },
  
  email: (value: string) => {
    if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  },
  
  minLength: (min: number) => (value: string) => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return undefined;
  },
  
  maxLength: (max: number) => (value: string) => {
    if (value && value.length > max) {
      return `Must be no more than ${max} characters long`;
    }
    return undefined;
  },
  
  pattern: (pattern: RegExp, message: string) => (value: string) => {
    if (value && !pattern.test(value)) {
      return message;
    }
    return undefined;
  }
};

// Utility to run multiple validators
// eslint-disable-next-line react-refresh/only-export-components
export function validateField(value: any, validators: Array<(value: any) => string | undefined>) {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return undefined;
}

export default {
  EnhancedTextField,
  EnhancedTextArea,
  EnhancedSelect,
  EnhancedCheckbox,
  EnhancedSwitch,
  validators,
  validateField
};