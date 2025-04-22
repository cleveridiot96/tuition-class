
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DuplicateLotDialog from "../DuplicateLotDialog";

interface DialogManagerProps {
  // Duplicate lot dialog props
  showDuplicateLotDialog: boolean;
  setShowDuplicateLotDialog: (show: boolean) => void;
  duplicateLotInfo: any;
  onContinueDespiteDuplicate: () => void;
  
  // Party dialog props
  showAddPartyDialog?: boolean;
  setShowAddPartyDialog?: (show: boolean) => void;
  newPartyName?: string;
  setNewPartyName?: (name: string) => void;
  newPartyAddress?: string;
  setNewPartyAddress?: (address: string) => void;
  handleAddNewParty?: () => void;
  
  // Similar party dialog props
  showSimilarPartyDialog?: boolean;
  setShowSimilarPartyDialog?: (show: boolean) => void;
  similarParty?: any;
  useSuggestedParty?: () => void;
  
  // Transporter dialog props
  showAddTransporterDialog?: boolean;
  setShowAddTransporterDialog?: (show: boolean) => void;
  newTransporterName?: string;
  setNewTransporterName?: (name: string) => void;
  newTransporterAddress?: string;
  setNewTransporterAddress?: (address: string) => void;
  handleAddNewTransporter?: () => void;
  
  // Broker dialog props
  showAddBrokerDialog?: boolean;
  setShowAddBrokerDialog?: (show: boolean) => void;
  newBrokerName?: string;
  setNewBrokerName?: (name: string) => void;
  newBrokerAddress?: string;
  setNewBrokerAddress?: (address: string) => void;
  newBrokerRate?: number;
  setNewBrokerRate?: (rate: number) => void;
  handleAddNewBroker?: () => void;
}

const DialogManager: React.FC<DialogManagerProps> = ({
  showDuplicateLotDialog,
  setShowDuplicateLotDialog,
  duplicateLotInfo,
  onContinueDespiteDuplicate,
  // Party dialog props
  showAddPartyDialog,
  setShowAddPartyDialog,
  newPartyName,
  setNewPartyName,
  newPartyAddress,
  setNewPartyAddress,
  handleAddNewParty,
  
  // Similar party dialog props
  showSimilarPartyDialog,
  setShowSimilarPartyDialog,
  similarParty,
  useSuggestedParty,
  
  // Transporter dialog props
  showAddTransporterDialog,
  setShowAddTransporterDialog,
  newTransporterName,
  setNewTransporterName,
  newTransporterAddress,
  setNewTransporterAddress,
  handleAddNewTransporter,
  
  // Broker dialog props
  showAddBrokerDialog,
  setShowAddBrokerDialog,
  newBrokerName,
  setNewBrokerName,
  newBrokerAddress,
  setNewBrokerAddress,
  newBrokerRate,
  setNewBrokerRate,
  handleAddNewBroker,
}) => {
  return (
    <>
      <DuplicateLotDialog
        open={showDuplicateLotDialog}
        onOpenChange={setShowDuplicateLotDialog}
        duplicateLotInfo={duplicateLotInfo}
        onContinue={onContinueDespiteDuplicate}
      />

      {/* Add Party Dialog */}
      {showAddPartyDialog !== undefined && setShowAddPartyDialog !== undefined && (
        <Dialog open={showAddPartyDialog} onOpenChange={setShowAddPartyDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Party</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPartyName" className="text-right">
                  Name
                </Label>
                <Input
                  id="newPartyName"
                  value={newPartyName || ''}
                  onChange={(e) => setNewPartyName && setNewPartyName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPartyAddress" className="text-right">
                  Address
                </Label>
                <Input
                  id="newPartyAddress"
                  value={newPartyAddress || ''}
                  onChange={(e) => setNewPartyAddress && setNewPartyAddress(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddPartyDialog(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleAddNewParty}>
                Add Party
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Similar Party Dialog */}
      {similarParty && showSimilarPartyDialog !== undefined && setShowSimilarPartyDialog !== undefined && (
        <Dialog open={showSimilarPartyDialog} onOpenChange={setShowSimilarPartyDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Similar Party Found</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                Did you mean <strong>{similarParty.name}</strong>?
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowSimilarPartyDialog(false)}>
                No, Continue
              </Button>
              <Button type="button" onClick={useSuggestedParty}>
                Yes, Use This
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Transporter Dialog */}
      {showAddTransporterDialog !== undefined && setShowAddTransporterDialog !== undefined && (
        <Dialog open={showAddTransporterDialog} onOpenChange={setShowAddTransporterDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Transporter</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newTransporterName" className="text-right">
                  Name
                </Label>
                <Input
                  id="newTransporterName"
                  value={newTransporterName || ''}
                  onChange={(e) => setNewTransporterName && setNewTransporterName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newTransporterAddress" className="text-right">
                  Address
                </Label>
                <Input
                  id="newTransporterAddress"
                  value={newTransporterAddress || ''}
                  onChange={(e) => setNewTransporterAddress && setNewTransporterAddress(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddTransporterDialog(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleAddNewTransporter}>
                Add Transporter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Broker Dialog */}
      {showAddBrokerDialog !== undefined && setShowAddBrokerDialog !== undefined && (
        <Dialog open={showAddBrokerDialog} onOpenChange={setShowAddBrokerDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Broker</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newBrokerName" className="text-right">
                  Name
                </Label>
                <Input
                  id="newBrokerName"
                  value={newBrokerName || ''}
                  onChange={(e) => setNewBrokerName && setNewBrokerName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newBrokerAddress" className="text-right">
                  Address
                </Label>
                <Input
                  id="newBrokerAddress"
                  value={newBrokerAddress || ''}
                  onChange={(e) => setNewBrokerAddress && setNewBrokerAddress(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newBrokerRate" className="text-right">
                  Rate (%)
                </Label>
                <Input
                  id="newBrokerRate"
                  type="number"
                  value={newBrokerRate || 0}
                  onChange={(e) => setNewBrokerRate && setNewBrokerRate(parseFloat(e.target.value))}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddBrokerDialog(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleAddNewBroker}>
                Add Broker
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default DialogManager;
