/**
 * @file theme-context.tsx
 * @description This file defines the context for managing application themes.
 * It provides a `ThemeProvider` to wrap the application, a `useTheme` hook for accessing theme state,
 * and a set of predefined theme configurations.
 */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { storage } from './secure-storage' // Using secureStorage for theme persistence

/**
 * @typedef {'system' | 'light' | 'dark' | 'dim' | 'contrast' | 'material'} Theme
 * @description Represents the available theme identifiers.
 * 'system' means the theme follows the operating system's preference.
 */
type Theme = 'system' | 'light' | 'dark' | 'dim' | 'contrast' | 'material'

/**
 * @interface ThemeConfig
 * @description Defines the structure for a theme's configuration.
 * @property {Theme} id - Unique identifier for the theme.
 * @property {string} name - Display name for the theme.
 * @property {string} description - A short description of the theme.
 * @property {string} accentColor - The primary accent color for the theme (e.g., 'blue', 'green').
 * @property {string} grayColor - The gray scale color to be used (e.g., 'gray', 'slate').
 * @property {'light' | 'dark' | 'inherit'} appearance - The base appearance mode ('light', 'dark', or 'inherit' for system).
 * @property {string} [radius] - Border radius setting (e.g., 'small', 'medium', 'large').
 * @property {boolean} [hasBackground] - Whether the theme uses a background color by default.
 * @property {boolean} [highContrast] - Whether the theme is a high contrast variant.
 * @property {{ primary: string; secondary: string; background: string; }} preview - Color codes for UI previews.
 */
interface ThemeConfig {
  id: Theme
  name: string
  description: string
  accentColor: string
  grayColor: string
  appearance: 'light' | 'dark' | 'inherit'
  radius?: string
  hasBackground?: boolean
  highContrast?: boolean
  preview: {
    primary: string // Hex color for preview
    secondary: string // Hex color for preview
    background: string // Hex or gradient for preview
  }
}

/**
 * @interface ThemeContextType
 * @description Defines the shape of the Theme context.
 * @property {Theme} theme - The currently selected theme identifier (e.g., 'light', 'system').
 * @property {ThemeConfig} themeConfig - The full configuration object for the current theme.
 * @property {'light' | 'dark' | 'dim' | 'contrast' | 'material'} effectiveTheme - The actual theme being applied (resolves 'system').
 * @property {ThemeConfig[]} availableThemes - An array of all available theme configurations.
 * @property {(theme: Theme) => void} setTheme - Function to set a new theme.
 * @property {() => void} toggleTheme - Function to cycle through available themes.
 * @property {() => 'light' | 'dark'} getSystemTheme - Function that returns the current system theme preference ('light' or 'dark').
 */
interface ThemeContextType {
  theme: Theme
  themeConfig: ThemeConfig
  effectiveTheme: 'light' | 'dark' // Note: This was more specific in original, but needs to match actual theme types if 'dim', 'contrast', 'material' are distinct effective appearances.
                                   // For Radix UI, appearance is usually 'light' or 'dark'. Let's assume 'dim', 'contrast', 'material' map to one of these or are handled by their specific config.
                                   // Reverting to original for now:
  effectiveTheme: 'light' | 'dark' | 'dim' | 'contrast' | 'material'
  availableThemes: ThemeConfig[]
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  getSystemTheme: () => 'light' | 'dark'
}

/**
 * @const ThemeContext
 * @description React context for theme management.
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * @const THEME_CONFIGS
 * @description A record containing all predefined theme configurations, indexed by their `Theme` id.
 */
