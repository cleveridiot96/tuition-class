
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransferForm from './TransferForm';
import TransferHistory from './TransferHistory';
import { ArrowLeftRight } from 'lucide-react';

const LocationTransferPage: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('transfers');

  const handleAddTransfer = () => {
    setIsAdding(true);
  };

  const handleTransferComplete = () => {
    setIsAdding(false);
    // Refresh transfer history by switching tabs
    setActiveTab('history');
    setTimeout(() => setActiveTab('transfers'), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navigation title="Location Transfer" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white border-green-200 shadow">
          <CardHeader>
            <CardTitle className="text-green-800">Inventory Location Transfer</CardTitle>
            <CardDescription>
              Transfer inventory items between different locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isAdding ? (
              <>
                <div className="mb-4">
                  <Button onClick={handleAddTransfer} className="bg-green-600 text-white hover:bg-green-700">
                    <ArrowLeftRight className="mr-2 h-4 w-4" />
                    New Transfer
                  </Button>
                </div>
                
                <Tabs defaultValue="transfers" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="transfers">Recent Transfers</TabsTrigger>
                    <TabsTrigger value="history">Transfer History</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="transfers">
                    <TransferHistory />
                  </TabsContent>
                  
                  <TabsContent value="history">
                    <TransferHistory />
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div>
                <h3 className="text-lg font-medium mb-4">New Inventory Transfer</h3>
                <TransferForm 
                  onTransferComplete={handleTransferComplete}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LocationTransferPage;
