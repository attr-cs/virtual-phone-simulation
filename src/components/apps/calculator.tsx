"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const handleDigitClick = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleDecimalClick = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };
  
  const handleOperatorClick = (nextOperator: string) => {
    const inputValue = parseFloat(display);
    if (operator && !waitingForSecondOperand) {
       if (firstOperand == null) {
          setFirstOperand(inputValue);
       } else {
          const result = calculate(firstOperand, inputValue, operator);
          setDisplay(String(result));
          setFirstOperand(result);
       }
    } else {
       setFirstOperand(inputValue);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };
  
  const calculate = (first: number, second: number, op: string) => {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '*': return first * second;
      case '/': return first / second;
      default: return second;
    }
  };

  const handleEqualsClick = () => {
    const inputValue = parseFloat(display);
    if (operator && firstOperand !== null) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplay(String(result));
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
    }
  };

  const handleClearClick = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handlePlusMinusClick = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const handlePercentClick = () => {
    setDisplay(String(parseFloat(display) / 100));
  };


  const buttons = [
    { label: 'AC', onClick: handleClearClick, className: 'bg-zinc-400 hover:bg-zinc-500 text-black' },
    { label: '+/-', onClick: handlePlusMinusClick, className: 'bg-zinc-400 hover:bg-zinc-500 text-black' },
    { label: '%', onClick: handlePercentClick, className: 'bg-zinc-400 hover:bg-zinc-500 text-black' },
    { label: '÷', onClick: () => handleOperatorClick('/'), className: 'bg-accent hover:bg-accent/90 text-white' },
    { label: '7', onClick: () => handleDigitClick('7') },
    { label: '8', onClick: () => handleDigitClick('8') },
    { label: '9', onClick: () => handleDigitClick('9') },
    { label: '×', onClick: () => handleOperatorClick('*'), className: 'bg-accent hover:bg-accent/90 text-white' },
    { label: '4', onClick: () => handleDigitClick('4') },
    { label: '5', onClick: () => handleDigitClick('5') },
    { label: '6', onClick: () => handleDigitClick('6') },
    { label: '-', onClick: () => handleOperatorClick('-'), className: 'bg-accent hover:bg-accent/90 text-white' },
    { label: '1', onClick: () => handleDigitClick('1') },
    { label: '2', onClick: () => handleDigitClick('2') },
    { label: '3', onClick: () => handleDigitClick('3') },
    { label: '+', onClick: () => handleOperatorClick('+'), className: 'bg-accent hover:bg-accent/90 text-white' },
    { label: '0', onClick: () => handleDigitClick('0'), className: 'col-span-2' },
    { label: '.', onClick: handleDecimalClick },
    { label: '=', onClick: handleEqualsClick, className: 'bg-accent hover:bg-accent/90 text-white' },
  ];

  return (
    <div className="bg-black h-full flex flex-col p-4 pt-16 font-sans">
      <div className="flex-1 flex justify-end items-end">
        <p className="text-white text-8xl font-light font-headline break-all">{display}</p>
      </div>
      <div className="grid grid-cols-4 gap-3 mt-4">
        {buttons.map((btn, i) => (
          <Button
            key={i}
            onClick={btn.onClick}
            className={cn(
              'h-20 text-3xl rounded-full bg-zinc-700 hover:bg-zinc-600 text-white',
              btn.className
            )}
          >
            {btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CalculatorApp;
