
import React from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LedgerEntry } from '@/services/ledger/types';
import { formatCurrency } from '@/utils/helpers';

interface CashBookTableProps {
  entries: LedgerEntry[];
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
  printRef
}) => {
  const formatDateDisplay = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div ref={printRef}>
      {/* Print-only header */}
      <div className="print-only mb-4">
        <h1 className="text-2xl font-bold text-center">Cash Book</h1>
        {(startDate || endDate) && (
          <p className="text-center text-gray-500">
            {startDate ? format(startDate, 'dd/MM/yyyy') : 'Beginning'} to {endDate ? format(endDate, 'dd/MM/yyyy') : 'Present'}
          </p>
        )}
      </div>

      <div className="border rounded-md overflow-hidden mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[110px]">Date</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Cash In (₹)</TableHead>
              <TableHead className="text-right">Cash Out (₹)</TableHead>
              <TableHead className="text-right">Balance (₹)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No transactions found in the specified date range.
                </TableCell>
              </TableRow>
            ) : (
              <>
                {/* Opening balance row */}
                <TableRow className="bg-gray-50">
                  <TableCell colSpan={5} className="font-medium">
                    Opening Balance
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(openingBalance)}
                  </TableCell>
                </TableRow>

                {/* Transaction rows */}
                {entries.map((entry, index) => (
                  <TableRow key={entry.id || index} className={
                    entry.credit > 0 ? 'bg-green-50/50' : 'bg-red-50/50'
                  }>
                    <TableCell>{formatDateDisplay(entry.date)}</TableCell>
                    <TableCell>{entry.reference}</TableCell>
                    <TableCell>{entry.narration}</TableCell>
                    <TableCell className="text-right">
                      {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(entry.balance)} {entry.balanceType === 'credit' ? 'CR' : 'DR'}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Closing balance row */}
                <TableRow className="bg-gray-100 font-medium">
                  <TableCell colSpan={5} className="font-bold">
                    Closing Balance
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(closingBalance)} {lastBalanceType === 'credit' ? 'CR' : 'DR'}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CashBookTable;
