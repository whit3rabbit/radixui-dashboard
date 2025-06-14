/**
 * @file LoadingSpinner.tsx
 * @description This file defines various loading indicator components used throughout the application.
 * It includes a general `LoadingSpinner`, a `LoadingOverlay` for containers,
 * a `Skeleton` component for placeholder loading, a `LoadingButton`, and a `PageLoading` component.
 */
import React from 'react';
import { Flex, Box, Text, Spinner, Button as RadixButton } from '@radix-ui/themes';

/**
 * @interface LoadingSpinnerProps
 * @description Defines the props for the LoadingSpinner component.
 * @property {'1' | '2' | '3'} [size='2'] - The size of the spinner.
 * @property {string} [message='Loading...'] - An optional message to display below the spinner.
 * @property {'default' | 'overlay' | 'fullscreen' | 'inline'} [variant='default'] - The display variant of the spinner.
 *   - `default`: Centered in a flex container.
 *   - `overlay`: Covers its parent container with a semi-transparent background.
 *   - `fullscreen`: Covers the entire screen.
 *   - `inline`: Displays spinner and message in a row.
 * @property {string} [className] - Additional CSS classes for custom styling.
 */
interface LoadingSpinnerProps {
  size?: '1' | '2' | '3';
  message?: string;
  variant?: 'default' | 'overlay' | 'fullscreen' | 'inline';
  className?: string;
}

/**
 * @function LoadingSpinner
 * @description A versatile loading spinner component with different display variants.
 * @param {LoadingSpinnerProps} props - The props for the component.
 * @returns {JSX.Element} The rendered loading spinner.
 */
