
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Calculator: React.FC = () => {
  const [num1, setNum1] = useState<number>(0);
  const [num2, setNum2] = useState<number>(0);
  const [operation, setOperation] = useState<string>("add");
  const [result, setResult] = useState<number | string>(0);

  const calculate = () => {
    switch (operation) {
      case "add":
        setResult(num1 + num2);
        break;
      case "subtract":
        setResult(num1 - num2);
        break;
      case "multiply":
        setResult(num1 * num2);
        break;
      case "divide":
        if (num2 === 0) {
          setResult("Cannot divide by zero");
        } else {
          setResult(num1 / num2);
        }
        break;
      default:
        setResult(0);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Business Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="num1">First Number</Label>
            <Input
              id="num1"
              type="number"
              value={num1}
              onChange={(e) => setNum1(Number(e.target.value))}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="operation">Operation</Label>
            <Select
              value={operation}
              onValueChange={(value) => setOperation(value)}
            >
              <SelectTrigger id="operation">
                <SelectValue placeholder="Select operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add (+)</SelectItem>
                <SelectItem value="subtract">Subtract (-)</SelectItem>
                <SelectItem value="multiply">Multiply (×)</SelectItem>
                <SelectItem value="divide">Divide (÷)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="num2">Second Number</Label>
            <Input
              id="num2"
              type="number"
              value={num2}
              onChange={(e) => setNum2(Number(e.target.value))}
            />
          </div>
          
          <Button onClick={calculate} className="w-full">Calculate</Button>
          
          <div className="grid gap-2 mt-2">
            <Label htmlFor="result">Result</Label>
            <Input
              id="result"
              value={typeof result === 'number' ? result.toLocaleString() : result}
              readOnly
              className="bg-muted font-medium"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Calculator;
