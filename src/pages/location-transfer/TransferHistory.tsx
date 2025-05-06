
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { getStorageItem } from '@/services/core/storageCore';
import { format } from 'date-fns';

interface TransferHistoryProps {
  limit?: number;
}

const TransferHistory: React.FC<TransferHistoryProps> = ({ limit }) => {
  const [transfers, setTransfers] = useState<any[]>([]);

  useEffect(() => {
    const storedTransfers = getStorageItem<any[]>('locationTransfers') || [];
    const sortedTransfers = storedTransfers.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    if (limit) {
      setTransfers(sortedTransfers.slice(0, limit));
    } else {
      setTransfers(sortedTransfers);
    }
  }, [limit]);

  if (transfers.length === 0) {
    return (
      <Card className="bg-white">
        <CardContent className="pt-6">
          <p className="text-center text-gray-500 py-8">No transfer history found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0 bg-white w-[100px]">Date</TableHead>
                <TableHead className="sticky top-0 bg-white">Item</TableHead>
                <TableHead className="sticky top-0 bg-white">From</TableHead>
                <TableHead className="sticky top-0 bg-white">To</TableHead>
                <TableHead className="sticky top-0 bg-white text-right">Quantity</TableHead>
                <TableHead className="sticky top-0 bg-white">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>{format(new Date(transfer.date), 'dd MMM yyyy')}</TableCell>
                  <TableCell>{transfer.itemName}</TableCell>
                  <TableCell>{transfer.fromLocation}</TableCell>
                  <TableCell>{transfer.toLocation}</TableCell>
                  <TableCell className="text-right">{transfer.quantity} kg</TableCell>
                  <TableCell>{transfer.notes || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TransferHistory;
