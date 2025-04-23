
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

interface BrokerTableProps {
  brokers: any[];
  onEdit: (broker: any) => void;
  onRefresh: () => void;
}

const BrokerTable: React.FC<BrokerTableProps> = ({ brokers, onEdit, onRefresh }) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brokers.length > 0 ? (
            brokers.map((broker) => (
              <TableRow key={broker.id}>
                <TableCell>{broker.name}</TableCell>
                <TableCell>{broker.commission ? `${broker.commission}%` : "-"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(broker)}
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
                No brokers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BrokerTable;
