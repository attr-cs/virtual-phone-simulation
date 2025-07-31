
"use client";

import React from 'react';
import { usePhone } from '@/contexts/phone-context';
import { apps, type AppConfig } from '@/config/apps';
import { useToast } from "@/hooks/use-toast"
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const AppIcon = ({ app }: { app: AppConfig }) => {
  const { setApp } = usePhone();
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

  const iconSize = 56;
  const iconRadius = 16;
  const iconBackgroundColor = 'rgba(255, 255, 255, 0.3)';
  const iconColor = '#ffffff';

  const iconContainerStyles: React.CSSProperties = {
    width: `${iconSize}px`,
    height: `${iconSize}px`,
    borderRadius: `${iconRadius}px`,
    backgroundColor: iconBackgroundColor,
  };
  
  const iconProps = {
    style: {
      color: iconColor,
      width: `${iconSize * 0.5}px`,
      height: `${iconSize * 0.5}px`,
    },
    strokeWidth: 2,
  };

  const renderIconContent = () => {
    return (
        <div 
            className={cn(
            "flex items-center justify-center shadow-md transition-all w-full h-full",
            "backdrop-blur-lg border border-white/20 bg-white/10"
            )}
            style={{
                ...iconContainerStyles,
                 borderRadius: `${iconRadius}px`,
            }}
        >
            <Icon 
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
    <motion.button 
        onClick={handleClick} 
        className="flex flex-col items-center gap-1.5 text-center group"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
    >
      <div style={{ width: `${iconSize}px`, height: `${iconSize}px`}}>
        <div style={iconContainerStyles} className="flex items-center justify-center">
            {renderIconContent()}
        </div>
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
    <div className="h-full flex flex-col" onContextMenu={handleContextMenu}>
      <AnimatePresence>
        <motion.div 
            key="home-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-between pt-20 pb-8"
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
