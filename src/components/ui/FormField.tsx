/**
 * @file FormField.tsx
 * @description This file defines a collection of enhanced form field components
 * built on top of Radix UI themes. It includes components like EnhancedTextField,
 * EnhancedTextArea, EnhancedSelect, EnhancedCheckbox, and EnhancedSwitch.
 * Each component supports common features like labels, error/success states,
 * helper text, and integrates with a set of validation utilities.
 */
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

/**
 * @interface BaseFieldProps
 * @description Defines common props applicable to all enhanced form field components.
 * @property {string} [label] - The label text for the form field.
 * @property {string} [error] - An error message to display for the field. Activates error styling.
 * @property {string} [success] - A success message to display for the field. Activates success styling.
 * @property {boolean} [required=false] - Whether the field is required. Displays an asterisk next to the label.
 * @property {boolean} [disabled=false] - Whether the field is disabled.
 * @property {string} [helperText] - Additional helper text to display below the field.
 * @property {string} [id] - The HTML ID for the input element. Auto-generated if not provided.
 */
interface BaseFieldProps {
  label?: string;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  id?: string;
}

/**
 * @interface EnhancedTextFieldProps
 * @extends BaseFieldProps
 * @description Defines the props for the EnhancedTextField component.
 * @property {string} [placeholder] - Placeholder text for the input.
 * @property {string} [value] - The current value of the input.
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} [onChange] - Callback for value changes.
 * @property {'text' | 'email' | 'password' | 'number' | 'tel' | 'url'} [type='text'] - The type of the input.
 * @property {'1' | '2' | '3'} [size] - The size of the text field (from Radix UI).
 * @property {'classic' | 'surface' | 'soft'} [variant] - The visual variant of the text field.
 * @property {number} [maxLength] - Maximum allowed input length.
 * @property {string} [autoComplete] - HTML autocomplete attribute.
 * @property {React.ReactNode} [leftSlot] - Content to render in the left slot of the TextField.
 * @property {React.ReactNode} [rightSlot] - Content to render in the right slot of the TextField.
 */
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

/**
 * @function EnhancedTextField
 * @description An enhanced text input field component with integrated label, error/success messages,
 * helper text, and Radix UI styling.
 * @param {EnhancedTextFieldProps} props - The props for the component.
 * @returns {JSX.Element} The rendered EnhancedTextField.
 */
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

/**
 * @interface EnhancedTextAreaProps
 * @extends BaseFieldProps
 * @description Defines the props for the EnhancedTextArea component.
 * @property {string} [placeholder] - Placeholder text for the textarea.
 * @property {string} [value] - The current value of the textarea.
 * @property {(e: React.ChangeEvent<HTMLTextAreaElement>) => void} [onChange] - Callback for value changes.
 * @property {number} [rows] - The number of visible text lines.
 * @property {'both' | 'horizontal' | 'vertical' | 'none'} [resize] - Controls the resizability of the textarea.
 * @property {number} [maxLength] - Maximum allowed input length.
 */
interface EnhancedTextAreaProps extends BaseFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  resize?: 'both' | 'horizontal' | 'vertical' | 'none';
  maxLength?: number;
}

/**
 * @function EnhancedTextArea
 * @description An enhanced textarea component with integrated label, error/success messages,
 * and helper text.
 * @param {EnhancedTextAreaProps} props - The props for the component.
 * @returns {JSX.Element} The rendered EnhancedTextArea.
 */
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

/**
 * @interface EnhancedSelectProps
 * @extends BaseFieldProps
 * @description Defines the props for the EnhancedSelect component.
 * @property {string} [placeholder] - Placeholder text for the select trigger.
 * @property {string} [value] - The currently selected value.
 * @property {(value: string) => void} [onValueChange] - Callback when the selected value changes.
 * @property {Array<{ value: string; label: string; disabled?: boolean }>} options - Array of options to display.
 * @property {'1' | '2' | '3'} [size] - The size of the select component.
 */
interface EnhancedSelectProps extends BaseFieldProps {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  size?: '1' | '2' | '3';
}

/**
 * @function EnhancedSelect
 * @description An enhanced select (dropdown) component with integrated label, error/success messages,
 * and helper text.
 * @param {EnhancedSelectProps} props - The props for the component.
 * @returns {JSX.Element} The rendered EnhancedSelect.
 */
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

