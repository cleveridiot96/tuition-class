
import React from 'react';

interface LedgerSummaryProps {
  partyName: string;
  balance: number;
}

const LedgerSummary = ({ partyName, balance }: LedgerSummaryProps) => {
  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200 print:mb-6 print:border-none">
      <h3 className="text-lg font-semibold text-gray-700">{partyName}</h3>
      <p className={`text-lg font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"} print:text-black`}>
        Balance: ₹{Math.abs(balance).toLocaleString()}
        {balance >= 0 ? " (Credit)" : " (Debit)"}
      </p>
    </div>
  );
};

export default LedgerSummary;
