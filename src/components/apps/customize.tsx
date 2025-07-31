
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { usePhone, IconStyle, IconTheme } from '@/contexts/phone-context';
import { wallpapers } from '@/config/apps';
import { X, Wallpaper, Sparkles, Palette, Smartphone, CornerLeftUp, ArrowDownUp, Check, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

const iconStyles: { id: IconStyle, name: string }[] = [
    { id: 'default', name: 'Default' },
    { id: 'glass', name: 'Glass' },
    { id: 'neumorphic', name: 'Neumorphic' },
    { id: 'simple', name: 'Simple' },
]

const iconThemes: { id: IconTheme, name: string, description: string, preview: string }[] = [
    { id: 'minimalist', name: 'Minimalist', description: 'Clean lines, monochrome.', preview: 'https://placehold.co/100x100/f0f0f0/111111?text=Aa' },
    { id: 'skeuomorphic', name: 'Skeuomorphic', description: 'Realistic textures.', preview: 'https://placehold.co/100x100/d2b48c/4a3b2a?text=Aa' },
    { id: 'pixel', name: 'Pixel Art', description: 'Retro 8-bit charm.', preview: 'https://placehold.co/100x100/4a00e0/ffffff?text=Aa' },
    { id: 'nature-inspired', name: 'Nature', description: 'Organic forms and colors.', preview: 'https://placehold.co/100x100/228B22/ffffff?text=Aa' },
    { id: 'tech-scifi', name: 'Sci-Fi', description: 'Futuristic and glowing.', preview: 'https://placehold.co/100x100/00ffff/000000?text=Aa' },
]

const IconPreview = () => {
    const { 
        iconStyle, 
        iconTheme,
        iconColor, 
        iconBackgroundColor,
        iconSize,
        iconRadius
    } = usePhone();

    const styles = {
        default: { iconContainer: "bg-zinc-800", icon: "" },
        glass: { iconContainer: "backdrop-blur-lg border border-white/20 bg-white/10", icon: "text-white" },
        neumorphic: { iconContainer: "bg-zinc-200/80 dark:bg-zinc-800/80 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] dark:shadow-[4px_4px_8px_#1a1a1a,-4px_-4px_8px_#2e2e2e]", icon: "text-zinc-800 dark:text-white" },
        simple: { iconContainer: "bg-transparent", icon: "text-white" }
    };
    
    const isThemeActive = iconTheme !== 'none';
    
    const currentStyle = styles[iconStyle] || styles.default;
    
    const iconContainerStyles: React.CSSProperties = {
        width: `${iconSize}px`,
        height: `${iconSize}px`,
        borderRadius: `${iconRadius}px`,
        backgroundColor: iconBackgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    let content;
    if (isThemeActive) {
        const theme = iconThemes.find(t => t.id === iconTheme);
        content = (
             <div 
                className={cn("flex items-center justify-center w-full h-full text-white font-bold text-xs bg-cover bg-center")}
                style={{ 
                    backgroundImage: `url(${theme?.preview})`,
                    backgroundSize: 'cover',
                    borderRadius: `${iconRadius}px`,
                    width: `${iconSize}px`,
                    height: `${iconSize}px`,
                }}
            >
                <Smartphone size={iconSize * 0.5} />
            </div>
        )
    } else {
         content = (
            <div 
                className={cn("flex items-center justify-center shadow-md transition-all", currentStyle.iconContainer)}
                style={iconContainerStyles}
            >
                <Smartphone 
                    className={cn(currentStyle.icon)}
                    style={{ 
                        color: iconColor,
                        width: `${iconSize * 0.5}px`,
                        height: `${iconSize * 0.5}px`
                     }}
                />
            </div>
        )
    }

    return (
        <Card className="bg-zinc-800 p-4 flex items-center justify-center bg-cover bg-center h-[200px]" style={{ backgroundImage: `url(https://picsum.photos/seed/1/390/844)` }}>
             <motion.div layout className="flex flex-col items-center gap-1.5 text-center">
                {content}
                <span className="text-white text-xs font-medium drop-shadow-md font-sans [text-shadow:0_1px_1px_rgba(0,0,0,0.4)]">Your App</span>
             </motion.div>
        </Card>
    )
}

const CustomizeApp = () => {
    const { 
        setApp, 
        wallpaper, setWallpaper,
        iconStyle, setIconStyle,
        iconTheme, setIconTheme,
        iconColor, setIconColor,
        iconBackgroundColor, setIconBackgroundColor,
        iconSize, setIconSize,
        iconRadius, setIconRadius
    } = usePhone();

    const [view, setView] = useState<'main' | 'themes'>('main');
    const [activeTab, setActiveTab] = useState('wallpaper');

    const isThemeActive = iconTheme !== 'none';
    const areControlsDisabled = isThemeActive;

    const handleThemeSelection = (themeId: IconTheme) => {
        setIconTheme(themeId);
        setView('main');
        setActiveTab('icons');
    }

    if (view === 'themes') {
        return (
             <div className="bg-background h-full flex flex-col font-sans app-container">
                <header className="p-4 pt-12 bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10 flex items-center shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 mr-2" onClick={() => setView('main')}><ChevronLeft size={20}/></Button>
                    <h1 className="text-xl font-headline font-bold">Icon Themes</h1>
                </header>
                <ScrollArea className="flex-1 min-h-0" hideScrollbar>
                    <div className="p-4 grid grid-cols-2 gap-4">
                        <Card 
                            className={cn("overflow-hidden cursor-pointer transition-all", 'none' === iconTheme ? 'border-primary ring-2 ring-primary scale-105' : 'border-border')}
                             onClick={() => handleThemeSelection('none')}
                        >
                            <CardHeader>
                                <CardTitle className="text-lg">None</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Use customizable styles.</p>
                            </CardContent>
                        </Card>
                        {iconThemes.map((theme) => (
                             <Card 
                                key={theme.id} 
                                className={cn("overflow-hidden cursor-pointer transition-all", theme.id === iconTheme ? 'border-primary ring-2 ring-primary scale-105' : 'border-border')}
                                onClick={() => handleThemeSelection(theme.id)}
                            >
                                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                     <Image src={theme.preview} width={50} height={50} alt={theme.name} className="rounded-lg" data-ai-hint="icon theme preview" />
                                     <CardTitle className="text-lg">{theme.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{theme.description}</p>
                                </CardContent>
                             </Card>
                        ))}
                    </div>
                </ScrollArea>
             </div>
        )
    }

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
                 <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                    <TabsList className="w-full rounded-none bg-background z-10 shrink-0 grid grid-cols-2">
                        <TabsTrigger value="wallpaper" className="flex-1 gap-2"><Wallpaper size={16}/> Wallpaper</TabsTrigger>
                        <TabsTrigger value="icons" className="flex-1 gap-2"><Sparkles size={16}/> Icons</TabsTrigger>
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
                    <TabsContent value="icons" className="flex-1 min-h-0 flex flex-col">
                        <div className="sticky top-0 bg-background/80 backdrop-blur-sm py-4 z-10 -mx-4 px-4 border-b">
                            <Label className="text-base font-semibold mb-2 block px-4">Live Preview</Label>
                            <IconPreview />
                        </div>
                        <ScrollArea className="flex-1" hideScrollbar>
                            <div className="p-4 space-y-6">
                                
                                <div className={"space-y-4"}>
                                    <Label className="text-base font-semibold">Icon Size</Label>
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm text-muted-foreground"><ArrowDownUp size={16} /> Size</Label>
                                        <Slider value={[iconSize]} onValueChange={(v) => setIconSize(v[0])} min={40} max={80} step={2} />
                                    </div>
                                </div>
                                
                                <div className={cn("space-y-4 transition-opacity", isThemeActive && "opacity-50 pointer-events-none")}>
                                    <Label className="text-base font-semibold">Icon Style</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                    {iconStyles.map((style) => (
                                        <button key={style.id} onClick={() => setIconStyle(style.id)} className={cn("p-4 rounded-lg border-2 flex flex-col items-center justify-center gap-2", iconStyle === style.id ? 'border-primary ring-2 ring-primary' : 'border-border')}>
                                            <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-xl"></div>
                                            <p className="text-sm font-medium">{style.name}</p>
                                        </button>
                                    ))}
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

                                    <div className="space-y-2">
                                        <Label className="text-base font-semibold">Style Controls</Label>
                                        <Label className="flex items-center gap-2 text-sm text-muted-foreground"><CornerLeftUp size={16} /> Corner Radius</Label>
                                        <Slider value={[iconRadius]} onValueChange={(v) => setIconRadius(v[0])} min={0} max={40} step={2} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                     <Label className="text-base font-semibold">Icon Theme</Label>
                                     <Card className="cursor-pointer hover:bg-muted" onClick={() => setView('themes')}>
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold">{iconTheme === 'none' ? 'None' : iconThemes.find(t => t.id === iconTheme)?.name}</h3>
                                                <p className="text-sm text-muted-foreground">Select a pre-designed theme.</p>
                                            </div>
                                            {iconTheme !== 'none' && <Image src={iconThemes.find(t => t.id === iconTheme)?.preview || ''} width={40} height={40} alt="theme preview" className="rounded-md" />}
                                        </CardContent>
                                     </Card>
                                </div>
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </div>
        </motion.div>
    )
}

export default CustomizeApp;
