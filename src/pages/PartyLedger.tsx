
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { PartyLedgerHeader } from "@/components/party-ledger/PartyLedgerHeader";
import { TransactionList } from "@/components/party-ledger/TransactionList";
import { usePartyLedger } from "@/hooks/usePartyLedger";
import { MasterType } from "@/types/master.types";

const PartyLedger = () => {
  const {
    partyId,
    setPartyId,
    partyType,
    setPartyType,
    transactions,
    balance,
    loading,
    partyOptions,
    loadEntities,
    addParty
  } = usePartyLedger();

  // Create a wrapper function to handle the type conversion
  const handlePartyTypeChange = (type: string) => {
    setPartyType(type as "supplier" | "customer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <Navigation title="Party Ledger" showBackButton className="bg-purple-700" />
      <div className="container mx-auto px-4 py-6">
        <PartyLedgerHeader
          partyType={partyType}
          setPartyType={handlePartyTypeChange}
          partyId={partyId}
          setPartyId={setPartyId}
          partyOptions={partyOptions}
          addParty={addParty}
          loadEntities={loadEntities}
        />

        {partyId && transactions.length > 0 ? (
          <div className="mt-6">
            <TransactionList
              transactions={transactions}
              balance={balance}
            />
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-lg border border-purple-200 mt-6">
            {partyId ? (
              loading ? (
                <p>Loading transactions...</p>
              ) : (
                <p>No transactions found for this party.</p>
              )
            ) : (
              <p>Select a party to view their ledger.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartyLedger;
