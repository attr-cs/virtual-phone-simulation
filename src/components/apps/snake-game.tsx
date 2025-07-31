
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const GRID_SIZE = 20;
const TILE_SIZE = 100 / GRID_SIZE; // as percentage
const GAME_SPEED = 150; // ms

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number, y: number };

const getRandomPosition = (): Position => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

const SnakeGame = ({ onExit }: { onExit: () => void }) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>(getRandomPosition());
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const touchStartRef = useRef<Position | null>(null);

  const gameLoopRef = useRef<NodeJS.Timeout>();

  const restartGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomPosition());
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
  };
  
  const moveSnake = () => {
    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check for wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check for self collision
      for (const segment of newSnake) {
        if (segment.x === head.x && segment.y === head.y) {
          setIsGameOver(true);
          return prevSnake;
        }
      }

      newSnake.unshift(head);

      // Check for food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 1);
        setFood(getRandomPosition());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  };

  useEffect(() => {
    restartGame();
    return () => {
        if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current);
        }
    };
  }, []);

  useEffect(() => {
    if (isGameOver && gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
  }, [isGameOver]);

  const handleKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    setDirection(prevDirection => {
      switch (e.key) {
        case 'ArrowUp':
          return prevDirection !== 'DOWN' ? 'UP' : prevDirection;
        case 'ArrowDown':
          return prevDirection !== 'UP' ? 'DOWN' : prevDirection;
        case 'ArrowLeft':
          return prevDirection !== 'RIGHT' ? 'LEFT' : prevDirection;
        case 'ArrowRight':
          return prevDirection !== 'LEFT' ? 'RIGHT' : prevDirection;
        default:
          return prevDirection;
      }
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touchEnd = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    const dx = touchEnd.x - touchStartRef.current.x;
    const dy = touchEnd.y - touchStartRef.current.y;

    if (Math.abs(dx) > Math.abs(dy)) { // Horizontal swipe
        if (dx > 0) setDirection(d => d !== 'LEFT' ? 'RIGHT' : d);
        else setDirection(d => d !== 'RIGHT' ? 'LEFT' : d);
    } else { // Vertical swipe
        if (dy > 0) setDirection(d => d !== 'UP' ? 'DOWN' : d);
        else setDirection(d => d !== 'DOWN' ? 'UP' : d);
    }
    touchStartRef.current = null; // Reset after one swipe
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  return (
    <div 
        className="bg-zinc-800 h-full flex flex-col font-sans text-white relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
    >
        <header className="p-4 pt-12 flex items-center justify-between z-10">
            <Button variant="ghost" onClick={onExit}><ChevronLeft className="mr-2 h-4 w-4"/> Exit</Button>
            <div className="font-bold text-lg">Score: {score}</div>
        </header>
        
        <main className="flex-1 flex items-center justify-center">
            <div 
                className="relative bg-zinc-900 aspect-square w-full max-w-[400px] border-4 border-zinc-700 rounded-lg"
                style={{ height: 'auto', maxHeight: '100%' }}
            >
                {snake.map((segment, index) => (
                    <div
                        key={index}
                        className="absolute bg-green-500 rounded-sm"
                        style={{ 
                            left: `${segment.x * TILE_SIZE}%`, 
                            top: `${segment.y * TILE_SIZE}%`,
                            width: `${TILE_SIZE}%`,
                            height: `${TILE_SIZE}%`,
                            backgroundColor: index === 0 ? '#34D399' : '#10B981',
                        }}
                    />
                ))}
                 <div
                    className="absolute bg-red-500 rounded-full"
                    style={{ 
                        left: `${food.x * TILE_SIZE}%`, 
                        top: `${food.y * TILE_SIZE}%`,
                        width: `${TILE_SIZE}%`,
                        height: `${TILE_SIZE}%`,
                    }}
                />
            </div>
        </main>
        {isGameOver && (
             <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4 z-20">
                <h2 className="text-4xl font-bold">Game Over</h2>
                <p>Your score: {score}</p>
                <Button onClick={restartGame} variant="secondary">Play Again</Button>
            </div>
        )}

    </div>
  );
};

export default SnakeGame;

