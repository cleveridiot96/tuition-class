
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Calculator = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const clearDisplay = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (firstOperand === null && !isNaN(inputValue)) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation(operator, firstOperand!, inputValue);
      
      setDisplayValue(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = (op: string, first: number, second: number): number => {
    switch (op) {
      case '+':
        return first + second;
      case '-':
        return first - second;
      case '*':
        return first * second;
      case '/':
        return first / second;
      default:
        return second;
    }
  };

  const handleEquals = () => {
    if (firstOperand === null || operator === null) {
      return;
    }

    const inputValue = parseFloat(displayValue);
    const result = performCalculation(operator, firstOperand, inputValue);
    
    setDisplayValue(String(result));
    setFirstOperand(result);
    setOperator(null);
    setWaitingForSecondOperand(true);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input 
            type="text" 
            value={displayValue} 
            readOnly 
            className="text-right text-2xl font-mono"
          />
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <Button variant="outline" onClick={() => inputDigit('7')}>7</Button>
          <Button variant="outline" onClick={() => inputDigit('8')}>8</Button>
          <Button variant="outline" onClick={() => inputDigit('9')}>9</Button>
          <Button variant="secondary" onClick={() => handleOperator('/')}>/</Button>
          
          <Button variant="outline" onClick={() => inputDigit('4')}>4</Button>
          <Button variant="outline" onClick={() => inputDigit('5')}>5</Button>
          <Button variant="outline" onClick={() => inputDigit('6')}>6</Button>
          <Button variant="secondary" onClick={() => handleOperator('*')}>×</Button>
          
          <Button variant="outline" onClick={() => inputDigit('1')}>1</Button>
          <Button variant="outline" onClick={() => inputDigit('2')}>2</Button>
          <Button variant="outline" onClick={() => inputDigit('3')}>3</Button>
          <Button variant="secondary" onClick={() => handleOperator('-')}>-</Button>
          
          <Button variant="outline" onClick={() => inputDigit('0')}>0</Button>
          <Button variant="outline" onClick={inputDecimal}>.</Button>
          <Button variant="destructive" onClick={clearDisplay}>C</Button>
          <Button variant="secondary" onClick={() => handleOperator('+')}>+</Button>
          
          <Button variant="primary" onClick={handleEquals} className="col-span-4 bg-blue-600 hover:bg-blue-700 text-white">=</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Calculator;
