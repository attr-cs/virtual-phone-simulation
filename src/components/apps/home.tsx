
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
    default: { iconContainer: "backdrop-blur-md", icon: "" },
    glass: { iconContainer: "backdrop-blur-lg border border-white/20 bg-white/10", icon: "text-white" },
    neumorphic: { iconContainer: "bg-zinc-200/80 dark:bg-zinc-800/80 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] dark:shadow-[4px_4px_8px_#1a1a1a,-4px_-4px_8px_#2e2e2e]", icon: "text-zinc-800 dark:text-white" },
    simple: { iconContainer: "bg-transparent", icon: "text-white" }
  };

  const isThemeActive = iconTheme !== 'none';
  const isDefaultStyle = iconStyle === 'default' && !isThemeActive;

  const currentStyle = isThemeActive ? styles.default : (styles[iconStyle] || styles.default);

  const iconContainerStyles: React.CSSProperties = {
    width: `${iconSize}px`,
    height: `${iconSize}px`,
  };
  
  if (isDefaultStyle) {
    iconContainerStyles.backgroundColor = iconBackgroundColor;
    iconContainerStyles.borderRadius = `${iconRadius}px`;
  } else if (!isThemeActive) {
    iconContainerStyles.borderRadius = (iconStyle === 'simple' ? '0px' : '16px');
  }

  const iconProps = {
    style: {
      color: isDefaultStyle ? iconColor : undefined,
      width: `${iconSize * 0.5}px`,
      height: `${iconSize * 0.5}px`,
    },
    className: isDefaultStyle ? '' : currentStyle.icon,
  };

  const renderIconContent = () => {
    if (isThemeActive) {
        let themeName = app.name.substring(0, 3);
         return <div className={cn("flex items-center justify-center w-full h-full text-white font-bold text-xs bg-cover bg-center", 
            iconTheme === 'minimalist' && "bg-zinc-100 text-black",
            iconTheme === 'skeuomorphic' && "bg-amber-300 text-black shadow-inner",
            iconTheme === 'pixel' && "bg-purple-500 text-white font-mono"
        )} style={{ borderRadius: `${iconRadius}px`}}>{themeName}</div>
    }
    return (
        <div 
            className={cn(
            "flex items-center justify-center shadow-md transition-all w-full h-full",
            currentStyle.iconContainer
            )}
            style={iconContainerStyles}
        >
            <Icon {...iconProps} />
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
