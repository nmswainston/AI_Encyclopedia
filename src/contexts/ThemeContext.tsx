import { createContext, useEffect, useState, useMemo, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

export interface ThemeContextType {
  mode: ThemeMode;
  effectiveTheme: EffectiveTheme;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

// Context must be exported for useTheme hook to access it
// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'theme-mode';

function getSystemTheme(): EffectiveTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved;
  }
  return 'system';
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(() => getInitialMode());
  const [systemTheme, setSystemTheme] = useState<EffectiveTheme>(() => getSystemTheme());
  
  // Compute effective theme from mode and system theme
  const effectiveTheme = useMemo<EffectiveTheme>(() => {
    if (mode === 'system') {
      return systemTheme;
    }
    return mode;
  }, [mode, systemTheme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', effectiveTheme === 'dark');
  }, [effectiveTheme]);

  // Listen for OS theme changes when mode is "system"
  useEffect(() => {
    if (mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [mode]);

  // Persist mode to localStorage
  useEffect(() => {
    localStorage.setItem(THEME_KEY, mode);
  }, [mode]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const toggleTheme = () => {
    // Cycle through: system -> light -> dark -> system
    if (mode === 'system') {
      setMode('light');
    } else if (mode === 'light') {
      setMode('dark');
    } else {
      setMode('system');
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, effectiveTheme, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}