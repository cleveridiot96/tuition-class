
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface InventoryTableProps {
  inventory: any[];
  searchTerm: string;
  onSearch: (term: string) => void;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  inventory,
  searchTerm,
  onSearch,
  sortColumn,
  sortDirection,
  onSort,
}) => {
  const formatQuantity = (quantity: number) => {
    if (quantity < 0) {
      return <span className="text-red-500">({Math.abs(quantity)})</span>;
    }
    return quantity;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Input
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => onSort("lotNumber")}>
                Lot Number {sortColumn === "lotNumber" && (sortDirection === "asc" ? "▲" : "▼")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort("location")}>
                Location {sortColumn === "location" && (sortDirection === "asc" ? "▲" : "▼")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort("quantity")}>
                Bags {sortColumn === "quantity" && (sortDirection === "asc" ? "▲" : "▼")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort("weight")}>
                Weight (kg) {sortColumn === "weight" && (sortDirection === "asc" ? "▲" : "▼")}
              </TableHead>
              <TableHead>Rate/kg</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.length > 0 ? (
              inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.lotNumber}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{formatQuantity(item.bags)}</TableCell>
                  <TableCell>
                    {formatQuantity(item.netWeight?.toFixed(2) || 0)}
                  </TableCell>
                  <TableCell>₹{item.rate?.toFixed(2) || 0}</TableCell>
                  <TableCell>
                    ₹{((item.netWeight || 0) * (item.rate || 0)).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No inventory items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InventoryTable;
