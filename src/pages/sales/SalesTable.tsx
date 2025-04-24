
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, PrinterIcon, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sale } from "@/services/types";
import { format } from "date-fns";

const formatAmount = (amount: string | number | undefined): string => {
  if (amount === undefined || amount === null) return '0.00';
  if (typeof amount === 'number') {
    return amount.toFixed(2);
  }
  // If it's a string but can be parsed as a number
  const parsed = parseFloat(amount.toString());
  if (!isNaN(parsed)) {
    return parsed.toFixed(2);
  }
  // For non-numeric strings
  return amount.toString();
};

export default function SalesTable({
  sales,
  onEdit,
  onDelete,
  onPrint
}: {
  sales: Sale[];
  onEdit: (sale: Sale) => void;
  onDelete: (id: string) => void;
  onPrint: (sale: Sale) => void;
}) {
  if (sales.length === 0) {
    return <p className="text-center py-8 text-gray-500">No sales recorded yet. Add your first sale.</p>;
  }
  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <ScrollArea className="h-[calc(100vh-220px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 bg-white z-10">Date</TableHead>
              <TableHead className="sticky top-0 bg-white z-10">Lot Number</TableHead>
              <TableHead className="sticky top-0 bg-white z-10">Customer</TableHead>
              <TableHead className="sticky top-0 bg-white z-10">Quantity</TableHead>
              <TableHead className="sticky top-0 bg-white z-10">Net Weight</TableHead>
              <TableHead className="sticky top-0 bg-white z-10">Rate</TableHead>
              <TableHead className="sticky top-0 bg-white z-10">Total</TableHead>
              <TableHead className="sticky top-0 bg-white z-10">Bill Amt</TableHead>
              <TableHead className="sticky top-0 bg-white z-10">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(sales || []).map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{format(new Date(sale.date), "dd MMM yyyy")}</TableCell>
                <TableCell>{sale.lotNumber}</TableCell>
                <TableCell>{sale.customer}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>{sale.netWeight}</TableCell>
                <TableCell>₹{sale.rate}</TableCell>
                <TableCell>₹{sale.totalAmount ? formatAmount(sale.totalAmount) : "0.00"}</TableCell>
                <TableCell>₹{formatAmount(sale.billAmount)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(sale)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onPrint(sale)}
                      title="Print"
                    >
                      <PrinterIcon size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(sale.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
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
}
