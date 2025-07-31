
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { PhoneProvider, usePhone } from '@/contexts/phone-context';
import { appMap } from '@/config/apps';
import { Wifi, BatteryFull, BatteryMedium, BatteryLow, Signal, SignalLow, SignalMedium, Power, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import ControlCenter from './control-center';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';

const StatusBar = ({ onDragStart, onDrag, onDragEnd }: { onDragStart: any, onDrag: any, onDragEnd: any }) => {
  const [time, setTime] = useState('');
  const [network, setNetwork] = useState({ signal: 3, speed: '1.2MB' });
  const [battery, setBattery] = useState(100);

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    update();
    const timer = setInterval(update, 1000 * 30); // Update every 30 seconds

    const networkInterval = setInterval(() => {
      const signal = Math.floor(Math.random() * 3) + 1;
      let speed;
      if (signal === 1) speed = `${Math.floor(Math.random() * 50)}KB`;
      else if (signal === 2) speed = `${Math.floor(Math.random() * 500)}KB`;
      else speed = `${(Math.random() * 1.5).toFixed(1)}MB`;
      setNetwork({ signal, speed });
    }, 3000);

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

const VolumeIndicator = ({ volume, isVisible }: { volume: number, isVisible: boolean }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
                    exit={{ y: -50, opacity: 0, transition: { duration: 0.5, ease: 'anticipate', delay: 1.5 } }}
                    className="absolute top-0 left-0 right-0 z-30 flex justify-center pt-2"
                >
                    <div className="w-32 h-2 rounded-full bg-black/50 backdrop-blur-sm shadow-lg overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400"
                            style={{ width: `${volume}%` }}
                            transition={{ ease: 'easeOut', duration: 0.3 }}
                        >
                            <motion.div
                                className="h-full w-full opacity-30"
                                style={{
                                    backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.4) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.4) 75%, transparent 75%, transparent)',
                                    backgroundSize: '20px 20px',
                                }}
                                animate={{ backgroundPositionX: ['0px', '20px'] }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const LockScreen = ({ onUnlock }: { onUnlock: () => void }) => {
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            setDate(now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }));
        }
        update();
        const timer = setInterval(update, 1000 * 30);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black text-white flex flex-col items-center justify-center z-40"
            onClick={onUnlock}
        >
            <div className="absolute top-24 text-center">
                 <p className="text-7xl font-bold font-headline">{time}</p>
                 <p className="text-xl">{date}</p>
            </div>
            <div className="absolute bottom-20 flex flex-col items-center gap-2">
                 <p className="text-sm font-medium">Tap to unlock</p>
                 <Sun size={24} />
            </div>
        </motion.div>
    );
}

const PhoneContent = () => {
  const { app, wallpaper, setApp, brightness, volume, showVolume, isLocked, setIsLocked } = usePhone();
  const CurrentApp = appMap[app].component;
  const [isControlCenterOpen, setControlCenterOpen] = useState(false);
  
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 50 && !isLocked) {
      setControlCenterOpen(true);
    }
    if (info.offset.y < -50) {
        setControlCenterOpen(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-zinc-800 rounded-[40px] shadow-2xl overflow-hidden border-4 border-black">
        <AnimatePresence>
            {isLocked && <LockScreen onUnlock={() => setIsLocked(false)} />}
        </AnimatePresence>
      <VolumeIndicator volume={volume} isVisible={showVolume} />
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
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <button
                    onClick={() => setApp('home')}
                    className="h-1 w-32 bg-white/80 rounded-full cursor-pointer transition-transform active:scale-95"
                    aria-label="Home button"
                />
            </div>
      </div>
       <ControlCenter isOpen={isControlCenterOpen} setIsOpen={setControlCenterOpen} />
    </div>
  );
};

const SideButton = ({ className, ...props }: React.ComponentProps<typeof motion.button>) => (
    <motion.button 
        className={cn("bg-zinc-600 rounded-md", className)}
        whileTap={{ scale: 0.95, backgroundColor: '#A1A1AA' }}
        {...props}
    />
);


const Phone = () => {
  return (
    <PhoneProvider>
      <div className="relative w-[390px] h-[844px] scale-90 md:scale-100 transition-transform">
        <div className="absolute -inset-2 bg-zinc-800 rounded-[48px] shadow-lg"></div>
        <PhoneContentWithButtons />
      </div>
    </PhoneProvider>
  );
};

const PhoneContentWithButtons = () => {
    const { setVolume, isLocked, setIsLocked } = usePhone();

    const handleVolumeUp = () => {
        if (isLocked) return;
        setVolume(v => Math.min(100, v + 10))
    };
    const handleVolumeDown = () => {
        if (isLocked) return;
        setVolume(v => Math.max(0, v - 10))
    };
    const handlePower = () => setIsLocked(l => !l);

    return (
        <>
            <PhoneContent />
            <SideButton className="absolute left-[-10px] top-[120px] w-1 h-16" onClick={handleVolumeUp} />
            <SideButton className="absolute left-[-10px] top-[190px] w-1 h-16" onClick={handleVolumeDown} />
            <SideButton className="absolute right-[-10px] top-[150px] w-1 h-24" onClick={handlePower} />
        </>
    )
}

export default Phone;
