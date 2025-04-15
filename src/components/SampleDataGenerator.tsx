
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, DatabaseBackup, Download, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

import { generateSampleData } from '@/utils/demoDataGenerator';

interface SampleDataGeneratorProps {
  onComplete?: () => void;
}

const SampleDataGenerator = ({ onComplete }: SampleDataGeneratorProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    purchaseCount: number;
    saleCount: number;
    paymentCount: number;
    receiptCount: number;
    totalCount: number;
    csvData: string;
  } | null>(null);
  
  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setProgress(10);
      
      // Show progress indicator
      let progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) clearInterval(progressInterval);
          return Math.min(90, prev + 5);
        });
      }, 300);
      
      // Generate sample data
      toast({
        title: "Generating",
        description: "Please wait while we create 200+ transactions..."
      });
      
      const data = await generateSampleData();
      clearInterval(progressInterval);
      setProgress(100);
      
      // Set result
      setResult({
        ...data,
        csvData: "" // Add the missing csvData property
      });
      
      toast({
        title: "Success",
        description: `Successfully created ${data.totalCount} transactions.`
      });
      
      if (onComplete) onComplete();
      
    } catch (error) {
      console.error("Error generating sample data:", error);
      toast({
        title: "Error",
        description: "There was a problem creating the sample data."
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownload = () => {
    if (!result?.csvData) return;
    
    try {
      // Create and download CSV file
      const blob = new Blob([result.csvData], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sample-data.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download",
        description: "Sample data CSV is being downloaded."
      });
    } catch (error) {
      console.error("Error downloading CSV:", error);
      toast({
        title: "Error",
        description: "There was a problem downloading the CSV file."
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DatabaseBackup className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Generate Sample Data</h3>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Create realistic sample data including purchases, sales, payments, and receipts 
            with Indian agricultural commodities, trader names, and billing patterns.
          </p>
          
          {isGenerating && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground flex items-center">
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Generating {progress < 30 ? "purchase transactions" : progress < 60 ? "sale transactions" : progress < 90 ? "payment records" : "receipt records"}...
              </p>
            </div>
          )}
          
          {result && !isGenerating && (
            <div className="bg-muted p-3 rounded-md text-sm">
              <div className="flex items-center mb-2">
                <Check className="h-4 w-4 mr-2 text-green-600" />
                <span className="font-medium">Generation Complete</span>
              </div>
              <ul className="space-y-1 pl-6 list-disc">
                <li>Purchases: {result.purchaseCount}</li>
                <li>Sales: {result.saleCount}</li>
                <li>Payments: {result.paymentCount}</li>
                <li>Receipts: {result.receiptCount}</li>
                <li className="font-medium">Total Transactions: {result.totalCount}</li>
              </ul>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
              {!isGenerating && <DatabaseBackup className="h-4 w-4" />}
              Generate 200+ Demo Transactions
            </Button>
            
            {result && (
              <Button 
                variant="outline" 
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SampleDataGenerator;
