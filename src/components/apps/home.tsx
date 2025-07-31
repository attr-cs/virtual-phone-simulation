
"use client";

import React from 'react';
import { usePhone } from '@/contexts/phone-context';
import { apps, type AppConfig } from '@/config/apps';
import { useToast } from "@/hooks/use-toast"
import { cn } from '@/lib/utils';

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

  return (
    <button onClick={handleClick} className="flex flex-col items-center gap-1.5 text-center group">
      <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform",
          "bg-white/30 backdrop-blur-md"
       )}>
        <Icon className="text-white" size={32} />
      </div>
      <span className="text-white text-xs font-medium drop-shadow-md font-sans [text-shadow:0_1px_1px_rgba(0,0,0,0.4)]">{app.name}</span>
    </button>
  );
};


const HomeScreen = () => {
  const mainApps = apps.filter(app => !app.inDock);
  const dockApps = apps.filter(app => app.inDock);

  return (
    <div className="flex flex-col h-full justify-between pt-20 pb-8">
      <div className="grid grid-cols-4 gap-y-6 px-4">
        {mainApps.map((app) => (
          <AppIcon key={app.id} app={app} />
        ))}
      </div>
      
      <div className="px-4">
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl h-24 flex items-center justify-around px-2">
            {dockApps.map((app) => (
              <AppIcon key={app.id} app={app} />
            ))}
          </div>
      </div>
    </div>
  );
};

export default HomeScreen;
