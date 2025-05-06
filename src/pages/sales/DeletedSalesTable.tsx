
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sale } from "@/services/types";
import { format } from "date-fns";

export default function DeletedSalesTable({
  deletedSales,
  onRestore
}: {
  deletedSales: Sale[];
  onRestore: (id: string) => void;
}) {
  return (
    <div className="border rounded-md p-4 bg-white">
      <h2 className="text-lg font-semibold mb-4">Deleted Sales</h2>
      {deletedSales.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No deleted sales found.</p>
      ) : (
        <ScrollArea className="h-[calc(100vh-300px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0 bg-white">Date</TableHead>
                <TableHead className="sticky top-0 bg-white">Lot Number</TableHead>
                <TableHead className="sticky top-0 bg-white">Customer</TableHead>
                <TableHead className="sticky top-0 bg-white">Quantity</TableHead>
                <TableHead className="sticky top-0 bg-white">Net Weight</TableHead>
                <TableHead className="sticky top-0 bg-white">Rate</TableHead>
                <TableHead className="sticky top-0 bg-white">Amount</TableHead>
                <TableHead className="sticky top-0 bg-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(deletedSales || []).map((sale) => (
                <TableRow key={sale.id} className="bg-red-50">
                  <TableCell>{format(new Date(sale.date), "dd MMM yyyy")}</TableCell>
                  <TableCell>{sale.lotNumber}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>{sale.netWeight}</TableCell>
                  <TableCell>₹{sale.rate}</TableCell>
                  <TableCell>₹{sale.totalAmount?.toFixed(2) || "0.00"}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRestore(sale.id)}
                    >
                      Restore
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
}
