
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
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -40, opacity: 0, transition: { duration: 0.4, ease: 'easeOut', delay: 1.5 } }}
                    transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30"
                >
                    <div className="w-8 h-40 bg-white/80 backdrop-blur-md rounded-full p-1.5 flex flex-col-reverse">
                       <motion.div
                            className="w-full bg-white rounded-full"
                            initial={{ height: `${volume}%`}}
                            animate={{ height: `${volume}%`}}
                            transition={{ ease: 'easeOut', duration: 0.3 }}
                        />
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
      <VolumeIndicator volume={volume} isVisible={showVolume} />
      <div className="relative w-full h-full" style={{ filter: `brightness(${brightness}%)`}}>
            <AnimatePresence>
                {isLocked && <LockScreen onUnlock={() => setIsLocked(false)} />}
            </AnimatePresence>
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


const PhoneBack = () => {
    return (
        <div className="absolute inset-0 w-full h-full bg-zinc-800 rounded-[40px] p-6 flex flex-col items-center justify-between [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <div className="w-24 h-24 bg-black/20 rounded-3xl p-2 self-start flex items-center justify-center">
                <div className="w-full h-full bg-black/10 rounded-[18px] grid grid-cols-2 gap-1.5 p-1.5">
                   <div className="w-full h-full bg-gradient-to-br from-zinc-600 to-zinc-800 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 opacity-80 ring-1 ring-black/50"></div>
                   </div>
                   <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-900 rounded-full"></div>
                   <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-900 rounded-full"></div>
                   <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-full flex items-center justify-center">
                         <div className="w-2 h-2 rounded-full bg-yellow-300 opacity-50"></div>
                   </div>
                </div>
            </div>

            <div className="text-zinc-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="currentColor"><path d="M13.294 6.516c-1.144-.06-2.956.84-3.816 1.848-.8.864-1.512 2.017-1.464 3.3.084 1.536 1.284 2.568 2.472 2.568.42 0 .84-.132 1.284-.336-.384.624-.312 1.344.276 2.004.624.684 1.5.876 2.22.564.072.132.156.252.24.372.3.432.66.864 1.14 1.056.456.204.936.204 1.356-.036.336-.204.66-.528.852-.888.168-.312.288-.636.324-.96.024-.264.012-.528-.024-.78-.06-.396-.18-.768-.372-1.104-.264-.468-.6-.876-1.128-1.068-.528-.204-1.188-.132-1.8.216.036-.576.012-1.152-.084-1.716-.144-.756-.468-1.5-1.056-2.136-.552-.6-1.284-1.104-2.184-1.224Zm3.432 7.764c.24-.036.42-.084.588-.144.288-.12.564-.288.756-.564.18-.252.3-.564.324-.9.036-.444-.084-.876-.324-1.236-.228-.36-.564-.624-.948-.792-.372-.156-.816-.18-1.224-.024-.432.168-.78.504-1.02.9-.24.384-.36.84-.324 1.32.036.468.24.9.552 1.212.324.324.732.504 1.176.492.204 0 .408-.036.528-.072Z"/></svg>
            </div>
            
            <div className="text-center text-zinc-600 text-[10px] self-center">
                <p>Designed by Gemini in California</p>
                <p>Assembled in the Cloud</p>
            </div>
        </div>
    )
}

const SideButton = ({ className, ...props }: React.ComponentProps<typeof motion.button>) => (
    <motion.button 
        className={cn("bg-zinc-600 rounded-md outline-none focus:outline-none focus-visible:outline-none", className)}
        whileTap={{ scale: 0.85, x: -2, backgroundColor: '#A1A1AA' }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        {...props}
    />
);


const Phone = ({ isFlipped }: { isFlipped: boolean }) => {
  return (
    <PhoneProvider>
      <div className="relative w-[390px] h-[844px] scale-90 md:scale-100 transition-transform [perspective:2000px]">
        <motion.div 
            className="relative w-full h-full [transform-style:preserve-3d]"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
        >
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
                <div className="absolute -inset-2 bg-zinc-800 rounded-[48px] shadow-lg"></div>
                <PhoneContentWithButtons />
            </div>
             <PhoneBack />
        </motion.div>
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
