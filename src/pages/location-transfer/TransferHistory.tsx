
import React from "react";
import { getTransferHistory } from "@/services/transferService";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TransferHistory = () => {
  const transferHistory = getTransferHistory();
  
  // Sort transfers by date (most recent first)
  const sortedTransfers = [...transferHistory].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  if (sortedTransfers.length === 0) {
    return <p className="text-center py-6 text-gray-500">No transfer history found.</p>;
  }
  
  return (
    <ScrollArea className="h-[300px]">
      <Table>
        <TableHeader className="sticky top-0 bg-white">
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Lot Number</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Bags</TableHead>
            <TableHead>Weight (kg)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransfers.map((transfer) => (
            <TableRow key={transfer.id}>
              <TableCell>{format(new Date(transfer.date), 'dd/MM/yyyy')}</TableCell>
              <TableCell>{transfer.lotNumber}</TableCell>
              <TableCell>{transfer.fromLocation}</TableCell>
              <TableCell>{transfer.toLocation}</TableCell>
              <TableCell>{transfer.bags}</TableCell>
              <TableCell>{transfer.weight.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default TransferHistory;
