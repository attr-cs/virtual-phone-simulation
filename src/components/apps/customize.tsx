
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { usePhone, IconStyle, IconTheme } from '@/contexts/phone-context';
import { wallpapers } from '@/config/apps';
import { X, Wallpaper, Sparkles, Palette, Smartphone, CornerLeftUp, ArrowDownUp, Check, ChevronLeft, Leaf, Droplet, Zap } from 'lucide-react';
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

const iconThemes: { id: IconTheme, name: string, description: string }[] = [
    { id: 'minimalist', name: 'Minimalist', description: 'Clean lines, monochrome.' },
    { id: 'skeuomorphic', name: 'Skeuomorphic', description: 'Realistic textures.' },
    { id: 'pixel', name: 'Pixel Art', description: 'Retro 8-bit charm.' },
    { id: 'nature-inspired', name: 'Nature', description: 'Organic forms and colors.' },
    { id: 'tech-scifi', name: 'Sci-Fi', description: 'Futuristic and glowing.' },
]

const ThemeIconPreview = ({ themeId }: { themeId: IconTheme }) => {
    const baseIconSize = 50;
    const baseIconRadius = 12;
    const borderRadius = `${baseIconRadius}px`;

    const iconProps = {
        style: {
            width: `${baseIconSize * 0.5}px`,
            height: `${baseIconSize * 0.5}px`,
        },
        className: 'relative z-10',
    };
    const iconEl = <Smartphone {...iconProps} />;
    
    switch (themeId) {
        case 'minimalist':
            return <div className="flex items-center justify-center w-full h-full bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white" style={{ borderRadius }}>{iconEl}</div>;
        case 'skeuomorphic':
            return <div className="flex items-center justify-center w-full h-full bg-[#d5c5b5] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),0_2px_2px_rgba(255,255,255,0.5)] text-white" style={{ borderRadius }}>{iconEl}</div>;
        case 'pixel':
            return <div className="flex items-center justify-center w-full h-full bg-[#4a00e0] image-rendering-pixelated text-white" style={{ borderRadius }}>{iconEl}</div>;
        case 'nature-inspired':
             return (
                <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-green-200 to-emerald-400 text-white" style={{ borderRadius }}>
                    <div className="absolute inset-0 bg-repeat bg-center opacity-10" style={{backgroundImage: 'url(/wood-pattern.svg)'}}></div>
                    <Leaf className="absolute -top-1 -right-1 text-green-700/80" size={baseIconSize * 0.4}/>
                    <Droplet className="absolute -bottom-1 -left-1 text-blue-500/70" size={baseIconSize * 0.3} />
                    {iconEl}
                </div>
            );
        case 'tech-scifi':
            return (
                 <div className="relative flex items-center justify-center w-full h-full bg-zinc-900" style={{ clipPath: `url(#hexagon-clip-${baseIconSize})` }}>
                     <svg className="absolute w-0 h-0">
                        <defs>
                            <clipPath id={`hexagon-clip-${baseIconSize}`} clipPathUnits="objectBoundingBox">
                                <path d="M0.999 0.25a0.053 0.053 0 0 1 0.046 0.026l0.228 0.457a0.053 0.053 0 0 1 0 0.053l-0.228 0.457A0.053 0.053 0 0 1 0.999 1.25H0.214a0.053 0.053 0 0 1 -0.046 -0.026L-0.06 -0.207A0.053 0.053 0 0 1 -0.06 -0.26l0.228 -0.457A0.053 0.053 0 0 1 0.214 -0.75h0.785z" transform="scale(0.025, 0.025) translate(15, 15)"/>
                            </clipPath>
                        </defs>
                     </svg>
                     <div className="absolute inset-0 bg-cyan-400/20 animate-pulse" />
                     <Zap className="absolute text-yellow-300/80" size={baseIconSize * 0.8}/>
                     {iconEl}
                </div>
            );
        default:
            return <div className="w-full h-full bg-muted"></div>
    }
}


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
        default: { iconContainer: "", icon: "" },
        glass: { iconContainer: "backdrop-blur-lg border border-white/20 bg-white/10", icon: "text-white" },
        neumorphic: { iconContainer: "bg-zinc-200/80 dark:bg-zinc-800/80 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] dark:shadow-[4px_4px_8px_#1a1a1a,-4px_-4px_8px_#2e2e2e]", icon: "text-zinc-800 dark:text-white" },
        simple: { iconContainer: "bg-transparent", icon: "text-white" }
    };
    
    const isThemeActive = iconTheme !== 'none';
    
    const currentStyle = styles[iconStyle] || styles.default;
    
    const iconContainerStyles: React.CSSProperties = {
        borderRadius: `${iconRadius}px`,
        backgroundColor: iconBackgroundColor,
    };
    
    const iconStylesFromContext: React.CSSProperties = {
        color: iconColor,
        width: `${iconSize * 0.5}px`,
        height: `${iconSize * 0.5}px`
    };

    let content;
    if (isThemeActive) {
        content = <ThemeIconPreview themeId={iconTheme} />
    } else {
         content = (
            <div 
                className={cn("flex items-center justify-center shadow-md transition-all w-full h-full", currentStyle.iconContainer)}
                style={{...iconContainerStyles, borderRadius: `${iconRadius}px`}}
            >
                <Smartphone 
                    className={cn(currentStyle.icon)}
                    style={iconStylesFromContext}
                />
            </div>
        )
    }

    return (
        <Card className="bg-zinc-800 p-4 flex items-center justify-center bg-cover bg-center h-[200px]" style={{ backgroundImage: `url(https://picsum.photos/seed/1/390/844)` }}>
             <motion.div 
                layout 
                className="flex flex-col items-center justify-center gap-1.5 text-center"
                style={{ width: `${iconSize}px`, height: `${iconSize}px`}}
            >
                {content}
             </motion.div>
             <div className="absolute bottom-4 text-center">
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
        iconTheme, setIconTheme,
        iconColor, setIconColor,
        iconBackgroundColor, setIconBackgroundColor,
        iconSize, setIconSize,
        iconRadius, setIconRadius
    } = usePhone();

    const [view, setView] = useState<'main' | 'themes'>('main');
    const [activeTab, setActiveTab] = useState('wallpaper');

    const isThemeActive = iconTheme !== 'none';

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
                                     <div className="w-[50px] h-[50px]">
                                        <ThemeIconPreview themeId={theme.id} />
                                     </div>
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
                                </div>
                                
                                <div className={cn("space-y-4 transition-opacity", isThemeActive && "opacity-50 pointer-events-none")}>
                                    <Label className="text-base font-semibold">Style Controls</Label>
                                    <Label className="flex items-center gap-2 text-sm text-muted-foreground"><CornerLeftUp size={16} /> Corner Radius</Label>
                                    <Slider value={[iconRadius]} onValueChange={(v) => setIconRadius(v[0])} min={0} max={40} step={2} />
                                </div>


                                <div className="space-y-4">
                                     <Label className="text-base font-semibold">Icon Theme</Label>
                                     <Card className="cursor-pointer hover:bg-muted" onClick={() => setView('themes')}>
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold">{iconTheme === 'none' ? 'None' : iconThemes.find(t => t.id === iconTheme)?.name}</h3>
                                                <p className="text-sm text-muted-foreground">Select a pre-designed theme.</p>
                                            </div>
                                            {iconTheme !== 'none' && 
                                                <div className="w-10 h-10">
                                                    <ThemeIconPreview themeId={iconTheme} />
                                                </div>
                                            }
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
