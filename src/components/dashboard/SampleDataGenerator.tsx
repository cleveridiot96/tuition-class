
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Database, Loader2 } from "lucide-react";
import { generateSampleData } from "@/utils/dataGeneratorUtils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const SampleDataGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [generationStats, setGenerationStats] = useState<{
    purchaseCount: number;
    saleCount: number;
    paymentCount: number;
    receiptCount: number;
    totalCount: number;
    csvUrl: string;
    csvData?: string;
  } | null>(null);

  const handleGenerateData = async () => {
    setShowConfirmDialog(false);
    setIsGenerating(true);
    
    try {
      toast.info("Generating 200 sample transactions...", {
        duration: 0,
        id: "generate-sample-data"
      });
      
      const stats = await generateSampleData();
      setGenerationStats({
        ...stats,
        csvData: "",  // Add csvData property with empty string for compatibility
      });
      
      toast.success("Sample data generated successfully! CSV file downloaded.", {
        id: "generate-sample-data"
      });
      
      window.dispatchEvent(new CustomEvent('data-updated'));
    } catch (error) {
      console.error("Error generating sample data:", error);
      toast.error("Failed to generate sample data. Please try again.", {
        id: "generate-sample-data"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setShowConfirmDialog(true)}
        disabled={isGenerating}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        size="sm"
      >
        {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Database size={16} />}
        Generate Sample Data
      </Button>
      
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate 200 Sample Transactions</DialogTitle>
            <DialogDescription>
              This will create 200 sample transactions in your system, including purchases, sales, payments, and receipts.
              A CSV file will be downloaded for your reference.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateData}>
              Generate Sample Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Results Dialog */}
      <Dialog open={!!generationStats} onOpenChange={() => setGenerationStats(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sample Data Generated</DialogTitle>
            <DialogDescription>
              Sample data has been successfully generated.
            </DialogDescription>
          </DialogHeader>
          
          {generationStats && (
            <div className="space-y-2">
              <p><strong>Total Transactions:</strong> {generationStats.totalCount}</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Purchases: {generationStats.purchaseCount}</li>
                <li>Sales: {generationStats.saleCount}</li>
                <li>Payments: {generationStats.paymentCount}</li>
                <li>Receipts: {generationStats.receiptCount}</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                A CSV file has been downloaded to your device with all transaction details.
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setGenerationStats(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SampleDataGenerator;
