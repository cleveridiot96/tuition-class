
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-searchable-select";

interface PartyLedgerHeaderProps {
  partyType: string;
  setPartyType: (type: string) => void;
  partyId: string;
  setPartyId: (id: string) => void;
  partyOptions: { value: string; label: string; }[];
}

export const PartyLedgerHeader: React.FC<PartyLedgerHeaderProps> = ({
  partyType,
  setPartyType,
  partyId,
  setPartyId,
  partyOptions,
}) => {
  return (
    <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-200 shadow">
      <CardHeader>
        <CardTitle className="text-purple-800">Party Ledger</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Tabs defaultValue={partyType} onValueChange={setPartyType}>
            <TabsList className="mb-4">
              <TabsTrigger value="supplier">Suppliers</TabsTrigger>
              <TabsTrigger value="customer">Customers</TabsTrigger>
            </TabsList>

            <div className="mb-4">
              <EnhancedSearchableSelect
                options={partyOptions}
                value={partyId}
                onValueChange={setPartyId}
                placeholder={`Select ${partyType === "supplier" ? "supplier" : "customer"}`}
                emptyMessage="No parties found"
              />
            </div>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};
