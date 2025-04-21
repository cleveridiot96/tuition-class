
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2 } from "lucide-react";
import { format } from 'date-fns';

export interface PaymentsTableProps {
  payments: any[];
  onDelete: (id: string) => void;
  onEdit: (payment: any) => void;
  sortColumn: keyof any | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: keyof any) => void;
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({
  payments,
  onDelete,
  onEdit,
  sortColumn,
  sortDirection,
  onSort
}) => {
  const getPartyTypeLabel = (type: string) => {
    switch(type) {
      case 'supplier': return 'Supplier';
      case 'customer': return 'Customer';
      case 'transporter': return 'Transporter';
      case 'agent': return 'Agent';
      default: return type;
    }
  };

  const getPaymentModeLabel = (mode: string) => {
    switch(mode) {
      case 'cash': return 'Cash';
      case 'cheque': return 'Cheque';
      case 'online': return 'Online Transfer';
      case 'upi': return 'UPI';
      default: return mode;
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => onSort('date')}
              >
                Date {sortColumn === 'date' && (sortDirection === 'asc' ? '▲' : '▼')}
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => onSort('partyName')}
              >
                Party {sortColumn === 'partyName' && (sortDirection === 'asc' ? '▲' : '▼')}
              </TableHead>
              <TableHead>Party Type</TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => onSort('amount')}
              >
                Amount {sortColumn === 'amount' && (sortDirection === 'asc' ? '▲' : '▼')}
              </TableHead>
              <TableHead>Payment Mode</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{format(new Date(payment.date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{payment.partyName || '—'}</TableCell>
                  <TableCell>{getPartyTypeLabel(payment.partyType)}</TableCell>
                  <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{getPaymentModeLabel(payment.paymentMode)}</TableCell>
                  <TableCell>{payment.referenceNumber || '—'}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(payment)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(payment.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No payments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PaymentsTable;
