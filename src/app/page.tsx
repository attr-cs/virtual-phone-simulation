
"use client";

import React, { useState } from 'react';
import Phone from '@/components/phone';
import { Button } from '@/components/ui/button';
import { Rotate3d } from 'lucide-react';

export default function Home() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-zinc-900 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">Pocketverse</h1>
        <p className="text-muted-foreground">Your world in your pocket.</p>
      </div>
      <Phone isFlipped={isFlipped} />
      <Button 
        variant="outline" 
        className="mt-8"
        onClick={() => setIsFlipped(f => !f)}
      >
        <Rotate3d className="mr-2 h-4 w-4" />
        Flip Phone
      </Button>
    </main>
  );
}