/**
 * @interface EnhancedCheckboxProps
 * @extends BaseFieldProps
 * @description Defines the props for the EnhancedCheckbox component.
 * @property {boolean} [checked] - Whether the checkbox is currently checked.
 * @property {(checked: boolean) => void} [onCheckedChange] - Callback when the checked state changes.
 * @property {'1' | '2' | '3'} [size] - The size of the checkbox.
 */
interface EnhancedCheckboxProps extends BaseFieldProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: '1' | '2' | '3';
}

/**
 * @function EnhancedCheckbox
 * @description An enhanced checkbox component with integrated label, error/success messages,
 * and helper text.
 * @param {EnhancedCheckboxProps} props - The props for the component.
 * @returns {JSX.Element} The rendered EnhancedCheckbox.
 */
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

/**
 * @interface EnhancedSwitchProps
 * @extends BaseFieldProps
 * @description Defines the props for the EnhancedSwitch component.
 * @property {boolean} [checked] - Whether the switch is currently on (checked).
 * @property {(checked: boolean) => void} [onCheckedChange] - Callback when the checked state changes.
 * @property {'1' | '2' | '3'} [size] - The size of the switch.
 */
interface EnhancedSwitchProps extends BaseFieldProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: '1' | '2' | '3';
}

/**
 * @function EnhancedSwitch
 * @description An enhanced switch (toggle) component with integrated label, error/success messages,
 * and helper text.
 * @param {EnhancedSwitchProps} props - The props for the component.
 * @returns {JSX.Element} The rendered EnhancedSwitch.
 */
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

/**
 * @const validators
 * @description A collection of common validation functions.
 * Each validator function takes a value and returns an error message string if validation fails,
 * or undefined if it passes.
 * @property {(value: any) => string | undefined} required - Checks if a value is present.
 * @property {(value: string) => string | undefined} email - Validates email format.
 * @property {(min: number) => (value: string) => string | undefined} minLength - Checks for minimum string length.
 * @property {(max: number) => (value: string) => string | undefined} maxLength - Checks for maximum string length.
 * @property {(pattern: RegExp, message: string) => (value: string) => string | undefined} pattern - Validates against a regex pattern.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const validators = {
  /**
   * @function required
   * @description Checks if a value is provided (not empty, null, or undefined).
   * @param {any} value - The value to validate.
   * @returns {string | undefined} Error message or undefined.
   */
  required: (value: any): string | undefined => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return undefined;
  },

  /**
   * @function email
   * @description Validates if a string is a valid email address.
   * @param {string} value - The email string to validate.
   * @returns {string | undefined} Error message or undefined.
   */
  email: (value: string): string | undefined => {
    if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  },

  /**
   * @function minLength
   * @description Creates a validator to check if a string meets a minimum length.
   * @param {number} min - The minimum required length.
   * @returns {(value: string) => string | undefined} A validator function.
   */
  minLength: (min: number) => (value: string): string | undefined => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return undefined;
  },

  /**
   * @function maxLength
   * @description Creates a validator to check if a string does not exceed a maximum length.
   * @param {number} max - The maximum allowed length.
   * @returns {(value: string) => string | undefined} A validator function.
   */
  maxLength: (max: number) => (value: string): string | undefined => {
    if (value && value.length > max) {
      return `Must be no more than ${max} characters long`;
    }
    return undefined;
  },

  /**
   * @function pattern
   * @description Creates a validator to check if a string matches a regular expression.
   * @param {RegExp} pattern - The regular expression to test against.
   * @param {string} message - The error message to return if the pattern does not match.
   * @returns {(value: string) => string | undefined} A validator function.
   */
  pattern: (pattern: RegExp, message: string) => (value: string): string | undefined => {
    if (value && !pattern.test(value)) {
      return message;
    }
    return undefined;
  }
};

/**
 * @function validateField
 * @description Utility function to run a series of validators against a value.
 * It returns the first error message encountered, or undefined if all validators pass.
 * @param {any} value - The value to validate.
 * @param {Array<(value: any) => string | undefined>} validators - An array of validator functions.
 * @returns {string | undefined} The first error message, or undefined if valid.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function validateField(value: any, validators: Array<(value: any) => string | undefined>): string | undefined {
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