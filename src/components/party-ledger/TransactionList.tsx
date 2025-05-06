
import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TransactionListProps {
  transactions: any[];
  balance: number;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  balance,
}) => {
  const navigate = useNavigate();

  const handleViewTransaction = (transactionId: string, type: string) => {
    if (type === "purchase") {
      navigate(`/purchases/${transactionId}`);
    } else if (type === "sale") {
      navigate(`/sales/${transactionId}`);
    } else if (type === "payment") {
      navigate(`/payments/${transactionId}`);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <div className="bg-purple-50 p-4 rounded-md shadow border border-purple-300">
          <div className="font-semibold text-purple-800">
            Current Balance: 
            <span className={`${balance >= 0 ? 'text-green-600' : 'text-red-600'} text-lg ml-2`}>
              ₹{Math.abs(balance).toFixed(2)}
              {balance >= 0 ? ' (To Receive)' : ' (To Pay)'}
            </span>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-purple-100">
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead className="text-right">Amount (₹)</TableHead>
            <TableHead className="text-right">Balance (₹)</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => {
            let runningBalance = 0;
            for (let i = 0; i <= index; i++) {
              const t = transactions[i];
              if (t.type === "purchase") {
                runningBalance -= t.amount;
              } else if (t.type === "sale") {
                runningBalance += t.amount;
              } else if (t.type === "payment") {
                if (t.paymentDirection === "to-party") {
                  runningBalance -= t.amount;
                } else {
                  runningBalance += t.amount;
                }
              }
            }

            return (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(new Date(transaction.date), "dd-MM-yyyy")}
                </TableCell>
                <TableCell>
                  {transaction.type === "purchase"
                    ? "Purchase"
                    : transaction.type === "sale"
                    ? "Sale"
                    : transaction.paymentDirection === "to-party"
                    ? "Payment (To Party)"
                    : "Payment (From Party)"}
                </TableCell>
                <TableCell>
                  {transaction.reference ||
                    transaction.billNumber ||
                    transaction.paymentId ||
                    "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  {transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell
                  className={`text-right ${
                    runningBalance >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {Math.abs(runningBalance).toFixed(2)}
                  {runningBalance >= 0 ? " (DR)" : " (CR)"}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() =>
                      handleViewTransaction(
                        transaction.id,
                        transaction.type
                      )
                    }
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
