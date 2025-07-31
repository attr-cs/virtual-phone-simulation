
"use client";

import React from 'react';
import { usePhone } from '@/contexts/phone-context';
import { apps, type AppConfig } from '@/config/apps';
import { useToast } from "@/hooks/use-toast"
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const AppIcon = ({ app }: { app: AppConfig }) => {
  const { 
    setApp, 
    iconStyle, 
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
    default: {
      iconContainer: "backdrop-blur-md",
      icon: "text-white"
    },
    glass: {
      iconContainer: "backdrop-blur-lg border border-white/20",
      icon: "text-white"
    },
    neumorphic: {
      iconContainer: "bg-zinc-200/50 dark:bg-zinc-800/50 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] dark:shadow-[4px_4px_8px_#1a1a1a,-4px_-4px_8px_#2e2e2e]",
      icon: "text-zinc-800 dark:text-white"
    },
    simple: {
      iconContainer: "bg-transparent",
      icon: "text-white"
    }
  }

  const currentStyle = styles[iconStyle] || styles.default;
  const iconFinalColor = iconStyle === 'neumorphic' ? currentStyle.icon : iconColor;
  
  const iconBg = iconStyle === 'default' || iconStyle === 'glass' ? iconBackgroundColor : 'transparent';
  const simpleBg = iconStyle === 'simple' ? iconColor + '40' : 'transparent';

  return (
    <motion.button 
        onClick={handleClick} 
        className="flex flex-col items-center gap-1.5 text-center group"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
    >
      <div 
        className={cn(
          "flex items-center justify-center shadow-md transition-all",
          currentStyle.iconContainer
       )}
       style={{ 
         width: `${iconSize}px`,
         height: `${iconSize}px`,
         borderRadius: `${iconRadius}px`,
         backgroundColor: iconStyle === 'simple' ? simpleBg : iconBg,
        }}
      >
        <Icon 
            style={{ 
              color: iconFinalColor,
              width: `${iconSize * 0.5}px`,
              height: `${iconSize * 0.5}px`,
            }}
        />
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
    <div className="h-full app-container" onContextMenu={handleContextMenu}>
        <div className="flex flex-col h-full justify-between pt-20 pb-8">
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
        </div>
    </div>
  );
};

export default HomeScreen;
