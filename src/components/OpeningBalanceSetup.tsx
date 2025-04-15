
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  getActiveFinancialYear, 
  getOpeningBalances, 
  saveOpeningBalances
} from '@/services/financialYearService';
import {
  getAgents,
  getBrokers,
  getCustomers,
  getSuppliers,
  getTransporters,
  getLocations
} from '@/services/storageService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { v4 as uuidv4 } from 'uuid';
import { OpeningBalance, StockOpeningBalance, PartyOpeningBalance } from '@/services/types';

interface OpeningBalanceSetupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StockItem {
  id: string;
  name: string;
  lotNumber: string;
  quantity: number;
  location: string;
  rate: number;
  netWeight: number;
  amount: number;
  balanceType: 'debit';
}

interface PartyItem {
  id: string;
  name: string;
  type: 'agent' | 'broker' | 'customer' | 'supplier' | 'transporter';
  partyId: string;
  partyName: string;
  partyType: string;
  amount: number;
  balanceType: 'debit' | 'credit';
}

const OpeningBalanceSetup = ({ isOpen, onClose }: OpeningBalanceSetupProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('cash');
  const [cash, setCash] = useState(0);
  const [bank, setBank] = useState(0);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [partyBalances, setPartyBalances] = useState<PartyItem[]>([]);
  const [newLot, setNewLot] = useState({
    lotNumber: '',
    quantity: 0,
    location: '',
    rate: 0,
    netWeight: 0
  });
  const locations = getLocations();

  useEffect(() => {
    if (isOpen) {
      const activeYear = getActiveFinancialYear();
      if (activeYear) {
        const openingBalances = getOpeningBalances(activeYear.id);
        
        if (openingBalances) {
          setCash(openingBalances.cash || 0);
          setBank(openingBalances.bank || 0);
          setStockItems(openingBalances.stock.map(item => ({
            id: item.id || uuidv4(),
            name: item.name || item.lotNumber || 'Stock Item',
            lotNumber: item.lotNumber || '',
            quantity: item.quantity || 0,
            location: item.location || '',
            rate: item.rate || 0,
            netWeight: item.netWeight || 0,
            amount: item.amount || 0,
            balanceType: 'debit'
          })));
          setPartyBalances(openingBalances.parties.map(party => ({
            id: party.id || uuidv4(),
            name: party.name || party.partyName || '',
            type: party.type || (party.partyType as any) || 'customer',
            partyId: party.partyId || '',
            partyName: party.partyName || party.name || '',
            partyType: party.partyType || party.type || '',
            amount: party.amount || 0,
            balanceType: party.balanceType || 'credit'
          })));
        } else {
          // Initialize with default values
          setCash(0);
          setBank(0);
          setStockItems([]);
          initializePartyBalances();
        }
      }
    }
  }, [isOpen]);

  const initializePartyBalances = () => {
    const agents = getAgents().map(agent => ({
      id: uuidv4(),
      name: agent.name,
      type: 'agent' as const,
      partyId: agent.id,
      partyName: agent.name,
      partyType: 'agent',
      amount: 0,
      balanceType: 'credit' as const
    }));
    
    const brokers = getBrokers().map(broker => ({
      id: uuidv4(),
      name: broker.name,
      type: 'broker' as const,
      partyId: broker.id,
      partyName: broker.name,
      partyType: 'broker',
      amount: 0,
      balanceType: 'credit' as const
    }));
    
    const customers = getCustomers().map(customer => ({
      id: uuidv4(),
      name: customer.name,
      type: 'customer' as const,
      partyId: customer.id,
      partyName: customer.name,
      partyType: 'customer',
      amount: 0,
      balanceType: 'debit' as const
    }));
    
    const suppliers = getSuppliers().map(supplier => ({
      id: uuidv4(),
      name: supplier.name,
      type: 'supplier' as const,
      partyId: supplier.id,
      partyName: supplier.name,
      partyType: 'supplier',
      amount: 0,
      balanceType: 'credit' as const
    }));
    
    const transporters = getTransporters().map(transporter => ({
      id: uuidv4(),
      name: transporter.name,
      type: 'transporter' as const,
      partyId: transporter.id,
      partyName: transporter.name,
      partyType: 'transporter',
      amount: 0,
      balanceType: 'credit' as const
    }));
    
    setPartyBalances([...agents, ...brokers, ...customers, ...suppliers, ...transporters]);
  };

  const handleSave = () => {
    const activeYear = getActiveFinancialYear();
    if (!activeYear) {
      toast({
        title: "Error",
        description: "No active financial year found",
        variant: "destructive"
      });
      return;
    }
    
    // Convert to proper format for saving
    const formattedStockItems: StockOpeningBalance[] = stockItems.map(item => ({
      id: item.id,
      name: item.lotNumber || item.name,
      lotNumber: item.lotNumber,
      quantity: item.quantity,
      location: item.location,
      rate: item.rate,
      netWeight: item.netWeight,
      amount: item.quantity * item.rate,
      balanceType: 'debit'
    }));
    
    const formattedPartyItems: PartyOpeningBalance[] = partyBalances.map(party => ({
      id: party.id,
      name: party.partyName,
      type: party.type,
      partyId: party.partyId,
      partyName: party.partyName,
      partyType: party.partyType,
      amount: party.amount,
      balanceType: party.balanceType
    }));
    
    const openingBalances: OpeningBalance = {
      id: uuidv4(),
      yearId: activeYear.id,
      cash,
      bank,
      stock: formattedStockItems,
      parties: formattedPartyItems
    };
    
    if (saveOpeningBalances(openingBalances)) {
      toast({
        title: "Success",
        description: "Opening balances saved successfully"
      });
      onClose();
    } else {
      toast({
        title: "Error",
        description: "Failed to save opening balances",
        variant: "destructive"
      });
    }
  };

  const addStockItem = () => {
    if (!newLot.lotNumber || newLot.quantity <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter valid lot number and quantity",
        variant: "destructive"
      });
      return;
    }
    
    // Check for duplicate lot number
    if (stockItems.some(item => item.lotNumber === newLot.lotNumber)) {
      toast({
        title: "Validation Error",
        description: "A stock item with this lot number already exists",
        variant: "destructive"
      });
      return;
    }
    
    const newItem: StockItem = {
      id: uuidv4(),
      name: newLot.lotNumber,
      lotNumber: newLot.lotNumber,
      quantity: newLot.quantity,
      location: newLot.location,
      rate: newLot.rate,
      netWeight: newLot.netWeight,
      amount: newLot.quantity * newLot.rate,
      balanceType: 'debit'
    };
    
    setStockItems([...stockItems, newItem]);
    
    setNewLot({
      lotNumber: '',
      quantity: 0,
      location: '',
      rate: 0,
      netWeight: 0
    });
  };

  const removeStockItem = (lotNumber: string) => {
    setStockItems(stockItems.filter(item => item.lotNumber !== lotNumber));
  };

  const updatePartyBalance = (index: number, amount: number, balanceType?: 'debit' | 'credit') => {
    const updatedBalances = [...partyBalances];
    updatedBalances[index] = {
      ...updatedBalances[index],
      amount,
      ...(balanceType && { balanceType })
    };
    setPartyBalances(updatedBalances);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Setup Opening Balances</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="cash" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="cash">Cash</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cash">
            <Card>
              <CardHeader>
                <CardTitle>Cash Opening Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cash-balance" className="text-right">
                      Cash Balance
                    </Label>
                    <Input
                      id="cash-balance"
                      type="number"
                      value={cash}
                      onChange={(e) => setCash(Number(e.target.value))}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bank-balance" className="text-right">
                      Bank Balance
                    </Label>
                    <Input
                      id="bank-balance"
                      type="number"
                      value={bank}
                      onChange={(e) => setBank(Number(e.target.value))}
                      className="col-span-3"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Party Balances</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="customers">
                  <TabsList className="grid grid-cols-5">
                    <TabsTrigger value="customers">Customers</TabsTrigger>
                    <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
                    <TabsTrigger value="agents">Agents</TabsTrigger>
                    <TabsTrigger value="brokers">Brokers</TabsTrigger>
                    <TabsTrigger value="transporters">Transporters</TabsTrigger>
                  </TabsList>
                  
                  {['customers', 'suppliers', 'agents', 'brokers', 'transporters'].map((partyType) => (
                    <TabsContent key={partyType} value={partyType}>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Balance Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {partyBalances
                            .filter(party => party.type === partyType.slice(0, -1)) // Remove 's' from plural
                            .map((party, index) => {
                              const originalIndex = partyBalances.findIndex(p => 
                                p.partyId === party.partyId && p.type === party.type
                              );
                              
                              return (
                                <TableRow key={party.partyId}>
                                  <TableCell>{party.partyName}</TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={party.amount || ''}
                                      onChange={(e) => updatePartyBalance(
                                        originalIndex, 
                                        Number(e.target.value)
                                      )}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <select
                                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                      value={party.balanceType}
                                      onChange={(e) => updatePartyBalance(
                                        originalIndex, 
                                        party.amount, 
                                        e.target.value as 'debit' | 'credit'
                                      )}
                                    >
                                      <option value="debit">Debit (DR)</option>
                                      <option value="credit">Credit (CR)</option>
                                    </select>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stock">
            <Card>
              <CardHeader>
                <CardTitle>Stock Opening Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lot Number</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Net Weight</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockItems.map((item) => (
                      <TableRow key={item.lotNumber}>
                        <TableCell>{item.lotNumber}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.netWeight}</TableCell>
                        <TableCell>₹{item.rate.toFixed(2)}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeStockItem(item.lotNumber)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Add New Stock Item</h4>
                  <div className="grid grid-cols-6 gap-2">
                    <Input
                      placeholder="Lot Number"
                      value={newLot.lotNumber}
                      onChange={(e) => setNewLot({...newLot, lotNumber: e.target.value})}
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={newLot.quantity || ''}
                      onChange={(e) => setNewLot({...newLot, quantity: Number(e.target.value)})}
                    />
                    <Input
                      type="number"
                      placeholder="Net Weight"
                      value={newLot.netWeight || ''}
                      onChange={(e) => setNewLot({...newLot, netWeight: Number(e.target.value)})}
                    />
                    <Input
                      type="number"
                      placeholder="Rate"
                      value={newLot.rate || ''}
                      onChange={(e) => setNewLot({...newLot, rate: Number(e.target.value)})}
                    />
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newLot.location}
                      onChange={(e) => setNewLot({...newLot, location: e.target.value})}
                    >
                      <option value="">Select Location</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                    <Button onClick={addStockItem}>Add</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Opening Balances
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OpeningBalanceSetup;
