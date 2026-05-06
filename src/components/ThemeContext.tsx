import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Season, TimeOfDay } from '../types';

interface ThemeContextType {
  season: Season;
  setSeason: (s: Season) => void;
  timeOfDay: TimeOfDay;
  setTimeOfDay: (t: TimeOfDay) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [season, setSeason] = useState<Season>(Season.SPRING);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(TimeOfDay.DAY);

  return (
    <ThemeContext.Provider value={{ season, setSeason, timeOfDay, setTimeOfDay }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
