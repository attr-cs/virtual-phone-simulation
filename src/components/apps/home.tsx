
"use client";

import React from 'react';
import { usePhone } from '@/contexts/phone-context';
import { apps, type AppConfig } from '@/config/apps';
import { useToast } from "@/hooks/use-toast"
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Droplet, TreePine, Zap, Shield } from 'lucide-react';

const ThemedIconWrapper = ({ children, iconSize, iconRadius }: { children: React.ReactNode, iconSize: number, iconRadius: number }) => {
    const { iconTheme } = usePhone();
    const borderRadius = `${iconRadius}px`;

    switch (iconTheme) {
        case 'minimalist':
            return <div className="flex items-center justify-center w-full h-full bg-zinc-100 dark:bg-zinc-800" style={{ borderRadius }}>{children}</div>;
        case 'skeuomorphic':
            return <div className="flex items-center justify-center w-full h-full bg-[#d5c5b5] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),0_2px_2px_rgba(255,255,255,0.5)]" style={{ borderRadius }}>{children}</div>;
        case 'pixel':
            return <div className="flex items-center justify-center w-full h-full bg-[#4a00e0] image-rendering-pixelated" style={{ borderRadius }}>{children}</div>;
        case 'nature-inspired':
             return (
                <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-green-200 to-emerald-400" style={{ borderRadius }}>
                    <div className="absolute inset-0 bg-repeat bg-center opacity-10" style={{backgroundImage: 'url(/wood-pattern.svg)'}}></div>
                    <Leaf className="absolute -top-1 -right-1 text-green-700/80" size={iconSize * 0.4}/>
                    <Droplet className="absolute -bottom-1 -left-1 text-blue-500/70" size={iconSize * 0.3} />
                    {children}
                </div>
            );
        case 'tech-scifi':
            const hexPath = "M30.05 3.35a2 2 0 0 1 1.73 1L38.63 18a2 2 0 0 1 0 2l-6.85 13.65a2 2 0 0 1-1.73 1H8.15a2 2 0 0 1-1.73-1L-.43 20a2 2 0 0 1 0-2L6.42 4.35a2 2 0 0 1 1.73-1h21.9z";
            return (
                 <div className="relative flex items-center justify-center w-full h-full bg-zinc-900" style={{ clipPath: `url(#hexagon-clip-${iconSize})` }}>
                     <svg className="absolute w-0 h-0">
                        <defs>
                            <clipPath id={`hexagon-clip-${iconSize}`} clipPathUnits="objectBoundingBox">
                                <path d="M0.999 0.25a0.053 0.053 0 0 1 0.046 0.026l0.228 0.457a0.053 0.053 0 0 1 0 0.053l-0.228 0.457A0.053 0.053 0 0 1 0.999 1.25H0.214a0.053 0.053 0 0 1 -0.046 -0.026L-0.06 -0.207A0.053 0.053 0 0 1 -0.06 -0.26l0.228 -0.457A0.053 0.053 0 0 1 0.214 -0.75h0.785z" transform="scale(0.025, 0.025) translate(15, 15)"/>
                            </clipPath>
                        </defs>
                     </svg>
                     <div className="absolute inset-0 bg-cyan-400/20 animate-pulse" />
                     <Zap className="absolute text-yellow-300/80" size={iconSize * 0.8}/>
                     {children}
                </div>
            );
        default:
            return <>{children}</>;
    }
}


const AppIcon = ({ app }: { app: AppConfig }) => {
  const { 
    setApp, 
    iconStyle, 
    iconTheme,
    iconColor,
    iconBackgroundColor,
    iconSize,
    iconRadius 
  } = usePhone();
  const { toast } = useToast();
  const Icon = app.icon;

  const handleClick = () => {
    if (app.component) {
      setApp(app.id);
    } else {
      toast({
        title: "Under Construction",
        description: `The ${app.name} app is not yet available.`,
      })
    }
  };

  const styles = {
    default: { iconContainer: "", icon: "" },
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
  };
  
  const iconProps = {
    style: {
      color: isThemeActive ? (iconTheme === 'minimalist' ? '#000' : '#FFF') : iconColor,
      width: `${iconSize * 0.5}px`,
      height: `${iconSize * 0.5}px`,
      filter: iconTheme === 'skeuomorphic' ? 'drop-shadow(1px 1px 1px rgba(0,0,0,0.4))' : 'none'
    },
    className: cn(!isThemeActive && currentStyle.icon, 'relative z-10'),
    strokeWidth: iconTheme === 'pixel' ? 0 : 2,
    fill: iconTheme === 'pixel' ? 'currentColor' : 'none'
  };

  const renderIconContent = () => {
    const iconEl = <Icon {...iconProps} />;
    
    if (isThemeActive) {
        return <ThemedIconWrapper iconSize={iconSize} iconRadius={iconRadius}>{iconEl}</ThemedIconWrapper>;
    }
    
    return (
        <div 
            className={cn(
            "flex items-center justify-center shadow-md transition-all w-full h-full",
            currentStyle.iconContainer
            )}
            style={iconContainerStyles}
        >
            {iconEl}
        </div>
    )
  }


  return (
    <motion.button 
        onClick={handleClick} 
        className="flex flex-col items-center gap-1.5 text-center group"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
    >
      <div style={{ width: `${iconSize}px`, height: `${iconSize}px`}}>
        {renderIconContent()}
      </div>
      <span className="text-white text-xs font-medium drop-shadow-md font-sans [text-shadow:0_1px_1px_rgba(0,0,0,0.4)]">{app.name}</span>
    </motion.button>
  );
};

const HomeScreen = () => {
  const { setApp } = usePhone();
  const mainApps = apps.filter(app => !app.inDock);
  const dockApps = apps.filter(app => app.inDock);
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setApp('customize');
  }

  return (
    <div className="h-full" onContextMenu={handleContextMenu}>
      <AnimatePresence>
        <motion.div 
            key="home-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full justify-between pt-20 pb-8"
        >
          <div className="grid grid-cols-4 gap-y-6 px-4">
            {mainApps.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <AppIcon app={app} />
              </motion.div>
            ))}
          </div>
          
          <div className="px-4">
              <motion.div 
                className="bg-white/20 backdrop-blur-lg rounded-3xl h-24 flex items-center justify-around px-2"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {dockApps.map((app, i) => (
                   <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                  >
                    <AppIcon app={app} />
                  </motion.div>
                ))}
              </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HomeScreen;
