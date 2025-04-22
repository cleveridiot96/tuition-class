
import React from 'react';
import DuplicateLotDialog from "../DuplicateLotDialog";
import AddPartyDialog from "../AddPartyDialog";
import SimilarPartyDialog from "../SimilarPartyDialog";
import AddTransporterDialog from "../AddTransporterDialog";
import AddBrokerDialog from "../AddBrokerDialog";

interface DialogManagerProps {
  showDuplicateLotDialog: boolean;
  setShowDuplicateLotDialog: (show: boolean) => void;
  duplicateLotInfo: any;
  onContinueDespiteDuplicate: () => void;
  partyManagement?: {
    showAddPartyDialog: boolean;
    setShowAddPartyDialog: (show: boolean) => void;
    newPartyName: string;
    setNewPartyName: (name: string) => void;
    newPartyAddress: string;
    setNewPartyAddress: (address: string) => void;
    handleAddNewParty: () => void;
    showSimilarPartyDialog: boolean;
    setShowSimilarPartyDialog: (show: boolean) => void;
    similarParty: any;
    useSuggestedParty: () => void;
    showAddTransporterDialog: boolean;
    setShowAddTransporterDialog: (show: boolean) => void;
    newTransporterName: string;
    setNewTransporterName: (name: string) => void;
    newTransporterAddress: string;
    setNewTransporterAddress: (address: string) => void;
    handleAddNewTransporter: () => void;
    showAddBrokerDialog: boolean;
    setShowAddBrokerDialog: (show: boolean) => void;
    newBrokerName: string;
    setNewBrokerName: (name: string) => void;
    newBrokerAddress: string;
    setNewBrokerAddress: (address: string) => void;
    newBrokerRate: number | string;
    setNewBrokerRate: (rate: number | string) => void;
    handleAddNewBroker: () => void;
  };
}

const DialogManager: React.FC<DialogManagerProps> = ({
  showDuplicateLotDialog,
  setShowDuplicateLotDialog,
  duplicateLotInfo,
  onContinueDespiteDuplicate,
  partyManagement,
}) => {
  return (
    <>
      <DuplicateLotDialog
        open={showDuplicateLotDialog}
        onOpenChange={setShowDuplicateLotDialog}
        duplicateLotInfo={duplicateLotInfo}
        onContinue={onContinueDespiteDuplicate}
      />
      
      {partyManagement && (
        <>
          {/* Party Dialog */}
          <AddPartyDialog
            open={partyManagement.showAddPartyDialog}
            onOpenChange={partyManagement.setShowAddPartyDialog}
            newPartyName={partyManagement.newPartyName}
            setNewPartyName={partyManagement.setNewPartyName}
            newPartyAddress={partyManagement.newPartyAddress}
            setNewPartyAddress={partyManagement.setNewPartyAddress}
            handleAddNewParty={partyManagement.handleAddNewParty}
          />
          
          {/* Similar Party Dialog */}
          <SimilarPartyDialog
            open={partyManagement.showSimilarPartyDialog}
            onOpenChange={partyManagement.setShowSimilarPartyDialog}
            similarParty={partyManagement.similarParty}
            onUseParty={partyManagement.useSuggestedParty}
          />
          
          {/* Transporter Dialog */}
          <AddTransporterDialog
            open={partyManagement.showAddTransporterDialog}
            onOpenChange={partyManagement.setShowAddTransporterDialog}
            newTransporterName={partyManagement.newTransporterName}
            setNewTransporterName={partyManagement.setNewTransporterName}
            newTransporterAddress={partyManagement.newTransporterAddress}
            setNewTransporterAddress={partyManagement.setNewTransporterAddress}
            handleAddNewTransporter={partyManagement.handleAddNewTransporter}
          />
          
          {/* Broker Dialog */}
          <AddBrokerDialog
            open={partyManagement.showAddBrokerDialog}
            onOpenChange={partyManagement.setShowAddBrokerDialog}
            newBrokerName={partyManagement.newBrokerName}
            setNewBrokerName={partyManagement.setNewBrokerName}
            newBrokerAddress={partyManagement.newBrokerAddress}
            setNewBrokerAddress={partyManagement.setNewBrokerAddress}
            newBrokerRate={Number(partyManagement.newBrokerRate)}
            setNewBrokerRate={(rate) => partyManagement.setNewBrokerRate(rate.toString())}
            handleAddNewBroker={partyManagement.handleAddNewBroker}
          />
        </>
      )}
    </>
  );
};

export default DialogManager;
