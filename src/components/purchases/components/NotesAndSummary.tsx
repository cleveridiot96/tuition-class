
import React from 'react';
import FormSummary from '../../shared/FormSummary';

interface NotesAndSummaryProps {
  notes: string;
  onNotesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  expenses: number;
  subtotal: number;
  transportCost: number;
  brokerageAmount: number;
  total: number;
}

const NotesAndSummary: React.FC<NotesAndSummaryProps> = ({
  notes,
  onNotesChange,
  expenses,
  subtotal,
  transportCost,
  brokerageAmount,
  total
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <textarea
          id="notes"
          name="notes"
          className="w-full p-2 rounded-md border"
          rows={3}
          value={notes}
          onChange={(e) => onNotesChange({
            target: { name: 'notes', value: e.target.value }
          } as React.ChangeEvent<HTMLInputElement>)}
          placeholder="Enter notes..."
        />
      </div>

      <FormSummary
        subtotal={subtotal}
        transportCost={transportCost}
        brokerageAmount={brokerageAmount}
        showBrokerage={true}
        expenses={expenses}
        total={total}
      />
    </div>
  );
};

export default NotesAndSummary;
