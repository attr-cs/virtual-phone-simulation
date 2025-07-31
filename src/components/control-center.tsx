
"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wifi, Bluetooth, Sun, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { usePhone } from '@/contexts/phone-context';
import { Button } from './ui/button';

interface ControlCenterProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ControlCenter: React.FC<ControlCenterProps> = ({ isOpen, setIsOpen }) => {
    const { brightness, setBrightness } = usePhone();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: '-100%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '-100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-xl z-10 p-4 pt-10 flex flex-col"
                >
                    <div className="flex justify-end">
                        <Button variant="ghost" size="icon" className="text-white" onClick={() => setIsOpen(false)}>
                            <X />
                        </Button>
                    </div>

                    <div className="flex-1 flex flex-col justify-center gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
                                <Wifi className="text-white" />
                                <span className="text-white text-sm">Wi-Fi</span>
                            </div>
                            <div className="bg-white/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
                                <Bluetooth className="text-white" />
                                <span className="text-white text-sm">Bluetooth</span>
                            </div>
                        </div>

                        <div className="bg-white/20 rounded-2xl p-4 flex items-center gap-4">
                            <Sun className="text-white" />
                            <Slider
                                value={[brightness]}
                                onValueChange={(value) => setBrightness(value[0])}
                                min={20}
                                max={100}
                                step={1}
                                className="w-full"
                            />
                        </div>

                        <div className="bg-white/20 rounded-2xl p-4 flex items-center gap-4">
                            <Volume2 className="text-white" />
                            <Slider defaultValue={[75]} className="w-full" />
                        </div>
                    </div>
                     <div className="h-1 w-32 bg-white/50 rounded-full mx-auto mt-4 mb-2 cursor-grab" onClick={() => setIsOpen(false)}></div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ControlCenter;
