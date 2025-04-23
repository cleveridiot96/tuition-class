
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

interface SupplierTableProps {
  suppliers: any[];
  onEdit: (supplier: any) => void;
  onRefresh: () => void;
}

const SupplierTable: React.FC<SupplierTableProps> = ({ suppliers, onEdit, onRefresh }) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.length > 0 ? (
            suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(supplier)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-4">
                No suppliers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SupplierTable;
