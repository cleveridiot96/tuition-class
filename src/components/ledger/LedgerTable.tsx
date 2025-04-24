
import React from 'react';
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";

interface Transaction {
  id: string;
  date: string;
  reference: string;
  description: string;
  type: 'debit' | 'credit';
  amount: number;
  runningBalance: number;
}

interface LedgerTableProps {
  transactions: Transaction[];
}

const LedgerTable = ({ transactions }: LedgerTableProps) => {
  return (
    <div className="border rounded-md overflow-hidden print:border-none">
      <Table>
        <TableHeader className="bg-gray-100 print:bg-gray-200">
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Debit</TableHead>
            <TableHead>Credit</TableHead>
            <TableHead>Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {format(new Date(transaction.date), "dd/MM/yyyy")}
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.reference || "-"}</TableCell>
              <TableCell>
                {transaction.type === "debit"
                  ? `₹${transaction.amount.toLocaleString()}`
                  : "-"}
              </TableCell>
              <TableCell>
                {transaction.type === "credit"
                  ? `₹${transaction.amount.toLocaleString()}`
                  : "-"}
              </TableCell>
              <TableCell
                className={
                  transaction.runningBalance >= 0 
                    ? "text-green-600 print:text-black" 
                    : "text-red-600 print:text-black"
                }
              >
                ₹{Math.abs(transaction.runningBalance).toLocaleString()}
                {transaction.runningBalance >= 0 ? " Cr" : " Dr"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LedgerTable;
