
"use client";

import React from 'react';
import Image from 'next/image';
import { usePhone } from '@/contexts/phone-context';
import { wallpapers } from '@/config/apps';
import { X, Wallpaper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

const CustomizeApp = () => {
    const { 
        setApp, 
        wallpaper, setWallpaper,
    } = usePhone();

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-background h-full flex flex-col font-sans"
        >
             <header className="p-4 pt-12 bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10 flex items-center justify-between shrink-0">
                <h1 className="text-xl font-headline font-bold">Customize</h1>
                <button onClick={() => setApp('home')} className="p-1"><X size={20}/></button>
            </header>
             <div className="flex-1 flex flex-col min-h-0">
                 <Tabs defaultValue="wallpaper" className="h-full flex flex-col">
                    <TabsList className="w-full rounded-none bg-background z-10 shrink-0">
                        <TabsTrigger value="wallpaper" className="flex-1 gap-2"><Wallpaper size={16}/> Wallpaper</TabsTrigger>
                    </TabsList>
                    <TabsContent value="wallpaper" className="flex-1 min-h-0">
                         <ScrollArea className="h-full" hideScrollbar>
                            <div className="p-4 grid grid-cols-3 gap-4">
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
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </div>
        </motion.div>
    )
}

export default CustomizeApp;
