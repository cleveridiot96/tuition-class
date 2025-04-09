
import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency, formatDate, formatBalance } from "@/utils/helpers";

interface CashBookEntry {
  transactionId: string;
  date: string;
  reference: string;
  narration: string;
  debit: number;
  credit: number;
  balance: number;
  balanceType: string;
}

interface CashBookTableProps {
  entries: CashBookEntry[];
  openingBalance: number;
  closingBalance: number;
  lastBalanceType: string;
  startDate: Date | null;
  endDate: Date | null;
  printRef: React.RefObject<HTMLDivElement>;
}

const CashBookTable: React.FC<CashBookTableProps> = ({
  entries,
  openingBalance,
  closingBalance,
  lastBalanceType,
  startDate,
  endDate,
  printRef,
}) => {
  return (
    <div className="rounded-md border overflow-hidden" ref={printRef}>
      <div className="bg-gray-50 p-4 text-center border-b print-header">
        <h2 className="text-xl font-bold">Cash Book</h2>
        <p className="text-gray-600">
          {startDate ? format(startDate, 'dd/MM/yyyy') : 'All time'} to {endDate ? format(endDate, 'dd/MM/yyyy') : 'present'}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 p-4 border-b bg-gray-50">
        <div>
          <div className="text-sm font-medium">Opening Balance:</div>
          <div className="text-lg font-bold">
            {formatCurrency(openingBalance)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">Closing Balance:</div>
          <div className="text-lg font-bold">
            {formatBalance(closingBalance, lastBalanceType)}
          </div>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-500px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Narration</TableHead>
              <TableHead className="text-right">Debit (₹)</TableHead>
              <TableHead className="text-right">Credit (₹)</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No cash entries found for the selected period.
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry, index) => (
                <TableRow key={`${entry.transactionId}-${index}`} className={
                  entry.reference === 'Opening Balance' ? 'bg-gray-50' :
                  entry.debit > 0 ? 'bg-green-50' : 'bg-red-50'
                }>
                  <TableCell className="font-medium">{formatDate(entry.date)}</TableCell>
                  <TableCell>{entry.reference}</TableCell>
                  <TableCell>{entry.narration}</TableCell>
                  <TableCell className="text-right">
                    {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatBalance(entry.balance, entry.balanceType)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      
      <div className="bg-gray-50 p-4 border-t flex justify-between">
        <div>
          <span className="font-medium">Total Entries:</span> {entries.length}
        </div>
        <div>
          <span className="font-medium">Closing Balance:</span> {formatBalance(closingBalance, lastBalanceType)}
        </div>
      </div>
    </div>
  );
};

export default CashBookTable;