export function LoadingSpinner({
  size = '2',
  message = 'Loading...',
  variant = 'default',
  className
}: LoadingSpinnerProps) {
  const baseStyles = {
    overlay: {
      position: 'absolute' as const, // Ensures type safety for CSS properties
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(1px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    fullscreen: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(2px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  };

  const content = (
    <Flex direction="column" align="center" gap="3">
      <Spinner size={size} />
      {message && (
        <Text size="2" color="gray" align="center">
          {message}
        </Text>
      )}
    </Flex>
  );

  if (variant === 'overlay') {
    return (
      <div style={baseStyles.overlay} className={className}>
        {content}
      </div>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <div style={baseStyles.fullscreen} className={className}>
        {content}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <Flex align="center" gap="2" className={className}>
        <Spinner size={size} />
        {message && (
          <Text size="2" color="gray">
            {message}
          </Text>
        )}
      </Flex>
    );
  }

  // Default variant
  return (
    <Flex justify="center" p="4" className={className}>
      {content}
    </Flex>
  );
}

/**
 * @interface LoadingOverlayProps
 * @description Defines the props for the LoadingOverlay component.
 * @property {boolean} loading - Whether the loading overlay is active.
 * @property {React.ReactNode} children - The content to be overlaid.
 * @property {string} [message='Loading...'] - Message for the spinner within the overlay.
 * @property {'1' | '2' | '3'} [size='2'] - Size of the spinner within the overlay.
 */
interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  message?: string;
  size?: '1' | '2' | '3';
}

/**
 * @function LoadingOverlay
 * @description A component that displays a loading spinner as an overlay on top of its children.
 * Useful for indicating loading state within a specific container or section.
 * @param {LoadingOverlayProps} props - The props for the component.
 * @returns {JSX.Element} The rendered LoadingOverlay with its children.
 */
export function LoadingOverlay({
  loading,
  children,
  message = 'Loading...',
  size = '2'
}: LoadingOverlayProps) {
  return (
    <Box style={{ position: 'relative' }}>
      {children}
      {loading && (
        <LoadingSpinner 
          variant="overlay" 
          message={message} 
          size={size} 
        />
      )}
    </Box>
  );
}

/**
 * @interface SkeletonProps
 * @description Defines the props for the Skeleton component.
 * @property {boolean} loading - If true, displays the skeleton; otherwise, renders children.
 * @property {React.ReactNode} children - The actual content to render when not loading.
 * @property {string | number} [width='100%'] - The width of the skeleton element(s).
 * @property {string | number} [height='20px'] - The height of the skeleton element(s).
 * @property {number} [lines=1] - If greater than 1, renders multiple skeleton lines.
 * @property {string} [className] - Additional CSS classes for custom styling.
 */
interface SkeletonProps {
  loading: boolean;
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
}

/**
 * @function Skeleton
 * @description A component that displays a placeholder skeleton UI while content is loading.
 * It can render a single block or multiple lines.
 * @param {SkeletonProps} props - The props for the component.
 * @returns {JSX.Element} The skeleton placeholder or the actual children content.
 */
export function Skeleton({
  loading,
  children,
  width = '100%',
  height = '20px',
  lines = 1,
  className
}: SkeletonProps) {
  if (!loading) {
    return <>{children}</>;
  }

  const skeletonStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, var(--gray-3) 25%, var(--gray-4) 50%, var(--gray-3) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: 'var(--radius-2)', // Changed to Radix token (4px is often radius-2)
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (lines === 1) {
    return <Box style={skeletonStyle} className={className} />;
  }

  return (
    <Flex direction="column" gap="2" className={className}>
      {Array.from({ length: lines }, (_, i) => (
        <Box
          key={i}
          style={{
            ...skeletonStyle,
            width: i === lines - 1 ? '80%' : '100%' // Last line can be shorter
          }}
        />
      ))}
    </Flex>
  );
}

/**
 * @interface LoadingButtonProps
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 * @description Defines the props for the LoadingButton component.
 * @property {boolean} [loading=false] - If true, shows a spinner and disables the button.
 * @property {React.ReactNode} children - The content of the button (text or icon).
 * @property {string} [loadingText] - Optional text to display next to the spinner when loading. Defaults to children.
 * @property {'solid' | 'soft' | 'outline' | 'ghost'} [variant] - Radix UI button variant.
 * @property {'1' | '2' | '3' | '4'} [size] - Radix UI button size.
 */
interface LoadingButtonProps extends React.ComponentPropsWithoutRef<typeof RadixButton> {
  loading?: boolean;
  children: React.ReactNode;
  loadingText?: string;
  // variant and size are now directly from RadixButton props
}

/**
 * @function LoadingButton
 * @description A button component that can display a loading state with a spinner, built using Radix UI Button.
 * It wraps a Radix UI Button and adds loading indicators.
 * @param {LoadingButtonProps} props - The props for the component.
 * @returns {JSX.Element} The rendered loading button.
 */
export function LoadingButton({
  loading = false,
  children,
  loadingText,
  disabled,
  className,
  variant = 'solid', // Default Radix Button variant
  size = '2',       // Default Radix Button size
  ...props
}: LoadingButtonProps) {
  // Determine spinner size based on button size for better visual harmony
  const spinnerSize = (size === '1' || size === '2') ? '1' : (size === '3') ? '2' : '3';

  return (
    <RadixButton
      {...props}
      disabled={loading || disabled}
      className={className}
      variant={variant}
      size={size}
    >
      {loading && (
        // Use a Flex span to manage gap between spinner and text if RadixButton doesn't handle it automatically
        // For many cases, Radix Button's internal padding and icon handling might be sufficient
        <Flex as="span" align="center" justify="center" mr={children || loadingText ? "2" : "0"}>
          <Spinner size={spinnerSize} />
        </Flex>
      )}
      {loading ? (loadingText || children) : children}
    </RadixButton>
  );
}

/**
 * @interface PageLoadingProps
 * @description Defines the props for the PageLoading component.
 * @property {string} [message='Loading...'] - The main loading message.
 * @property {string} [submessage] - An optional sub-message displayed below the main message.
 */
interface PageLoadingProps {
  message?: string;
  submessage?: string;
}

/**
 * @function PageLoading
 * @description A component to display a full-page loading indicator.
 * Useful for initial page loads or significant transitions.
 * @param {PageLoadingProps} props - The props for the component.
 * @returns {JSX.Element} The rendered page loading indicator.
 */
export function PageLoading({
  message = 'Loading...',
  submessage
}: PageLoadingProps) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minHeight="400px" // Changed to prop
      gap="4"
    >
      <Spinner size="3" />
      <Flex direction="column" align="center" gap="2">
        <Text size="4" weight="medium">
          {message}
        </Text>
        {submessage && (
          <Text size="2" color="gray">
            {submessage}
          </Text>
        )}
      </Flex>
    </Flex>
  );
}

// Add keyframes for shimmer animation used by Skeleton component.
// This ensures the animation is globally available.
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;
document.head.appendChild(style);

export default LoadingSpinner;