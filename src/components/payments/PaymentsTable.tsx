
import React from "react";
import { formatDate } from "@/utils/helpers";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PaymentsTableProps {
  payments: any[];
  onEdit: (payment: any) => void;
  onDelete: (id: string) => void;
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({ 
  payments, 
  onEdit, 
  onDelete 
}) => {
  if (payments.length === 0) {
    return (
      <p className="text-center py-8 text-gray-500">No payments recorded yet. Add your first payment.</p>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <ScrollArea className="h-[calc(100vh-220px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 bg-white">Date</TableHead>
              <TableHead className="sticky top-0 bg-white">Party Type</TableHead>
              <TableHead className="sticky top-0 bg-white">Party</TableHead>
              <TableHead className="sticky top-0 bg-white">Amount (₹)</TableHead>
              <TableHead className="sticky top-0 bg-white">Payment Mode</TableHead>
              <TableHead className="sticky top-0 bg-white">Bill Number</TableHead>
              <TableHead className="sticky top-0 bg-white">Bill Amount (₹)</TableHead>
              <TableHead className="sticky top-0 bg-white">Reference Number</TableHead>
              <TableHead className="sticky top-0 bg-white">Notes</TableHead>
              <TableHead className="sticky top-0 bg-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{formatDate(payment.date)}</TableCell>
                <TableCell>{payment.partyType}</TableCell>
                <TableCell>{payment.partyName}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>{payment.paymentMode}</TableCell>
                <TableCell>{payment.billNumber || "-"}</TableCell>
                <TableCell>{payment.billAmount ? payment.billAmount.toFixed(2) : "0.00"}</TableCell>
                <TableCell>{payment.referenceNumber || "-"}</TableCell>
                <TableCell>{payment.notes || "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(payment)}
                      title="Edit payment"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(payment.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete payment"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default PaymentsTable;
