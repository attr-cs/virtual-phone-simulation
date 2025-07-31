
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, RotateCw, X, Globe, Lock, Plus, MoreVertical, History, Settings } from 'lucide-react';
import { usePhone } from '@/contexts/phone-context';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Tab {
    id: number;
    url: string;
    title: string;
    history: string[];
    historyIndex: number;
}

const BrowserApp = () => {
    const { setApp } = usePhone();
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [activeTabId, setActiveTabId] = useState<number | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [inputValue, setInputValue] = useState('');

    const activeTab = tabs.find(t => t.id === activeTabId);

    const createNewTab = (url: string) => {
        const newId = Date.now();
        const newTab: Tab = {
            id: newId,
            url: '',
            title: 'New Tab',
            history: [],
            historyIndex: -1,
        };
        setTabs([...tabs, newTab]);
        setActiveTabId(newId);
        // We will navigate in the useEffect for activeTab change
        return newTab;
    };

    const navigate = (tabId: number, newUrl: string) => {
        let fullUrl = newUrl;
        if (!/^https?:\/\//i.test(newUrl)) {
             if (newUrl.includes('.') && !newUrl.includes(' ')) {
                fullUrl = 'https://' + newUrl;
            } else {
                fullUrl = `https://www.google.com/search?q=${encodeURIComponent(newUrl)}`;
            }
        }
        
        setTabs(tabs.map(tab => {
            if (tab.id === tabId) {
                const newHistory = tab.history.slice(0, tab.historyIndex + 1);
                newHistory.push(fullUrl);
                return { ...tab, url: fullUrl, history: newHistory, historyIndex: newHistory.length - 1 };
            }
            return tab;
        }));
    };
    
    useEffect(() => {
        if (tabs.length === 0) {
            const newTab = createNewTab('about:blank');
            navigate(newTab.id, 'https://www.google.com/webhp?igu=1');
        }
    }, [tabs.length]);


    useEffect(() => {
        if (activeTab) {
            const currentUrl = activeTab.history[activeTab.historyIndex] || '';
            if (iframeRef.current) {
                iframeRef.current.src = currentUrl;
            }

            try {
                const urlObject = new URL(currentUrl);
                let formattedUrl = urlObject.hostname.replace(/^www\./, '');
                if (urlObject.pathname !== '/' || urlObject.search) {
                     formattedUrl += (urlObject.pathname + urlObject.search).substring(0, 40) + '...';
                }
                setInputValue(formattedUrl);
                 setTabs(tabs.map(t => t.id === activeTabId ? {...t, title: urlObject.hostname } : t));

            } catch (error) {
                setInputValue(currentUrl);
                setTabs(tabs.map(t => t.id === activeTabId ? {...t, title: "New Tab" } : t));
            }
        } else if (tabs.length > 0) {
            setActiveTabId(tabs[tabs.length - 1].id);
        }
    }, [activeTab?.history, activeTab?.historyIndex]);


    const handleUrlSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && activeTab) {
            const newUrl = e.currentTarget.value;
            navigate(activeTab.id, newUrl);
        }
    };

    const goBack = () => {
        if (activeTab && activeTab.historyIndex > 0) {
            setTabs(tabs.map(t => t.id === activeTab.id ? { ...t, historyIndex: t.historyIndex - 1 } : t));
        }
    };

    const goForward = () => {
        if (activeTab && activeTab.historyIndex < activeTab.history.length - 1) {
             setTabs(tabs.map(t => t.id === activeTab.id ? { ...t, historyIndex: t.historyIndex + 1 } : t));
        }
    };

    const refresh = () => {
        if (iframeRef.current) {
            iframeRef.current.src = iframeRef.current.src;
        }
    };
    
    const closeTab = (tabId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setTabs(tabs.filter(tab => tab.id !== tabId));
    };


  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 h-full flex flex-col font-sans">
      <header className="pt-10 bg-zinc-100 dark:bg-zinc-800 border-b">
         <div className="p-2 flex items-center gap-1.5">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goBack} disabled={!activeTab || activeTab.historyIndex <= 0}><ArrowLeft size={18}/></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goForward} disabled={!activeTab || activeTab.historyIndex >= activeTab.history.length - 1}><ArrowRight size={18}/></Button>
            <div className="flex-1 relative">
                <Lock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleUrlSubmit}
                    className="bg-white dark:bg-zinc-700 h-9 pl-8 text-sm"
                    placeholder="Search or type URL"
                />
                 <Button variant="ghost" size="icon" className="h-8 w-8 absolute right-0 top-1/2 -translate-y-1/2" onClick={refresh}><RotateCw size={16}/></Button>
            </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical size={20}/></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem><History className="mr-2 h-4 w-4"/>History</DropdownMenuItem>
                    <DropdownMenuItem><Settings className="mr-2 h-4 w-4"/>Settings</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setApp('home')}><X className="mr-2 h-4 w-4"/>Close Browser</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
         </div>
         <div className="px-2 pb-1 flex items-center gap-2 overflow-x-auto">
            {tabs.map(tab => (
                 <div key={tab.id} onClick={() => setActiveTabId(tab.id)} className={cn("flex items-center gap-2 py-1.5 px-3 rounded-t-lg min-w-[120px] max-w-[150px] cursor-pointer", activeTabId === tab.id ? 'bg-background' : 'bg-zinc-200 dark:bg-zinc-700')}>
                    <Globe size={14} />
                    <span className="text-xs font-medium truncate flex-1">{tab.title}</span>
                    <button onClick={(e) => closeTab(tab.id, e)} className="p-0.5 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-600"><X size={14}/></button>
                </div>
            ))}
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-700" onClick={() => createNewTab('about:blank')}>
                <Plus size={16} />
            </Button>
         </div>
      </header>
      
      <main className="flex-1 bg-background">
        {activeTab ? <iframe
          ref={iframeRef}
          key={activeTab.id}
          title="Browser"
          className="w-full h-full border-0"
          sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        ></iframe> : <div className="flex items-center justify-center h-full text-muted-foreground">No active tab</div>}
      </main>
    </div>
  );
};

export default BrowserApp;

    