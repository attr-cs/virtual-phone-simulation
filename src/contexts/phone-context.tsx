
"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { AppId } from '@/config/apps';
import { wallpapers } from '@/config/apps';

export type IconStyle = 'default' | 'glass' | 'neumorphic' | 'simple';

interface PhoneContextType {
  app: AppId;
  setApp: (appId: AppId) => void;
  wallpaper: string;
  setWallpaper: (wallpaperUrl: string) => void;
  brightness: number;
  setBrightness: (level: number) => void;
  iconStyle: IconStyle;
  setIconStyle: (style: IconStyle) => void;
  iconColor: string;
  setIconColor: (color: string) => void;
  iconBackgroundColor: string;
  setIconBackgroundColor: (color: string) => void;
  iconSize: number;
  setIconSize: (size: number) => void;
  iconRadius: number;
  setIconRadius: (radius: number) => void;
}

const PhoneContext = createContext<PhoneContextType | undefined>(undefined);

export const PhoneProvider = ({ children }: { children: ReactNode }) => {
  const [currentApp, setCurrentApp] = useState<AppId>('home');
  const [currentWallpaper, setCurrentWallpaper] = useState<string>(wallpapers[0].url);
  const [brightness, setBrightness] = useState(100);
  const [iconStyle, setIconStyle] = useState<IconStyle>('default');
  const [iconColor, setIconColor] = useState('#ffffff');
  const [iconBackgroundColor, setIconBackgroundColor] = useState('rgba(255, 255, 255, 0.3)');
  const [iconSize, setIconSize] = useState(56); // Corresponds to w-14 h-14
  const [iconRadius, setIconRadius] = useState(16); // Corresponds to rounded-2xl


  const value = {
    app: currentApp,
    setApp: setCurrentApp,
    wallpaper: currentWallpaper,
    setWallpaper: setCurrentWallpaper,
    brightness,
    setBrightness,
    iconStyle,
    setIconStyle,
    iconColor,
    setIconColor,
    iconBackgroundColor,
    setIconBackgroundColor,
    iconSize,
    setIconSize,
    iconRadius,
    setIconRadius,
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
