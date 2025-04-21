
import React from 'react';
import DuplicateLotDialog from "../DuplicateLotDialog";

interface DialogManagerProps {
  showDuplicateLotDialog: boolean;
  setShowDuplicateLotDialog: (show: boolean) => void;
  duplicateLotInfo: any;
  onContinueDespiteDuplicate: () => void;
}

const DialogManager: React.FC<DialogManagerProps> = ({
  showDuplicateLotDialog,
  setShowDuplicateLotDialog,
  duplicateLotInfo,
  onContinueDespiteDuplicate
}) => {
  return (
    <>
      <DuplicateLotDialog
        open={showDuplicateLotDialog}
        onOpenChange={setShowDuplicateLotDialog}
        duplicateLotInfo={duplicateLotInfo}
        continueDespiteDuplicate={onContinueDespiteDuplicate}
      />
    </>
  );
};

export default DialogManager;
