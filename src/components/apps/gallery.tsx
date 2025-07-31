"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { galleryImages } from '@/config/apps';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import { usePhone } from '@/contexts/phone-context';

const GalleryApp = () => {
    const { setApp } = usePhone();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="bg-background h-full flex flex-col font-sans">
      <header className="p-4 pt-12 bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10 flex items-center">
        <button onClick={() => setApp('home')} className="p-1 mr-2"><X size={20}/></button>
        <h1 className="text-xl font-headline font-bold">Gallery</h1>
      </header>
      
      <main className="p-2 grid grid-cols-3 gap-1 flex-1 overflow-y-auto">
        <Dialog>
            {galleryImages.map((img) => (
                <DialogTrigger key={img.id} asChild>
                    <Card 
                        className="overflow-hidden aspect-square cursor-pointer transition-transform hover:scale-105"
                        onClick={() => setSelectedImage(img.url)}
                    >
                        <CardContent className="p-0">
                            <Image
                                src={img.url}
                                alt={`Gallery image ${img.id}`}
                                width={200}
                                height={200}
                                className="object-cover w-full h-full"
                                data-ai-hint={img.dataAiHint}
                            />
                        </CardContent>
                    </Card>
                </DialogTrigger>
            ))}
            {selectedImage && (
                <DialogContent className="p-0 max-w-full w-full h-full md:h-auto md:max-w-lg bg-black border-0">
                    <Image
                      src={selectedImage}
                      alt="Selected gallery image"
                      layout="fill"
                      className="object-contain"
                      data-ai-hint="full view"
                    />
                </DialogContent>
            )}
        </Dialog>
      </main>
    </div>
  );
};

export default GalleryApp;
