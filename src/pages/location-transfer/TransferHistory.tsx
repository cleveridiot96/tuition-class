
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { getTransferHistory } from "@/services/transferService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TransferRecord {
  id: string;
  date: string;
  lotNumber: string;
  fromLocation: string;
  toLocation: string;
  bags: number;
  weight: number;
  notes?: string;
  createdAt: string;
}

const TransferHistory: React.FC = () => {
  const [transfers, setTransfers] = useState<TransferRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredTransfers, setFilteredTransfers] = useState<TransferRecord[]>([]);
  
  useEffect(() => {
    loadTransfers();
  }, []);
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = transfers.filter(transfer => 
        transfer.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.toLocation.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTransfers(filtered);
    } else {
      setFilteredTransfers(transfers);
    }
  }, [searchTerm, transfers]);
  
  const loadTransfers = () => {
    const history = getTransferHistory();
    // Sort by date descending (newest first)
    const sorted = [...history].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setTransfers(sorted);
    setFilteredTransfers(sorted);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100 shadow-md">
      <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-100 to-cyan-100">
        <CardTitle className="text-blue-800">Transfer History</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4">
          <Input
            placeholder="Search by lot number or location..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
        </div>
        
        {filteredTransfers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No transfer records found.
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Lot Number</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Bags</TableHead>
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell>{format(new Date(transfer.date), "dd MMM yyyy")}</TableCell>
                      <TableCell>{transfer.lotNumber}</TableCell>
                      <TableCell>{transfer.fromLocation}</TableCell>
                      <TableCell>{transfer.toLocation}</TableCell>
                      <TableCell>{transfer.bags}</TableCell>
                      <TableCell>{transfer.weight.toFixed(2)}</TableCell>
                      <TableCell>{transfer.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default TransferHistory;
