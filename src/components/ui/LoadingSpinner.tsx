import React from 'react';
import { Flex, Box, Text, Spinner } from '@radix-ui/themes';

interface LoadingSpinnerProps {
  size?: '1' | '2' | '3';
  message?: string;
  variant?: 'default' | 'overlay' | 'fullscreen' | 'inline';
  className?: string;
}

export function LoadingSpinner({ 
  size = '2', 
  message = 'Loading...', 
  variant = 'default',
  className 
}: LoadingSpinnerProps) {
  const baseStyles = {
    overlay: {
      position: 'absolute' as const,
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

// Loading overlay component for containers
interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  message?: string;
  size?: '1' | '2' | '3';
}

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

// Skeleton loading component
interface SkeletonProps {
  loading: boolean;
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
}

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
    borderRadius: '4px',
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
            width: i === lines - 1 ? '80%' : '100%'
          }} 
        />
      ))}
    </Flex>
  );
}

// Loading button component
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
  loadingText?: string;
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
  size?: '1' | '2' | '3' | '4';
}

export function LoadingButton({
  loading = false,
  children,
  loadingText,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        ...props.style
      }}
    >
      {loading && <Spinner size="1" />}
      {loading ? (loadingText || children) : children}
    </button>
  );
}

// Enhanced page loading component
interface PageLoadingProps {
  message?: string;
  submessage?: string;
}

export function PageLoading({ 
  message = 'Loading...', 
  submessage 
}: PageLoadingProps) {
  return (
    <Flex 
      direction="column" 
      align="center" 
      justify="center" 
      style={{ minHeight: '400px' }}
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

// Add keyframes for shimmer animation
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