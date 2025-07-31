
"use client";

import React, { useState } from 'react';
import { usePhone } from '@/contexts/phone-context';
import { X, ChevronLeft, Gamepad2, Circle, X as TicTacToeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SnakeGame from './snake-game';
import { Card, CardContent } from '../ui/card';

const GameIcon = ({ icon, name, onClick }: { icon: React.ReactNode, name: string, onClick: () => void }) => (
    <div className="flex flex-col items-center gap-2" onClick={onClick}>
        <Card className="w-24 h-24 flex items-center justify-center bg-primary/10 border-2 border-primary/50 cursor-pointer hover:bg-primary/20 transition-colors">
            {icon}
        </Card>
        <span className="font-medium text-sm">{name}</span>
    </div>
);

const GamesApp = () => {
    const { setApp } = usePhone();
    const [activeGame, setActiveGame] = useState<string | null>(null);

    const renderGameHub = () => (
        <>
             <header className="p-4 pt-12 bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10 flex items-center justify-between">
                <h1 className="text-xl font-headline font-bold">Games</h1>
                <Button variant="ghost" size="icon" onClick={() => setApp('home')}><X size={20}/></Button>
            </header>
            <main className="p-8 flex items-center justify-center gap-6">
                <GameIcon icon={<Gamepad2 className="w-12 h-12 text-primary"/>} name="Snake" onClick={() => setActiveGame('snake')} />
                <GameIcon icon={<TicTacToeIcon className="w-12 h-12 text-primary"/>} name="Tic-Tac-Toe" onClick={() => {}} />
                <GameIcon icon={<Circle className="w-12 h-12 text-primary"/>} name="Memory" onClick={() => {}} />
            </main>
        </>
    );

    const renderActiveGame = () => {
        switch(activeGame) {
            case 'snake':
                return <SnakeGame onExit={() => setActiveGame(null)} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-background h-full flex flex-col font-sans">
            {activeGame ? renderActiveGame() : renderGameHub()}
        </div>
    );
};

export default GamesApp;
