
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  getAccounts,
  updateAccount,
  Account,
  AccountType,
} from "@/services/accountingService";

interface AccountOpeningBalanceProps {
  accountId?: string;
  onSaved?: () => void;
  onCancel?: () => void;
  defaultType?: AccountType;
}

const AccountOpeningBalance: React.FC<AccountOpeningBalanceProps> = ({
  accountId,
  onSaved,
  onCancel,
  defaultType,
}) => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState(accountId || "");
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [balanceType, setBalanceType] = useState<"debit" | "credit">("credit");
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [accountType, setAccountType] = useState<AccountType | "all">(defaultType || "all");

  // Load accounts
  useEffect(() => {
    const loadedAccounts = getAccounts().filter(a => !a.isSystemAccount && !a.isDeleted);
    setAccounts(loadedAccounts);
    
    if (accountId) {
      const account = loadedAccounts.find(a => a.id === accountId);
      if (account) {
        setOpeningBalance(account.openingBalance || 0);
        setBalanceType(account.openingBalanceType || "credit");
      }
    }
  }, [accountId]);

  // Filter accounts when accountType changes
  useEffect(() => {
    if (accountType === "all") {
      setFilteredAccounts(accounts);
    } else {
      setFilteredAccounts(accounts.filter(a => a.type === accountType));
    }
  }, [accounts, accountType]);

  // Handle account selection
  const handleAccountChange = (value: string) => {
    setSelectedAccountId(value);
    const account = accounts.find(a => a.id === value);
    if (account) {
      setOpeningBalance(account.openingBalance || 0);
      setBalanceType(account.openingBalanceType || "credit");
    }
  };

  // Handle save
  const handleSave = () => {
    try {
      if (!selectedAccountId) {
        toast({
          title: "Error",
          description: "Please select an account",
          variant: "destructive",
        });
        return;
      }

      const account = accounts.find(a => a.id === selectedAccountId);
      if (!account) return;

      // Update account with new opening balance
      const updated = {
        ...account,
        openingBalance,
        openingBalanceType: balanceType,
      };

      updateAccount(updated);

      toast({
        title: "Success",
        description: `Opening balance for ${account.name} updated successfully`,
      });

      if (onSaved) onSaved();
    } catch (error) {
      console.error("Error saving opening balance:", error);
      toast({
        title: "Error",
        description: "Failed to save opening balance",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Opening Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!accountId && (
            <>
              <div className="mb-4">
                <Label htmlFor="accountType">Account Type</Label>
                <Select
                  value={accountType}
                  onValueChange={(value) => setAccountType(value as AccountType | "all")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Account Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="customer">Customers</SelectItem>
                    <SelectItem value="supplier">Suppliers</SelectItem>
                    <SelectItem value="agent">Agents</SelectItem>
                    <SelectItem value="broker">Brokers</SelectItem>
                    <SelectItem value="transporter">Transporters</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <Label htmlFor="account">Select Account</Label>
                <Select
                  value={selectedAccountId}
                  onValueChange={handleAccountChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAccounts.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No accounts found
                      </SelectItem>
                    ) : (
                      filteredAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="openingBalance">Opening Balance (₹)</Label>
              <Input
                id="openingBalance"
                type="number"
                min="0"
                step="0.01"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="balanceType">Balance Type</Label>
              <Select value={balanceType} onValueChange={(value) => setBalanceType(value as "debit" | "credit")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debit">Debit (Dr)</SelectItem>
                  <SelectItem value="credit">Credit (Cr)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button onClick={handleSave}>Save Opening Balance</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountOpeningBalance;
