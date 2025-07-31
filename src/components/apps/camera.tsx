"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Camera as CameraIcon, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePhone } from '@/contexts/phone-context';
import Image from 'next/image';

const CameraApp = () => {
    const { setApp } = usePhone();
    const [isFlashing, setIsFlashing] = useState(false);
    const [photo, setPhoto] = useState<string | null>(null);

    const handleCapture = () => {
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 300);
        
        // Use a random placeholder image
        const placeholderUrl = `https://placehold.co/390x844/cccccc/000000?text=Captured!`;
        setPhoto(placeholderUrl);
    };

    if (photo) {
        return (
             <div className="bg-black h-full flex flex-col justify-between items-center text-white p-4 font-sans relative">
                <Image src={photo} layout="fill" objectFit="cover" alt="Captured photo" data-ai-hint="captured photo" />
                <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between z-10">
                    <Button variant="ghost" size="icon" className="rounded-full bg-black/50" onClick={() => setPhoto(null)}>
                        <X />
                    </Button>
                    <Button variant="ghost" className="rounded-full bg-primary text-primary-foreground">
                        Save
                    </Button>
                </div>
             </div>
        )
    }

  return (
    <div className="bg-black h-full flex flex-col justify-between items-center text-white p-8 font-sans">
       <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-end z-10">
          <Button variant="ghost" size="icon" className="rounded-full bg-black/50" onClick={() => setApp('home')}>
             <X />
          </Button>
       </div>
      
       <div className={cn("absolute inset-0 bg-white transition-opacity duration-300", isFlashing ? "opacity-80" : "opacity-0 pointer-events-none")}></div>

       <div className="flex-1 flex items-center justify-center">
        <p className="text-zinc-500">Camera Preview</p>
       </div>
      
      <div className="w-full flex justify-between items-center">
         <div className="w-16 h-16 bg-zinc-800 rounded-lg"></div>

        <button onClick={handleCapture} className="w-20 h-20 rounded-full bg-white border-4 border-zinc-800 ring-4 ring-white ring-offset-0 ring-offset-black"></button>

         <Button variant="ghost" size="icon" className="rounded-full bg-zinc-800 w-12 h-12">
            <RefreshCw size={20} />
         </Button>
      </div>
    </div>
  );
};

export default CameraApp;
