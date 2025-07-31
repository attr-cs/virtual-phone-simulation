"use client";

import React, { useState, useEffect } from 'react';
import { PhoneProvider, usePhone } from '@/contexts/phone-context';
import { appMap } from '@/config/apps';
import { Wifi, BatteryFull, Signal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const StatusBar = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    update();
    const timer = setInterval(update, 1000 * 60); // Update every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 h-10 px-4 flex items-center justify-between text-sm font-medium text-white z-10 font-sans">
      <span>{time}</span>
      <div className="absolute left-1/2 -translate-x-1/2 bg-black w-24 h-6 rounded-b-xl"></div>
      <div className="flex items-center gap-1.5">
        <Signal size={16} />
        <Wifi size={16} />
        <BatteryFull size={20} />
      </div>
    </div>
  );
};

const PhoneContent = () => {
  const { app, wallpaper, setApp } = usePhone();
  const CurrentApp = appMap[app].component;
  
  return (
    <div className="relative w-full h-full bg-zinc-800 rounded-[40px] shadow-2xl overflow-hidden border-4 border-black">
      <StatusBar />
      <div
        className="w-full h-full app-screen bg-cover bg-center"
        style={{ backgroundImage: app === 'home' ? `url(${wallpaper})` : 'none' }}
      >
        <div className="app-container h-full">
          {CurrentApp ? <CurrentApp /> : <p>This app is not available.</p>}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-center">
         <Button 
            variant="ghost" 
            size="icon" 
            className="bg-white/20 hover:bg-white/30 text-white rounded-full h-12 w-12 backdrop-blur-sm"
            onClick={() => setApp('home')}
            aria-label="Home"
          >
            <Home size={24} />
         </Button>
      </div>
    </div>
  );
};

const Phone = () => {
  return (
    <PhoneProvider>
      <div className="relative w-[390px] h-[844px] scale-90 md:scale-100 transition-transform">
        <div className="absolute -inset-2 bg-zinc-800 rounded-[48px] shadow-lg"></div>
        <PhoneContent />
      </div>
    </PhoneProvider>
  );
};

export default Phone;
