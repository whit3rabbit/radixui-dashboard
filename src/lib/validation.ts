/**
 * @file validation.ts
 * @description This file contains utility functions for validating common input types
 * such as emails, passwords, names, and password strength.
 */

/**
 * @const emailRegex
 * @description Regular expression for basic email validation.
 */
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @function validateEmail
 * @description Validates an email string.
 * @param {string} email - The email string to validate.
 * @returns {string | null} An error message if validation fails, or null if valid.
 */
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

/**
 * @function validatePassword
 * @description Validates a password string for basic requirements (e.g., minimum length).
 * @param {string} password - The password string to validate.
 * @returns {string | null} An error message if validation fails, or null if valid.
 */
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  return null;
};

/**
 * @typedef {'weak' | 'medium' | 'strong'} PasswordStrengthLevel
 * @description Represents the assessed strength of a password.
 */
type PasswordStrengthLevel = 'weak' | 'medium' | 'strong';

/**
 * @interface PasswordStrengthResult
 * @description Defines the return type for `validatePasswordStrength`.
 * @property {number} score - A numerical score representing password strength (e.g., 0-6).
 * @property {string} feedback - A string containing comma-separated feedback messages for improving the password.
 * @property {PasswordStrengthLevel} strength - A qualitative assessment of the password's strength.
 */
export interface PasswordStrengthResult {
  score: number;
  feedback: string;
  strength: PasswordStrengthLevel;
}

/**
 * @function validatePasswordStrength
 * @description Assesses the strength of a password based on various criteria
 * (length, character variety).
 * @param {string} password - The password string to assess.
 * @returns {PasswordStrengthResult} An object containing the strength score, feedback, and qualitative strength level.
 */
export const validatePasswordStrength = (password: string): PasswordStrengthResult => {
  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  else feedback.push('Use at least 12 characters');

  // Character variety checks
  if (/[a-z]/.test(password)) score++;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Add uppercase letters');

  if (/\d/.test(password)) score++;
  else feedback.push('Add numbers');

  if (/[^a-zA-Z0-9]/.test(password)) score++;
  else feedback.push('Add special characters');

  let strength: PasswordStrengthLevel = 'weak';
  if (score >= 5) strength = 'strong'; // Arbitrary thresholds, adjust as needed
  else if (score >= 3) strength = 'medium';

  return {
    score,
    feedback: feedback.join(', '),
    strength,
  };
};

/**
 * @function validatePasswordMatch
 * @description Checks if two password strings match.
 * @param {string} password - The original password.
 * @param {string} confirmPassword - The confirmation password.
 * @returns {string | null} An error message if passwords do not match or confirmation is missing, or null if they match.
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

/**
 * @function validateName
 * @description Validates a name string (e.g., for user registration).
 * @param {string} name - The name string to validate.
 * @returns {string | null} An error message if validation fails, or null if valid.
 */
export const validateName = (name: string): string | null => {
  if (!name) {
    return 'Name is required';
  }
  if (name.length < 2) {
    return 'Name must be at least 2 characters';
  }
  if (name.length > 50) {
    return 'Name must be less than 50 characters';
  }
  return null;
};