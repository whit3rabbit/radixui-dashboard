/**
 * @file ThemeSelector.tsx
 * @description This file defines a ThemeSelector component that allows users to choose
 * from available application themes. It displays a dialog with theme previews.
 */
import { useState } from 'react';
import {
  Dialog,
  Button,
  Flex, 
  Grid, 
  Text, 
  Card, 
  Box,
  IconButton,
  Badge
} from '@radix-ui/themes';
import { MoonIcon, SunIcon, Half2Icon, ExclamationTriangleIcon, ArchiveIcon, MixIcon } from '@radix-ui/react-icons';
import { useTheme } from '../lib/theme-context';

/**
 * @interface ThemePreviewProps
 * @description Defines the props for the ThemePreview component.
 * @property {any} theme - The theme object containing details like id, name, description, and preview colors.
 * @property {boolean} isSelected - Whether this theme is currently selected.
 * @property {() => void} onClick - Callback function when the theme preview is clicked.
 */
interface ThemePreviewProps {
  theme: any; // Consider defining a more specific type for theme object
  isSelected: boolean;
  onClick: () => void;
}

/**
 * @function ThemePreview
 * @description A component that displays a visual preview of a theme option.
 * It shows a mock UI element colored according to the theme's preview settings
 * and an icon representing the theme.
 * @param {ThemePreviewProps} props - The props for the component.
 * @returns {JSX.Element} The rendered theme preview card.
 */
function ThemePreview({ theme, isSelected, onClick }: ThemePreviewProps) {
  /**
   * @function getThemeIcon
   * @description Returns an appropriate icon based on the theme ID.
   * @param {string} themeId - The ID of the theme.
   * @returns {JSX.Element} The icon component.
   */
  const getThemeIcon = (themeId: string): JSX.Element => {
    switch (themeId) {
      case 'system':
        return <MixIcon />;
      case 'light':
        return <SunIcon />;
      case 'dark':
        return <MoonIcon />;
      case 'dim':
        return <Half2Icon />;
      case 'contrast':
        return <ExclamationTriangleIcon />;
      case 'material':
        return <ArchiveIcon />;
      default:
        return <SunIcon />;
    }
  };

  return (
    <Card 
      asChild
      style={{ 
        cursor: 'pointer', 
        transition: 'all 0.2s ease',
        border: isSelected ? '2px solid var(--accent-9)' : '1px solid var(--gray-6)',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
      }}
      onClick={onClick}
    >
      <button style={{ all: 'unset', width: '100%' }}>
        <Flex direction="column" gap="3" p="3">
          {/* Theme Preview */}
          <Box 
            style={{
              height: '60px',
              borderRadius: 'var(--radius-3)', // 6px
              background: theme.preview.background,
              border: '1px solid var(--gray-6)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Flex 
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                right: '8px'
              }}
              gap="1"
            >
              <Box 
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: 'var(--radius-round)', // 50%
                  background: theme.preview.primary
                }}
              />
              <Box 
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: 'var(--radius-1)', // 2px
                  background: theme.preview.secondary,
                  marginTop: '2px'
                }}
              />
            </Flex>
            
            <Box 
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                right: '8px',
                height: '16px',
                borderRadius: 'var(--radius-2)', // 4px
                background: theme.preview.secondary
              }}
            />
          </Box>

          {/* Theme Info */}
          <Flex align="center" gap="2">
            <Box style={{ color: theme.preview.primary }}>
              {getThemeIcon(theme.id)}
            </Box>
            <Box style={{ flex: 1 }}>
              <Text size="2" weight="medium" style={{ display: 'block' }}>
                {theme.name}
              </Text>
              <Text size="1" color="gray" style={{ display: 'block' }}>
                {theme.description}
              </Text>
            </Box>
            {isSelected && (
              <Badge color="blue" size="1">
                Active
              </Badge>
            )}
          </Flex>
        </Flex>
      </button>
    </Card>
  );
}

interface ThemeSelectorProps {
  trigger?: React.ReactNode;
}

/**
 * @function ThemeSelector
 * @description A component that provides a dialog interface for users to select an application theme.
 * It uses the `useTheme` hook to access and update theme settings.
 * A custom trigger element can be provided, otherwise a default icon button is used.
 * @param {ThemeSelectorProps} props - The props for the component.
 * @returns {JSX.Element} The rendered theme selector dialog.
 */
export function ThemeSelector({ trigger }: ThemeSelectorProps) {
  const { theme, themeConfig, availableThemes, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const handleThemeSelect = (selectedTheme: string) => {
    setTheme(selectedTheme as any);
    setOpen(false);
  };

  const defaultTrigger = (
    <IconButton variant="ghost" size="3">
      {theme === 'system' && <MixIcon />}
      {theme === 'light' && <SunIcon />}
      {theme === 'dark' && <MoonIcon />}
      {theme === 'dim' && <Half2Icon />}
      {theme === 'contrast' && <ExclamationTriangleIcon />}
      {theme === 'material' && <ArchiveIcon />}
    </IconButton>
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        {trigger || defaultTrigger}
      </Dialog.Trigger>
      
      <Dialog.Content size="3" maxWidth="600px">
        <Dialog.Title>Choose Theme</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Select a theme that matches your preference. Your selection will be saved automatically.
        </Dialog.Description>

        <Grid columns="2" gap="3" mb="4">
          {availableThemes.map((themeOption) => (
            <ThemePreview
              key={themeOption.id}
              theme={themeOption}
              isSelected={theme === themeOption.id}
              onClick={() => handleThemeSelect(themeOption.id)}
            />
          ))}
        </Grid>

        <Flex justify="between" align="center" pt="3" style={{ borderTop: '1px solid var(--gray-6)' }}>
          <Text size="1" color="gray">
            Current: {themeConfig.name}
          </Text>
          <Dialog.Close>
            <Button variant="soft">
              Done
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}


export default ThemeSelector;