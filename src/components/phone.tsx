
"use client";

import React, { useState, useEffect } from 'react';
import { PhoneProvider, usePhone } from '@/contexts/phone-context';
import { appMap } from '@/config/apps';
import { Wifi, BatteryFull, BatteryMedium, BatteryLow, Signal, SignalLow, SignalMedium } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import ControlCenter from '@/components/control-center';
import { motion, PanInfo } from 'framer-motion';

const StatusBar = ({ onDragStart, onDrag, onDragEnd }: { onDragStart: any, onDrag: any, onDragEnd: any }) => {
  const [time, setTime] = useState('');
  const [network, setNetwork] = useState({ signal: 3, speed: '1.2MB' });
  const [battery, setBattery] = useState(100);

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    update();
    const timer = setInterval(update, 1000 * 30); // Update every 30 seconds

    // Simulate network speed and signal fluctuation
    const networkInterval = setInterval(() => {
      const signal = Math.floor(Math.random() * 3) + 1;
      let speed;
      if (signal === 1) speed = `${Math.floor(Math.random() * 50)}KB`;
      else if (signal === 2) speed = `${Math.floor(Math.random() * 500)}KB`;
      else speed = `${(Math.random() * 1.5).toFixed(1)}MB`;
      setNetwork({ signal, speed });
    }, 3000);

    // Simulate battery drain
    const batteryInterval = setInterval(() => {
      setBattery(b => Math.max(0, b - 1));
    }, 60 * 1000);


    return () => {
      clearInterval(timer)
      clearInterval(networkInterval)
      clearInterval(batteryInterval)
    };
  }, []);

  const SignalIcon = () => {
    if (network.signal === 1) return <SignalLow size={16} />;
    if (network.signal === 2) return <SignalMedium size={16} />;
    return <Signal size={16} />;
  }

  const BatteryIcon = () => {
    if (battery < 20) return <BatteryLow size={20} />;
    if (battery < 60) return <BatteryMedium size={20} />;
    return <BatteryFull size={20} />;
  }

  return (
    <motion.div 
        className="absolute top-0 left-0 right-0 h-10 px-4 flex items-center justify-between text-sm font-medium text-white z-20 font-sans cursor-grab active:cursor-grabbing [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]"
        onPanStart={onDragStart}
        onPan={onDrag}
        onPanEnd={onDragEnd}
    >
      <span>{time}</span>
       <div className="flex items-center gap-1 text-xs">
          <span>{network.speed}/s</span>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bg-black w-24 h-6 rounded-b-xl"></div>
      <div className="flex items-center gap-1.5">
        <SignalIcon />
        <Wifi size={16} />
        <BatteryIcon />
      </div>
    </motion.div>
  );
};

const PhoneContent = () => {
  const { app, wallpaper, setApp, brightness } = usePhone();
  const CurrentApp = appMap[app].component;
  const [isControlCenterOpen, setControlCenterOpen] = useState(false);
  
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 50) {
      setControlCenterOpen(true);
    }
    if (info.offset.y < -50) {
        setControlCenterOpen(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-zinc-800 rounded-[40px] shadow-2xl overflow-hidden border-4 border-black">
      <div className="relative w-full h-full" style={{ filter: `brightness(${brightness}%)`}}>
        <StatusBar 
            onDragStart={() => {}} 
            onDrag={handleDrag} 
            onDragEnd={() => {}}
        />
        <div
          className="w-full h-full app-screen bg-cover bg-center"
          style={{ backgroundImage: app === 'home' ? `url(${wallpaper})` : 'none' }}
        >
          <div className="app-container h-full">
            {CurrentApp ? <CurrentApp /> : <p>This app is not available.</p>}
          </div>
        </div>
        {app !== 'home' && (
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
        )}
      </div>
       <ControlCenter isOpen={isControlCenterOpen} setIsOpen={setControlCenterOpen} />
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
