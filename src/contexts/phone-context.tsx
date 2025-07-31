
"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import type { AppId } from '@/config/apps';
import { wallpapers } from '@/config/apps';

interface PhoneContextType {
  app: AppId;
  setApp: (appId: AppId) => void;
  wallpaper: string;
  setWallpaper: (wallpaperUrl: string) => void;
  brightness: number;
  setBrightness: (level: number) => void;
  volume: number;
  setVolume: (v: number | ((v:number) => number)) => void;
  isLocked: boolean;
  setIsLocked: React.Dispatch<React.SetStateAction<boolean>>;
  showVolume: boolean;
}

const PhoneContext = createContext<PhoneContextType | undefined>(undefined);

export const PhoneProvider = ({ children }: { children: ReactNode }) => {
  const [currentApp, setCurrentApp] = useState<AppId>('home');
  const [currentWallpaper, setCurrentWallpaper] = useState<string>(wallpapers[0].url);
  const [brightness, setBrightness] = useState(100);
  const [volume, _setVolume] = useState(50);
  const [isLocked, setIsLocked] = useState(true);
  const [showVolume, setShowVolume] = useState(false);

  const setVolume = (v: number | ((v:number) => number)) => {
      _setVolume(v);
      setShowVolume(true);
  }

  useEffect(() => {
    if (showVolume) {
        const timer = setTimeout(() => {
            setShowVolume(false);
        }, 2000);
        return () => clearTimeout(timer);
    }
  }, [showVolume]);


  const value = {
    app: currentApp,
    setApp: setCurrentApp,
    wallpaper: currentWallpaper,
    setWallpaper: setCurrentWallpaper,
    brightness,
    setBrightness,
    volume,
    setVolume,
    isLocked,
    setIsLocked,
    showVolume,
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
