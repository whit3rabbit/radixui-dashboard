import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { storage } from './secure-storage'

type Theme = 'system' | 'light' | 'dark' | 'dim' | 'contrast' | 'material'

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
    primary: string
    secondary: string
    background: string
  }
}

interface ThemeContextType {
  theme: Theme
  themeConfig: ThemeConfig
  effectiveTheme: 'light' | 'dark' | 'dim' | 'contrast' | 'material'
  availableThemes: ThemeConfig[]
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  getSystemTheme: () => 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Theme configurations
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
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system'
    
    // Get theme from secure storage or default to system
    const savedTheme = storage.getTheme()
    if (savedTheme && THEME_CONFIGS[savedTheme as Theme]) {
      return savedTheme as Theme
    }
    return 'system'
  })

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemTheme)

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    // Save theme to secure storage whenever it changes
    storage.setTheme(theme)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    const themes: Theme[] = ['system', 'light', 'dark', 'dim', 'contrast', 'material']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  // Calculate effective theme (resolve 'system' to actual theme)
  const effectiveTheme: 'light' | 'dark' | 'dim' | 'contrast' | 'material' = 
    theme === 'system' ? systemTheme : theme

  // Get current theme config
  const themeConfig = THEME_CONFIGS[theme]
  const availableThemes = Object.values(THEME_CONFIGS)

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      themeConfig, 
      effectiveTheme,
      availableThemes, 
      setTheme, 
      toggleTheme, 
      getSystemTheme: () => systemTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}