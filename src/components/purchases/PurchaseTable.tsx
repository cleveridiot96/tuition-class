
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Purchase } from "@/services/types";

interface PurchaseTableProps {
  purchases: Purchase[];
  onDelete: (id: string) => void;
  onEdit: (purchase: Purchase) => void;
  sortColumn: keyof Purchase | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: keyof Purchase) => void;
}

const PurchaseTable: React.FC<PurchaseTableProps> = ({
  purchases,
  onDelete,
  onEdit,
  sortColumn,
  sortDirection,
  onSort
}) => {
  const handleSort = (column: keyof Purchase) => {
    onSort(column);
  };

  return (
    <ScrollArea className="h-[calc(100vh-350px)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('date')} className="cursor-pointer">
              Date {sortColumn === 'date' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('lotNumber')} className="cursor-pointer">
              Lot Number {sortColumn === 'lotNumber' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('party')} className="cursor-pointer">
              Supplier {sortColumn === 'party' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('agent')} className="cursor-pointer">
              Agent {sortColumn === 'agent' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('quantity')} className="cursor-pointer">
              Quantity {sortColumn === 'quantity' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('netWeight')} className="cursor-pointer">
              Net Weight {sortColumn === 'netWeight' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('rate')} className="cursor-pointer">
              Rate {sortColumn === 'rate' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('totalAmount')} className="cursor-pointer">
              Total Amount {sortColumn === 'totalAmount' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell>{purchase.date}</TableCell>
              <TableCell>{purchase.lotNumber}</TableCell>
              <TableCell>{purchase.party}</TableCell>
              <TableCell>{purchase.agent || '-'}</TableCell>
              <TableCell>{purchase.quantity}</TableCell>
              <TableCell>{purchase.netWeight}</TableCell>
              <TableCell>{purchase.rate}</TableCell>
              <TableCell>{purchase.totalAmount}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(purchase)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onDelete(purchase.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default PurchaseTable;
