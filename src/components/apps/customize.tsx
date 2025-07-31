
"use client";

import React from 'react';
import Image from 'next/image';
import { usePhone, IconStyle } from '@/contexts/phone-context';
import { wallpapers } from '@/config/apps';
import { X, Wallpaper, Sparkles, Palette, Smartphone, CornerLeftUp, ArrowDownUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';

const iconStyles: { id: IconStyle, name: string }[] = [
    { id: 'default', name: 'Default' },
    { id: 'glass', name: 'Glass' },
    { id: 'neumorphic', name: 'Neumorphic' },
    { id: 'simple', name: 'Simple' },
]

const IconPreview = () => {
    const { 
        iconStyle, 
        iconColor, 
        iconBackgroundColor,
        iconSize,
        iconRadius
    } = usePhone();

    const styles = {
        default: { iconContainer: "backdrop-blur-md", icon: "text-white" },
        glass: { iconContainer: "backdrop-blur-lg border border-white/20", icon: "text-white" },
        neumorphic: { iconContainer: "bg-zinc-200/50 dark:bg-zinc-800/50 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] dark:shadow-[4px_4px_8px_#1a1a1a,-4px_-4px_8px_#2e2e2e]", icon: "text-zinc-800 dark:text-white" },
        simple: { iconContainer: "bg-transparent", icon: "text-white" }
    }
    const currentStyle = styles[iconStyle] || styles.default;
    const iconFinalColor = iconStyle === 'neumorphic' ? currentStyle.icon : iconColor;
    
    const iconBg = iconStyle === 'default' || iconStyle === 'glass' ? iconBackgroundColor : 'transparent';
    const simpleBg = iconStyle === 'simple' ? iconColor + '40' : 'transparent';

    return (
        <Card className="bg-zinc-800 p-4 flex items-center justify-center" style={{ backgroundImage: `url(https://picsum.photos/seed/1/390/844)` }}>
             <div className="flex flex-col items-center gap-1.5 text-center">
                <div 
                    className={cn("flex items-center justify-center shadow-md", currentStyle.iconContainer)}
                    style={{ 
                        width: `${iconSize}px`,
                        height: `${iconSize}px`,
                        borderRadius: `${iconRadius}px`,
                        backgroundColor: iconStyle === 'simple' ? simpleBg : iconBg,
                     }}
                >
                    <Smartphone 
                        style={{ 
                            color: iconFinalColor,
                            width: `${iconSize * 0.5}px`,
                            height: `${iconSize * 0.5}px`
                         }}
                    />
                </div>
                <span className="text-white text-xs font-medium drop-shadow-md font-sans [text-shadow:0_1px_1px_rgba(0,0,0,0.4)]">Your App</span>
             </div>
        </Card>
    )
}

const CustomizeApp = () => {
    const { 
        setApp, 
        wallpaper, setWallpaper,
        iconStyle, setIconStyle,
        iconColor, setIconColor,
        iconBackgroundColor, setIconBackgroundColor,
        iconSize, setIconSize,
        iconRadius, setIconRadius
    } = usePhone();

    return (
        <div className="bg-background h-full flex flex-col font-sans app-container">
             <header className="p-4 pt-12 bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10 flex items-center justify-between">
                <h1 className="text-xl font-headline font-bold">Customize</h1>
                <button onClick={() => setApp('home')} className="p-1"><X size={20}/></button>
            </header>
            <main className="flex-1 overflow-y-auto">
                 <Tabs defaultValue="wallpaper" className="h-full flex flex-col">
                    <TabsList className="w-full rounded-none sticky top-0 bg-background z-10">
                        <TabsTrigger value="wallpaper" className="flex-1 gap-2"><Wallpaper size={16}/> Wallpaper</TabsTrigger>
                        <TabsTrigger value="icons" className="flex-1 gap-2"><Sparkles size={16}/> Icons</TabsTrigger>
                    </TabsList>
                    <TabsContent value="wallpaper" className="flex-1">
                         <ScrollArea className="h-[calc(100vh-160px)]">
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
                    <TabsContent value="icons" className="flex-1">
                        <ScrollArea className="h-[calc(100vh-160px)]">
                            <div className="p-4 space-y-6">
                                <div>
                                    <Label className="text-base font-semibold mb-2 block">Live Preview</Label>
                                    <IconPreview />
                                </div>

                                <div className="space-y-4">
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

                                <div className="space-y-4">
                                    <Label className="text-base font-semibold">Colors</Label>
                                    <div className="flex items-center gap-4">
                                        <Label htmlFor="icon-color" className="flex items-center gap-2 text-sm text-muted-foreground"><Palette size={16} /> Icon</Label>
                                        <Input id="icon-color" type="color" value={iconColor} onChange={(e) => setIconColor(e.target.value)} className="w-16 h-8 p-0.5" />
                                    </div>
                                    <div className="flex items-center gap-4">
                                    <Label htmlFor="bg-color" className="flex items-center gap-2 text-sm text-muted-foreground"><Wallpaper size={16} /> Background</Label>
                                    <Input id="bg-color" type="color" value={iconBackgroundColor} onChange={(e) => setIconBackgroundColor(e.target.value)} className="w-16 h-8 p-0.5" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-base font-semibold">Sizing & Spacing</Label>
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm text-muted-foreground"><ArrowDownUp size={16} /> Icon Size</Label>
                                        <Slider value={[iconSize]} onValueChange={(v) => setIconSize(v[0])} min={40} max={80} step={2} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm text-muted-foreground"><CornerLeftUp size={16} /> Corner Radius</Label>
                                        <Slider value={[iconRadius]} onValueChange={(v) => setIconRadius(v[0])} min={0} max={40} step={2} />
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}

export default CustomizeApp;
