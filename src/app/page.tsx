
"use client";

import React, { useState } from 'react';
import Phone from '@/components/phone';
import { Button } from '@/components/ui/button';
import { Rotate3d } from 'lucide-react';

export default function Home() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="flex items-center gap-8">
        <Phone isFlipped={isFlipped} />
        <div className="hidden md:flex flex-col gap-4">
          <Button 
            variant="outline"
            className="bg-white/50 backdrop-blur-sm"
            onClick={() => setIsFlipped(f => !f)}
          >
            <Rotate3d className="mr-2 h-4 w-4" />
            Flip Phone
          </Button>
        </div>
      </div>
       <Button 
        variant="outline" 
        className="md:hidden fixed bottom-4 right-4 bg-white/50 backdrop-blur-sm"
        onClick={() => setIsFlipped(f => !f)}
        size="icon"
      >
        <Rotate3d className="h-4 w-4" />
      </Button>
    </main>
  );
}
