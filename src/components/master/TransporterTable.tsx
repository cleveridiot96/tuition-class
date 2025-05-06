
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

interface TransporterTableProps {
  transporters: any[];
  onEdit: (transporter: any) => void;
  onRefresh: () => void;
}

const TransporterTable: React.FC<TransporterTableProps> = ({ transporters, onEdit, onRefresh }) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Vehicle Number</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transporters.length > 0 ? (
            transporters.map((transporter) => (
              <TableRow key={transporter.id}>
                <TableCell>{transporter.name}</TableCell>
                <TableCell>{transporter.vehicleNumber || "-"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(transporter)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                No transporters found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransporterTable;
