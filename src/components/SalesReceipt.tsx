
import React from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";

interface SaleReceiptProps {
  sale: any;
}

const SalesReceipt = ({ sale }: SaleReceiptProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card className="p-6 print:shadow-none print:border-none">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">SALES RECEIPT</h2>
        <p className="text-gray-500">Agricultural Business Management System</p>
      </div>

      <div className="flex justify-between mb-6">
        <div>
          <p className="font-semibold">Date:</p>
          <p>{format(new Date(sale.date), "dd MMM yyyy")}</p>
        </div>
        <div>
          <p className="font-semibold">Receipt No:</p>
          <p>{sale.billNumber || sale.id?.substring(0, 8)}</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Customer:</p>
          <p>{sale.customer}</p>
        </div>
        <div>
          <p className="font-semibold">Lot Number:</p>
          <p>{sale.lotNumber}</p>
        </div>
      </div>

      <table className="w-full mb-6 border-collapse">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-2 text-left">Description</th>
            <th className="py-2 text-right">Quantity</th>
            <th className="py-2 text-right">Net Weight</th>
            <th className="py-2 text-right">Rate</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="py-2 text-left">Sale of goods</td>
            <td className="py-2 text-right">{sale.quantity} bags</td>
            <td className="py-2 text-right">{sale.netWeight} kg</td>
            <td className="py-2 text-right">{formatCurrency(sale.rate)} per kg</td>
            <td className="py-2 text-right">{formatCurrency(sale.totalAmount)}</td>
          </tr>
        </tbody>
      </table>

      <div className="border-t border-gray-300 pt-4">
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>{formatCurrency(sale.totalAmount)}</span>
        </div>
        {sale.broker && (
          <div className="flex justify-between mb-2">
            <span>Broker ({sale.broker}) @ 1%:</span>
            <span>- {formatCurrency(sale.totalAmount * 0.01)}</span>
          </div>
        )}
        {sale.transportCost > 0 && (
          <div className="flex justify-between mb-2">
            <span>Transport ({sale.transporter || "Transport"}):</span>
            <span>- {formatCurrency(sale.transportCost)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-300">
          <span>Net Amount:</span>
          <span>{formatCurrency(sale.netAmount)}</span>
        </div>
        {sale.billAmount > 0 && (
          <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-300">
            <span>Bill Amount:</span>
            <span>{formatCurrency(sale.billAmount)}</span>
          </div>
        )}
      </div>

      {sale.notes && (
        <div className="mt-6 border-t border-gray-300 pt-4">
          <p className="font-semibold">Notes:</p>
          <p className="text-gray-700">{sale.notes}</p>
        </div>
      )}

      <div className="mt-10 pt-6 border-t border-gray-300 text-center text-gray-500">
        <p>Thank you for your business!</p>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-300 flex justify-between">
        <div className="w-1/3 border-t border-gray-400 mt-16 mx-auto">
          <p className="text-center">Customer Signature</p>
        </div>
        <div className="w-1/3 border-t border-gray-400 mt-16 mx-auto">
          <p className="text-center">Authorized Signature</p>
        </div>
      </div>

    </Card>
  );
};

export default SalesReceipt;
