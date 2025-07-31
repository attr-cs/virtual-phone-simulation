
"use client";

import React from 'react';
import Image from 'next/image';
import { usePhone, IconStyle } from '@/contexts/phone-context';
import { wallpapers } from '@/config/apps';
import { X, Wallpaper, Sparkles, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const iconStyles: { id: IconStyle, name: string }[] = [
    { id: 'default', name: 'Default' },
    { id: 'glass', name: 'Glass' },
    { id: 'neumorphic', name: 'Neumorphic' },
    { id: 'simple', name: 'Simple' },
]

const CustomizeApp = () => {
    const { 
        setApp, 
        wallpaper, setWallpaper,
        iconStyle, setIconStyle,
        iconColor, setIconColor
    } = usePhone();

    return (
        <div className="bg-background h-full flex flex-col font-sans">
             <header className="p-4 pt-12 bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10 flex items-center justify-between">
                <h1 className="text-xl font-headline font-bold">Customize</h1>
                <button onClick={() => setApp('home')} className="p-1"><X size={20}/></button>
            </header>
            <main className="flex-1">
                 <Tabs defaultValue="wallpaper" className="h-full flex flex-col">
                    <TabsList className="w-full rounded-none">
                        <TabsTrigger value="wallpaper" className="flex-1 gap-2"><Wallpaper size={16}/> Wallpaper</TabsTrigger>
                        <TabsTrigger value="icons" className="flex-1 gap-2"><Sparkles size={16}/> Icons</TabsTrigger>
                    </TabsList>
                    <TabsContent value="wallpaper" className="flex-1 overflow-y-auto p-4">
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
                    </TabsContent>
                    <TabsContent value="icons" className="flex-1 overflow-y-auto p-4 space-y-6">
                        <div className="space-y-2">
                             <Label className="text-base font-semibold">Icon Color</Label>
                             <div className="flex items-center gap-4">
                                <Palette size={20} />
                                <Input type="color" value={iconColor} onChange={(e) => setIconColor(e.target.value)} className="w-24 h-10 p-1" />
                             </div>
                        </div>

                        <div className="space-y-2">
                             <Label className="text-base font-semibold">Icon Style</Label>
                             <div className="grid grid-cols-2 gap-4">
                                {iconStyles.map((style) => (
                                    <button key={style.id} onClick={() => setIconStyle(style.id)} className={cn("p-4 rounded-lg border-2 flex items-center justify-center", iconStyle === style.id ? 'border-primary ring-2 ring-primary' : 'border-border')}>
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-xl mx-auto mb-2"></div>
                                            <p className="text-sm font-medium">{style.name}</p>
                                        </div>
                                    </button>
                                ))}
                             </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}

export default CustomizeApp;
