
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { usePhone } from '@/contexts/phone-context';
import { wallpapers } from '@/config/apps';
import { Wifi, Bluetooth, Moon, Sun, X, Bell, Wallpaper, ChevronRight, ChevronLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

const SettingsApp = () => {
    const { wallpaper, setWallpaper, setApp, brightness, setBrightness } = usePhone();
    const [view, setView] = useState<'main' | 'wallpaper'>('main');

    const settingsItems = [
        { icon: Wifi, label: 'Wi-Fi', detail: 'HomeNetwork', toggle: true, action: () => {} },
        { icon: Bluetooth, label: 'Bluetooth', detail: 'On', toggle: true, action: () => {} },
        { icon: Bell, label: 'Notifications', detail: '', toggle: false, action: () => {} },
    ];

    const renderMainView = () => (
        <>
            <header className="p-4 pt-12 bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10 flex items-center">
                <button onClick={() => setApp('home')} className="p-1 mr-2"><X size={20}/></button>
                <h1 className="text-xl font-headline font-bold">Settings</h1>
            </header>
            <main className="p-4 flex-1 space-y-4">
                <section className="bg-card rounded-lg border">
                    <ul className="divide-y divide-border">
                        {settingsItems.map((item) => (
                             <li key={item.label} className="flex items-center p-3 cursor-pointer" onClick={item.action}>
                                <item.icon className="text-primary" size={20}/>
                                <Label htmlFor={item.toggle ? item.label : undefined} className="ml-4 flex-1 text-base cursor-pointer">{item.label}</Label>
                                {item.detail && <span className="text-muted-foreground mr-2">{item.detail}</span>}
                                {item.toggle ? <Switch id={item.label} defaultChecked /> : <ChevronRight size={16} className="text-muted-foreground" />}
                             </li>
                        ))}
                    </ul>
                </section>
                <section className="bg-card rounded-lg border p-3 space-y-4">
                     <div className="flex items-center gap-3">
                         <Sun className="text-primary" size={20}/>
                         <Slider
                            value={[brightness]}
                            onValueChange={(value) => setBrightness(value[0])}
                            min={20}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                     </div>
                     <button className="w-full flex items-center p-3 cursor-pointer" onClick={() => setView('wallpaper')}>
                        <Wallpaper className="text-primary" size={20}/>
                        <span className="ml-4 flex-1 text-base text-left">Wallpaper</span>
                        <ChevronRight size={16} className="text-muted-foreground" />
                     </button>
                </section>
            </main>
        </>
    );

    const renderWallpaperView = () => (
         <>
            <header className="p-4 pt-12 bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10 flex items-center">
                <button onClick={() => setView('main')} className="p-1 mr-2 flex items-center gap-1 text-primary">
                    <ChevronLeft size={20}/>
                    <span>Settings</span>
                </button>
                <h1 className="text-xl font-headline font-bold ml-4">Wallpaper</h1>
            </header>
            <main className="p-4">
              <div className="grid grid-cols-3 gap-4">
                {wallpapers.map((w) => (
                  <button key={w.id} onClick={() => setWallpaper(w.url)} className={cn("rounded-lg overflow-hidden border-2 transition-all", w.url === wallpaper ? 'border-primary ring-2 ring-primary scale-105' : 'border-transparent')}>
                    <Image
                      src={w.url}
                      alt={w.name}
                      width={100}
                      height={200}
                      className="w-full h-full object-cover aspect-[9/19]"
                      data-ai-hint={w.dataAiHint}
                    />
                  </button>
                ))}
              </div>
            </main>
        </>
    );

  return (
    <div className="bg-zinc-100 dark:bg-black h-full flex flex-col font-sans overflow-y-auto">
        {view === 'main' ? renderMainView() : renderWallpaperView()}
    </div>
  );
};

export default SettingsApp;
