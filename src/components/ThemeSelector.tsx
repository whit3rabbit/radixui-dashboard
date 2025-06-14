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

interface ThemePreviewProps {
  theme: any;
  isSelected: boolean;
  onClick: () => void;
}

function ThemePreview({ theme, isSelected, onClick }: ThemePreviewProps) {
  const getThemeIcon = (themeId: string) => {
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
              borderRadius: '6px',
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
                  borderRadius: '50%',
                  background: theme.preview.primary
                }}
              />
              <Box 
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
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
                borderRadius: '4px',
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
      
      <Dialog.Content size="3" style={{ maxWidth: '600px' }}>
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