
"use client";

import React, { useState, useEffect } from 'react';
import { PhoneProvider, usePhone } from '@/contexts/phone-context';
import { appMap } from '@/config/apps';
import { Wifi, BatteryFull, BatteryMedium, BatteryLow, Signal, SignalLow, SignalMedium, Volume2, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import ControlCenter from '@/components/control-center';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';

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
          <AnimatePresence mode="wait">
              <motion.div
                  key={app}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="h-full"
              >
                  {CurrentApp ? <CurrentApp /> : <p>This app is not available.</p>}
              </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 h-1 w-32 bg-white/80 rounded-full cursor-pointer" onClick={() => setApp('home')}></div>
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
         <div className="absolute left-[-10px] top-[120px] w-1 h-16 bg-zinc-600 rounded-l-md"></div>
         <div className="absolute left-[-10px] top-[190px] w-1 h-16 bg-zinc-600 rounded-l-md"></div>
         <div className="absolute right-[-10px] top-[150px] w-1 h-24 bg-zinc-600 rounded-r-md"></div>

      </div>
    </PhoneProvider>
  );
};

export default Phone;
