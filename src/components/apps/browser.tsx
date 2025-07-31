"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, RotateCw, X, Globe, Lock } from 'lucide-react';
import { usePhone } from '@/contexts/phone-context';
import { cn } from '@/lib/utils';

const BrowserApp = () => {
    const { setApp } = usePhone();
    const [url, setUrl] = useState('https://www.google.com/webhp?igu=1');
    const [history, setHistory] = useState<string[]>(['https://www.google.com/webhp?igu=1']);
    const [historyIndex, setHistoryIndex] = useState(0);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [displayUrl, setDisplayUrl] = useState('https://www.google.com');

    const navigate = (newUrl: string) => {
        let fullUrl = newUrl;
        if (!/^https?:\/\//i.test(newUrl)) {
            fullUrl = 'https://' + newUrl;
        }
        setUrl(fullUrl);
        
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(fullUrl);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        
        // Update display url.
        try {
            const urlObject = new URL(fullUrl);
            setDisplayUrl(urlObject.hostname);
        } catch (error) {
            setDisplayUrl(fullUrl);
        }
    };

    const handleUrlSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const newUrl = e.currentTarget.value;
            navigate(newUrl);
        }
    };

    const goBack = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setUrl(history[newIndex]);
        }
    };

    const goForward = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setUrl(history[newIndex]);
        }
    };

    const refresh = () => {
        if (iframeRef.current) {
            iframeRef.current.src = url;
        }
    };

  return (
    <div className="bg-white h-full flex flex-col font-sans">
      <header className="p-2 pt-10 bg-zinc-100 dark:bg-zinc-800 border-b flex items-center gap-1.5">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goBack} disabled={historyIndex === 0}><ArrowLeft size={18}/></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goForward} disabled={historyIndex >= history.length - 1}><ArrowRight size={18}/></Button>
        <div className="flex-1 relative">
            <Lock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
                type="text"
                defaultValue={displayUrl}
                onKeyDown={handleUrlSubmit}
                className="bg-white dark:bg-zinc-700 h-9 pl-8 text-sm"
            />
             <Button variant="ghost" size="icon" className="h-8 w-8 absolute right-0 top-1/2 -translate-y-1/2" onClick={refresh}><RotateCw size={16}/></Button>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setApp('home')}><X size={20}/></Button>
      </header>
      
      <main className="flex-1 bg-white">
        <iframe
          ref={iframeRef}
          src={url}
          title="Browser"
          className="w-full h-full border-0"
          sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          onLoad={() => {
            try {
                if(iframeRef.current) {
                    const frameUrl = iframeRef.current.contentWindow?.location.href || url;
                    const urlObject = new URL(frameUrl);
                    setDisplayUrl(urlObject.hostname);
                }
            } catch (e) {
                // Can't access location due to cross-origin policy
                const urlObject = new URL(url);
                setDisplayUrl(urlObject.hostname);
            }
          }}
        ></iframe>
      </main>
    </div>
  );
};

export default BrowserApp;
