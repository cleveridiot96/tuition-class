
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import TransferForm from '@/components/location-transfer/TransferForm';
import { getInventory } from '@/services/inventoryService';
import { InventoryItem } from '@/services/types';

const LocationTransferPage = () => {
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transfers, setTransfers] = useState<InventoryItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const inventoryData = getInventory() || [];
    setInventory(inventoryData);
    
    // Find all items with transferredFrom property (indicating a transfer)
    const transferredItems = inventoryData.filter(item => item.transferredFrom);
    setTransfers(transferredItems);
  };

  const handleTransferComplete = () => {
    setShowTransferForm(false);
    loadData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navigation title="Inventory Transfers" showBackButton />
      <div className="container mx-auto px-4 py-6">
        {showTransferForm ? (
          <TransferForm 
            onCancel={() => setShowTransferForm(false)} 
            onSubmit={handleTransferComplete} 
          />
        ) : (
          <Card className="bg-white border-green-100 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-2xl font-bold text-green-800">
                Location Transfers
              </CardTitle>
              <Button 
                onClick={() => setShowTransferForm(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="mr-2 h-4 w-4" /> New Transfer
              </Button>
            </CardHeader>
            <CardContent>
              {transfers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Lot Number</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>From Location</TableHead>
                      <TableHead>To Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transfers.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell>
                          {format(new Date(transfer.dateAdded), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>{transfer.lotNumber}</TableCell>
                        <TableCell>{transfer.quantity}</TableCell>
                        <TableCell>{transfer.transferredFrom}</TableCell>
                        <TableCell>{transfer.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No transfer records found. Start by creating a new transfer.
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LocationTransferPage;
