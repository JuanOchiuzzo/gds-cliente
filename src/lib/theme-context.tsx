'use client';

// Single theme — no toggle needed
// Kept as stub so imports don't break
import { createContext, useContext, type ReactNode } from 'react';

const ThemeContext = createContext({ theme: 'standforge' as const, toggleTheme: () => {}, setTheme: (_t: string) => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value={{ theme: 'standforge', toggleTheme: () => {}, setTheme: () => {} }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
