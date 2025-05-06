
import React from 'react';
import { Button } from "@/components/ui/button";

interface PurchaseFormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isEdit: boolean;
}

const PurchaseFormActions: React.FC<PurchaseFormActionsProps> = ({ 
  onCancel, 
  isSubmitting, 
  isEdit 
}) => {
  return (
    <div className="flex justify-between mt-4">
      <Button 
        type="button" 
        variant="outline"
        onClick={onCancel}
        className="border-blue-300 text-blue-700 hover:bg-blue-50"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        size="lg"
        className="md-ripple bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        disabled={isSubmitting}
      >
        {isEdit ? "Update Purchase" : "Add Purchase"}
      </Button>
    </div>
  );
};

export default PurchaseFormActions;
