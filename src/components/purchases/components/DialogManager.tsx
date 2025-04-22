import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AgentForm from "@/components/agents/AgentForm";
import BrokerForm from "@/components/brokers/BrokerForm";
import TransporterForm from "@/components/transporters/TransporterForm";
import SimilarPartyDialog from '../SimilarPartyDialog';

interface DialogManagerProps {
  showAddPartyDialog: boolean;
  setShowAddPartyDialog: (show: boolean) => void;
  showAddBrokerDialog: boolean;
  setShowAddBrokerDialog: (show: boolean) => void;
  showAddTransporterDialog: boolean;
  setShowAddTransporterDialog: (show: boolean) => void;
  showSimilarPartyDialog: boolean;
  setShowSimilarPartyDialog: (show: boolean) => void;
  similarParty: any;
  handleUseSuggestedParty: () => void;
  newPartyName: string;
  setNewPartyName: (name: string) => void;
  newPartyAddress: string;
  setNewPartyAddress: (address: string) => void;
  handleAddNewParty: () => void;
  handleAddNewBroker: () => void;
  handleAddNewTransporter: () => void;
  newBrokerName: string;
  setNewBrokerName: (name: string) => void;
  newBrokerAddress: string;
  setNewBrokerAddress: (address: string) => void;
  newBrokerRate: number;
  setNewBrokerRate: (rate: number) => void;
  newTransporterName: string;
  setNewTransporterName: (name: string) => void;
  newTransporterAddress: string;
  setNewTransporterAddress: (address: string) => void;
  onAgentAdded?: (agent: any) => void;
  onBrokerAdded?: (broker: any) => void;
  onTransporterAdded?: (transporter: any) => void;
}

const DialogManager: React.FC<DialogManagerProps> = ({
  showAddPartyDialog,
  setShowAddPartyDialog,
  showAddBrokerDialog,
  setShowAddBrokerDialog,
  showAddTransporterDialog,
  setShowAddTransporterDialog,
  showSimilarPartyDialog,
  setShowSimilarPartyDialog,
  similarParty,
  handleUseSuggestedParty,
  newPartyName,
  setNewPartyName,
  newPartyAddress,
  setNewPartyAddress,
  handleAddNewParty,
  handleAddNewBroker,
  handleAddNewTransporter,
  newBrokerName,
  setNewBrokerName,
  newBrokerAddress,
  setNewBrokerAddress,
  newBrokerRate,
  setNewBrokerRate,
  newTransporterName,
  setNewTransporterName,
  newTransporterAddress,
  setNewTransporterAddress,
  onAgentAdded,
  onBrokerAdded,
  onTransporterAdded
}) => {
  // For fixing the string to number conversion in rate
  const handleRateChange = (rateValue: string | number) => {
    // Convert string to number if needed
    const numericRate = typeof rateValue === 'string' ? parseFloat(rateValue) : rateValue;
    setNewBrokerRate(numericRate);
  };
  
  return (
    <>
      {/* Add Party Dialog */}
      <Dialog open={showAddPartyDialog} onOpenChange={setShowAddPartyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Party</DialogTitle>
            <DialogDescription>
              Enter the details of the new party.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="partyName">Party Name</Label>
              <Input
                id="partyName"
                value={newPartyName}
                onChange={(e) => setNewPartyName(e.target.value)}
                placeholder="Enter party name"
              />
            </div>
            <div>
              <Label htmlFor="partyAddress">Address</Label>
              <Textarea
                id="partyAddress"
                value={newPartyAddress}
                onChange={(e) => setNewPartyAddress(e.target.value)}
                placeholder="Enter address (optional)"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAddPartyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNewParty}>Add Party</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Broker Dialog */}
      <Dialog open={showAddBrokerDialog} onOpenChange={setShowAddBrokerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Broker</DialogTitle>
            <DialogDescription>
              Enter the details of the new broker.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="brokerName">Broker Name</Label>
              <Input
                id="brokerName"
                value={newBrokerName}
                onChange={(e) => setNewBrokerName(e.target.value)}
                placeholder="Enter broker name"
              />
            </div>
            <div>
              <Label htmlFor="brokerAddress">Address</Label>
              <Textarea
                id="brokerAddress"
                value={newBrokerAddress}
                onChange={(e) => setNewBrokerAddress(e.target.value)}
                placeholder="Enter address (optional)"
              />
            </div>
            <div>
              <Label htmlFor="brokerRate">Commission Rate (%)</Label>
              <Input
                id="brokerRate"
                type="number"
                value={newBrokerRate}
                onChange={(e) => handleRateChange(e.target.value)}
                placeholder="Enter commission rate"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAddBrokerDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNewBroker}>Add Broker</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Transporter Dialog */}
      <Dialog open={showAddTransporterDialog} onOpenChange={setShowAddTransporterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transporter</DialogTitle>
            <DialogDescription>
              Enter the details of the new transporter.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="transporterName">Transporter Name</Label>
              <Input
                id="transporterName"
                value={newTransporterName}
                onChange={(e) => setNewTransporterName(e.target.value)}
                placeholder="Enter transporter name"
              />
            </div>
            <div>
              <Label htmlFor="transporterAddress">Address</Label>
              <Textarea
                id="transporterAddress"
                value={newTransporterAddress}
                onChange={(e) => setNewTransporterAddress(e.target.value)}
                placeholder="Enter address (optional)"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAddTransporterDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNewTransporter}>Add Transporter</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Similar Party Dialog */}
      <SimilarPartyDialog
        open={showSimilarPartyDialog}
        onOpenChange={(show) => setShowSimilarPartyDialog(show)}
        similarParty={similarParty}
        onUseParty={handleUseSuggestedParty}
      />
      
      {/* Agent Form Dialog */}
      {onAgentAdded && (
        <Dialog open={showAddPartyDialog} onOpenChange={setShowAddPartyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Agent</DialogTitle>
            </DialogHeader>
            <AgentForm 
              onAgentAdded={onAgentAdded} 
              onCancel={() => setShowAddPartyDialog(false)} 
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Broker Form Dialog */}
      {onBrokerAdded && (
        <Dialog open={showAddBrokerDialog} onOpenChange={setShowAddBrokerDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Broker</DialogTitle>
            </DialogHeader>
            <BrokerForm 
              onBrokerAdded={onBrokerAdded} 
              onCancel={() => setShowAddBrokerDialog(false)} 
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Transporter Form Dialog */}
      {onTransporterAdded && (
        <Dialog open={showAddTransporterDialog} onOpenChange={setShowAddTransporterDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Transporter</DialogTitle>
            </DialogHeader>
            <TransporterForm 
              onTransporterAdded={onTransporterAdded} 
              onCancel={() => setShowAddTransporterDialog(false)} 
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default DialogManager;
