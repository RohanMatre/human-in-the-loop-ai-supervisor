import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDarkMode: boolean;
  setSystemTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => {
      // Check if we're in a browser environment
      const isClient = typeof window !== 'undefined';
      
      // Default to system theme
      const prefersDark = isClient 
        ? window.matchMedia('(prefers-color-scheme: dark)').matches 
        : false;

      return {
        theme: 'system',
        isDarkMode: prefersDark,
        setTheme: (theme: ThemeMode) => {
          const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const isDark = theme === 'dark' || 
            (theme === 'system' && isSystemDark);
          
          set({ theme, isDarkMode: isDark });
          
          // Apply theme to document
          document.documentElement.classList.remove('light-mode', 'dark-mode');
          
          if (theme === 'light') {
            document.documentElement.classList.add('light-mode');
          } else if (theme === 'dark') {
            document.documentElement.classList.add('dark-mode');
          } else if (theme === 'system') {
            document.documentElement.classList.add(isSystemDark ? 'dark-mode' : 'light-mode');
          }
        },
        setSystemTheme: () => {
          const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          set({ isDarkMode: isSystemDark });
          
          if (isSystemDark) {
            document.documentElement.classList.remove('light-mode');
            document.documentElement.classList.add('dark-mode');
          } else {
            document.documentElement.classList.remove('dark-mode');
            document.documentElement.classList.add('light-mode');
          }
        }
      };
    },
    {
      name: 'theme-storage',
    }
  )
); 