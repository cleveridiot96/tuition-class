
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface InventoryTableProps {
  inventory: any[];
  searchTerm: string;
  onSearch: (term: string) => void;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
  onEdit?: (item: any) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  inventory,
  searchTerm,
  onSearch,
  sortColumn,
  sortDirection,
  onSort,
  onEdit,
}) => {
  const formatQuantity = (quantity: number) => {
    if (quantity < 0) {
      return <span className="text-red-500">({Math.abs(quantity)})</span>;
    }
    return quantity;
  };

  // Find duplicate lot numbers
  const findDuplicates = () => {
    const counts: Record<string, number> = {};
    const duplicates = new Set<string>();
    
    inventory.forEach(item => {
      counts[item.lotNumber] = (counts[item.lotNumber] || 0) + 1;
      if (counts[item.lotNumber] > 1) {
        duplicates.add(item.lotNumber);
      }
    });
    
    return duplicates;
  };

  const duplicateLots = findDuplicates();

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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.length > 0 ? (
              inventory.map((item) => (
                <TableRow key={item.id} className={duplicateLots.has(item.lotNumber) ? "bg-yellow-50" : ""}>
                  <TableCell>
                    {item.lotNumber}
                    {duplicateLots.has(item.lotNumber) && (
                      <AlertCircle 
                        size={16} 
                        className="inline ml-2 text-yellow-500" 
                        onClick={() => toast.warning(`Duplicate lot number: ${item.lotNumber}`)}
                      />
                    )}
                  </TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{formatQuantity(item.bags)}</TableCell>
                  <TableCell>
                    {formatQuantity(item.netWeight?.toFixed(2) || 0)}
                  </TableCell>
                  <TableCell>₹{item.rate?.toFixed(2) || 0}</TableCell>
                  <TableCell>
                    ₹{((item.netWeight || 0) * (item.rate || 0)).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => onEdit && onEdit(item)}>
                      <Edit size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No inventory items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {duplicateLots.size > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md text-yellow-800">
          <p className="flex items-center">
            <AlertCircle size={16} className="mr-2" />
            Warning: Found {duplicateLots.size} duplicate lot number(s): {Array.from(duplicateLots).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
