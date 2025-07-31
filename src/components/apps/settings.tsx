"use client";

import React from 'react';
import Image from 'next/image';
import { usePhone } from '@/contexts/phone-context';
import { wallpapers } from '@/config/apps';
import { Wifi, Bluetooth, Moon, Sun, X, Bell } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const SettingsApp = () => {
    const { wallpaper, setWallpaper, setApp } = usePhone();

    const settingsItems = [
        { icon: Wifi, label: 'Wi-Fi', detail: 'HomeNetwork', toggle: true },
        { icon: Bluetooth, label: 'Bluetooth', detail: 'On', toggle: true },
        { icon: Bell, label: 'Notifications', detail: '', toggle: false },
        { icon: Sun, label: 'Display & Brightness', detail: '', toggle: false },
    ]

  return (
    <div className="bg-zinc-100 dark:bg-black h-full flex flex-col font-sans overflow-y-auto">
        <header className="p-4 pt-12 bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10 flex items-center">
            <button onClick={() => setApp('home')} className="p-1 mr-2"><X size={20}/></button>
            <h1 className="text-xl font-headline font-bold">Settings</h1>
        </header>

      <main className="p-4 flex-1 space-y-6">
        <section className="bg-background rounded-lg p-2">
            <ul>
                {settingsItems.map((item, index) => (
                    <React.Fragment key={item.label}>
                     <li className="flex items-center p-2">
                        <item.icon className="text-primary" size={20}/>
                        <Label htmlFor={item.toggle ? item.label : undefined} className="ml-4 flex-1 text-base">{item.label}</Label>
                        {item.detail && <span className="text-muted-foreground mr-2">{item.detail}</span>}
                        {item.toggle && <Switch id={item.label} defaultChecked />}
                     </li>
                     {index < settingsItems.length -1 && <Separator className="ml-14" />}
                    </React.Fragment>
                ))}
            </ul>
        </section>

        <section>
          <h2 className="font-headline font-semibold text-lg mb-2">Wallpaper</h2>
          <div className="grid grid-cols-3 gap-3">
            {wallpapers.map((w) => (
              <button key={w.id} onClick={() => setWallpaper(w.url)} className={cn("rounded-lg overflow-hidden border-2 transition-all", w.url === wallpaper ? 'border-primary scale-105' : 'border-transparent')}>
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
        </section>
      </main>
    </div>
  );
};

export default SettingsApp;
