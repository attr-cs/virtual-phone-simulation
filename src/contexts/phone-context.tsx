
"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { AppId } from '@/config/apps';
import { wallpapers } from '@/config/apps';

interface PhoneContextType {
  app: AppId;
  setApp: (appId: AppId) => void;
  wallpaper: string;
  setWallpaper: (wallpaperUrl: string) => void;
  brightness: number;
  setBrightness: (level: number) => void;
}

const PhoneContext = createContext<PhoneContextType | undefined>(undefined);

export const PhoneProvider = ({ children }: { children: ReactNode }) => {
  const [currentApp, setCurrentApp] = useState<AppId>('home');
  const [currentWallpaper, setCurrentWallpaper] = useState<string>(wallpapers[0].url);
  const [brightness, setBrightness] = useState(100);

  const value = {
    app: currentApp,
    setApp: setCurrentApp,
    wallpaper: currentWallpaper,
    setWallpaper: setCurrentWallpaper,
    brightness,
    setBrightness,
  };

  return <PhoneContext.Provider value={value}>{children}</PhoneContext.Provider>;
};

export const usePhone = () => {
  const context = useContext(PhoneContext);
  if (context === undefined) {
    throw new Error('usePhone must be used within a PhoneProvider');
  }
  return context;
};
