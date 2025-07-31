
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, RotateCw, X, Globe, Lock } from 'lucide-react';
import { usePhone } from '@/contexts/phone-context';
import { cn } from '@/lib/utils';

const BrowserApp = () => {
    const { setApp } = usePhone();
    const [iframeSrc, setIframeSrc] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [displayUrl, setDisplayUrl] = useState('');
    const [inputValue, setInputValue] = useState('');

    const navigate = (newUrl: string) => {
        let fullUrl = newUrl;
        if (!/^https?:\/\//i.test(newUrl)) {
            if (newUrl.includes('.') && !newUrl.includes(' ')) {
                fullUrl = 'https://' + newUrl;
            } else {
                fullUrl = `https://www.google.com/search?q=${encodeURIComponent(newUrl)}`;
            }
        }
        
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(fullUrl);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    useEffect(() => {
        if (history[historyIndex]) {
            const currentUrl = history[historyIndex];
            setIframeSrc(currentUrl);
            
            try {
                const urlObject = new URL(currentUrl);
                let formattedUrl = urlObject.hostname.replace(/^www\./, '');
                if (urlObject.pathname !== '/' || urlObject.search) {
                    formattedUrl += urlObject.pathname + urlObject.search;
                }
                setDisplayUrl(formattedUrl);
                setInputValue(formattedUrl);
            } catch (error) {
                setDisplayUrl(currentUrl);
                setInputValue(currentUrl);
            }
        }
    }, [history, historyIndex]);

    useEffect(() => {
        // Initial navigation
        navigate('https://www.google.com/webhp?igu=1');
    }, []);


    const handleUrlSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const newUrl = e.currentTarget.value;
            navigate(newUrl);
        }
    };

    const goBack = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
        }
    };

    const goForward = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
        }
    };

    const refresh = () => {
        if (iframeRef.current) {
            iframeRef.current.src = iframeSrc;
        }
    };

  return (
    <div className="bg-white h-full flex flex-col font-sans">
      <header className="p-2 pt-10 bg-zinc-100 dark:bg-zinc-800 border-b flex items-center gap-1.5">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goBack} disabled={historyIndex <= 0}><ArrowLeft size={18}/></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goForward} disabled={historyIndex >= history.length - 1}><ArrowRight size={18}/></Button>
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
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setApp('home')}><X size={20}/></Button>
      </header>
      
      <main className="flex-1 bg-white">
        {iframeSrc ? <iframe
          ref={iframeRef}
          src={iframeSrc}
          title="Browser"
          className="w-full h-full border-0"
          sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        ></iframe> : <div className="flex items-center justify-center h-full text-muted-foreground">Loading...</div>}
      </main>
    </div>
  );
};

export default BrowserApp;
