
"use client";

import React from 'react';
import Image from 'next/image';
import { usePhone } from '@/contexts/phone-context';
import { wallpapers } from '@/config/apps';
import { X, Wallpaper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CustomizeApp = () => {
    const { setApp, wallpaper, setWallpaper } = usePhone();

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
                </Tabs>
            </main>
        </div>
    )
}

export default CustomizeApp;