const THEME_CONFIGS: Record<Theme, ThemeConfig> = {
  system: {
    id: 'system',
    name: 'System',
    description: 'Follow your device theme preference',
    accentColor: 'blue',
    grayColor: 'gray',
    appearance: 'inherit',
    radius: 'medium',
    hasBackground: true,
    preview: {
      primary: '#3b82f6',
      secondary: '#e5e7eb',
      background: 'linear-gradient(135deg, #ffffff 50%, #111827 50%)'
    }
  },
  light: {
    id: 'light',
    name: 'Light',
    description: 'Clean and bright interface',
    accentColor: 'blue',
    grayColor: 'gray',
    appearance: 'light',
    radius: 'medium',
    hasBackground: true,
    preview: {
      primary: '#3b82f6',
      secondary: '#e5e7eb',
      background: '#ffffff'
    }
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    description: 'Easy on the eyes in low light',
    accentColor: 'blue',
    grayColor: 'gray',
    appearance: 'dark',
    radius: 'medium',
    hasBackground: true,
    preview: {
      primary: '#60a5fa',
      secondary: '#374151',
      background: '#111827'
    }
  },
  dim: {
    id: 'dim',
    name: 'Dim',
    description: 'Subtle and sophisticated dark theme',
    accentColor: 'blue',
    grayColor: 'slate',
    appearance: 'dark',
    radius: 'medium',
    hasBackground: true,
    preview: {
      primary: '#64748b',
      secondary: '#1e293b',
      background: '#0f172a'
    }
  },
  contrast: {
    id: 'contrast',
    name: 'Contrast',
    description: 'High contrast for better accessibility',
    accentColor: 'blue',
    grayColor: 'gray',
    appearance: 'light',
    radius: 'medium',
    hasBackground: false,
    highContrast: true,
    preview: {
      primary: '#0066cc',
      secondary: '#000000',
      background: '#ffffff'
    }
  },
  material: {
    id: 'material',
    name: 'Material',
    description: 'Google Material Design inspired',
    accentColor: 'indigo',
    grayColor: 'gray',
    appearance: 'light',
    radius: 'large',
    hasBackground: true,
    preview: {
      primary: '#6366f1',
      secondary: '#e0e7ff',
      background: '#f8fafc'
    }
  }
  // ... other theme configurations ...
}

/**
 * @function ThemeProvider
 * @description Provides the theme context to its children.
 * It manages the current theme state, handles system theme changes,
 * persists the selected theme to storage, and makes theme data and functions available.
 * @param {{ children: ReactNode }} props - Props for the component.
 * @property {ReactNode} children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} The ThemeProvider component.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  /**
   * @function getSystemTheme
   * @description Determines the user's operating system theme preference.
   * @returns {'light' | 'dark'} 'light' or 'dark'. Defaults to 'light' if window is undefined (SSR).
   */
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light'; // Default for SSR or non-browser environments
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system'; // Default for SSR

    // Attempt to load saved theme from storage
    const savedTheme = storage.preferences.getTheme(); // Using the updated storage namespace
    if (savedTheme && THEME_CONFIGS[savedTheme as Theme]) {
      return savedTheme as Theme;
    }
    return 'system'; // Default to 'system' if no valid theme is saved
  });

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemTheme);

  // Effect to listen for changes in system theme preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Effect to persist the theme choice to storage whenever it changes
  useEffect(() => {
    storage.preferences.setTheme(theme); // Using the updated storage namespace
  }, [theme]);

  /**
   * @function setTheme
   * @description Sets the application theme to the chosen one.
   * @param {Theme} newTheme - The identifier of the theme to set.
   */
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  /**
   * @function toggleTheme
   * @description Cycles through the available themes.
   * The order is defined by the `themes` array.
   */
  const toggleTheme = () => {
    const themes: Theme[] = Object.keys(THEME_CONFIGS) as Theme[]; // Get all theme keys
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // Determine the actual appearance theme to apply (resolves 'system' to 'light' or 'dark')
  // Also considers if the theme itself is 'light' or 'dark' based (e.g. 'dim' is a dark theme)
  // const currentThemeConfig = THEME_CONFIGS[theme]; // This is already available as themeConfig below
  // let resolvedAppearance: 'light' | 'dark'; // This variable is unused
  // if (currentThemeConfig.appearance === 'inherit') {
  // resolvedAppearance = systemTheme;
  // } else {
  // resolvedAppearance = currentThemeConfig.appearance;
  // }

  // The `effectiveTheme` should represent the actual theme name if not 'system',
  // or the resolved system theme name ('light' or 'dark') if 'system' is chosen.
  // This seems to be what the original `effectiveTheme` intended.
  const effectiveThemeName: Theme = theme === 'system' ? systemTheme : theme;


  const value: ThemeContextType = {
    theme,
    themeConfig: THEME_CONFIGS[theme], // Current theme's full configuration
    effectiveTheme: effectiveThemeName, // This is 'light', 'dark', 'dim', etc.
    availableThemes: Object.values(THEME_CONFIGS),
    setTheme,
    toggleTheme,
    getSystemTheme: () => systemTheme // Provides the current system theme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * @function useTheme
 * @description Custom hook to access the theme context.
 * Throws an error if used outside of a `ThemeProvider`.
 * @returns {ThemeContextType} The theme context.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}