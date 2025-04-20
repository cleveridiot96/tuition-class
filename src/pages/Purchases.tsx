import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { format } from 'date-fns';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import NewPurchaseForm from '@/components/NewPurchaseForm';
import { 
  getAgents,
  getSuppliers,
  getTransporters,
  getBrokers,
  getPurchases,
  addPurchase,
  updatePurchase,
  deletePurchase,
  addInventoryItem,
  Purchase,
  InventoryItem,
  Agent,
  Supplier,
  Transporter,
  Broker,
  savePurchases
} from '@/services/storageService';
import { Edit, Trash2, Plus, Search, PackagePlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entityToDelete, setEntityToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [entityToEdit, setEntityToEdit] = useState(null);
  const [filterLocation, setFilterLocation] = useState('');
  const [filterAgent, setFilterAgent] = useState('');
  const [dateRange, setDateRange] = useState<any>({
    from: null,
    to: null,
  });
  const [isAddingToInventory, setIsAddingToInventory] = useState(false);
  const [sortColumn, setSortColumn] = useState<keyof Purchase | null>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const loadData = useCallback(() => {
    setPurchases(getPurchases() || []);
    setAgents(getAgents() || []);
    setSuppliers(getSuppliers() || []);
    setTransporters(getTransporters() || []);
    setBrokers(getBrokers() || []);
  }, []);

  useEffect(() => {
    loadData();
    
    const handleStorageChange = (e) => {
      if (e.key === null || e.key.includes('purchases')) {
        loadData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const handleFocus = () => {
      loadData();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadData]);

  const filterEntities = (purchases: Purchase[]) => {
    let filtered = [...purchases];

    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(purchase => {
        const purchaseDate = new Date(purchase.date);
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        return purchaseDate >= fromDate && purchaseDate <= toDate;
      });
    }
    
    if (searchTerm) {
      filtered = filtered.filter(purchase => 
        purchase.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (purchase.party && purchase.party.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (purchase.agent && purchase.agent.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (purchase.transporter && purchase.transporter.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (purchase.broker && purchase.broker.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterLocation) {
      filtered = filtered.filter(purchase => purchase.location === filterLocation);
    }
    
    if (filterAgent) {
      filtered = filtered.filter(purchase => purchase.agentId === filterAgent);
    }

    return filtered;
  };

  const confirmDelete = (id: string) => {
    setEntityToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    if (!entityToDelete) return;

    deletePurchase(entityToDelete);
    loadData();
    toast.success(`Purchase deleted successfully`);
    setShowDeleteDialog(false);
    setEntityToDelete(null);
  };

  const handleAdd = (data: Purchase) => {
    addPurchase({
      ...data,
      id: uuidv4(),
    });

    loadData();
    setIsAddDialogOpen(false);
    toast.success(`Purchase added successfully`);
  };

  const openEditDialog = (purchase: Purchase) => {
    setEntityToEdit(purchase);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: Purchase) => {
    if (!entityToEdit) return;

    const updatedPurchase = {
      ...entityToEdit,
      ...data,
    };

    updatePurchase(updatedPurchase);
    loadData();
    toast.success(`Purchase updated successfully`);
    setIsEditDialogOpen(false);
    setEntityToEdit(null);
  };

  const handleAddToInventory = (purchase: Purchase) => {
    const inventoryItem: InventoryItem = {
      id: uuidv4(),
      lotNumber: purchase.lotNumber,
      quantity: purchase.quantity,
      location: purchase.location,
      dateAdded: new Date().toISOString(),
      netWeight: purchase.netWeight,
      remainingQuantity: purchase.quantity,
      purchaseRate: purchase.rate,
      finalCost: purchase.totalAfterExpenses,
      agentId: purchase.agentId || '',
      agentName: purchase.agent || '',
      date: purchase.date,
      rate: purchase.rate,
    };

    addInventoryItem(inventoryItem);
  };

  const handleBulkAddToInventory = async (selectedPurchases: Purchase[]) => {
    setIsAddingToInventory(true);
    try {
      for (const purchase of selectedPurchases) {
        handleAddToInventory(purchase);
      }
      toast.success(`${selectedPurchases.length} purchases added to inventory successfully`);
    } catch (error) {
      console.error("Error adding to inventory:", error);
      toast.error("Error adding purchases to inventory");
    } finally {
      setIsAddingToInventory(false);
    }
  };

  const getPurchaseFormFields = () => {
    return [
      {
        name: 'date',
        label: 'Date',
        type: 'date',
        required: true,
      },
      {
        name: 'lotNumber',
        label: 'Lot Number',
        type: 'text',
        required: true,
      },
      {
        name: 'partyId',
        label: 'Supplier',
        type: 'select',
        options: suppliers.map(supplier => ({ value: supplier.id, label: supplier.name })),
        required: true,
      },
      {
        name: 'agentId',
        label: 'Agent',
        type: 'select',
        options: agents.map(agent => ({ value: agent.id, label: agent.name })),
        required: false,
      },
      {
        name: 'quantity',
        label: 'Quantity',
        type: 'number',
        required: true,
      },
      {
        name: 'netWeight',
        label: 'Net Weight',
        type: 'number',
        required: true,
      },
      {
        name: 'rate',
        label: 'Rate',
        type: 'number',
        required: true,
      },
      {
        name: 'totalAmount',
        label: 'Total Amount',
        type: 'number',
        required: true,
      },
      {
        name: 'transporterId',
        label: 'Transporter',
        type: 'select',
        options: transporters.map(transporter => ({ value: transporter.id, label: transporter.name })),
        required: false,
      },
      {
        name: 'transportRate',
        label: 'Transport Rate',
        type: 'number',
        required: false,
      },
      {
        name: 'transportAmount',
        label: 'Transport Amount',
        type: 'number',
        required: false,
      },
      {
        name: 'brokerId',
        label: 'Broker',
        type: 'select',
        options: brokers.map(broker => ({ value: broker.id, label: broker.name })),
        required: false,
      },
      {
        name: 'brokerageType',
        label: 'Brokerage Type',
        type: 'select',
        options: [{ value: 'percentage', label: 'Percentage' }, { value: 'fixed', label: 'Fixed' }],
        required: false,
      },
      {
        name: 'brokerageValue',
        label: 'Brokerage Value',
        type: 'number',
        required: false,
      },
      {
        name: 'brokerageAmount',
        label: 'Brokerage Amount',
        type: 'number',
        required: false,
      },
      {
        name: 'expenses',
        label: 'Expenses',
        type: 'number',
        required: false,
      },
      {
        name: 'totalAfterExpenses',
        label: 'Total After Expenses',
        type: 'number',
        required: true,
      },
      {
        name: 'location',
        label: 'Location',
        type: 'text',
        required: true,
      },
      {
        name: 'notes',
        label: 'Notes',
        type: 'text',
        required: false,
      },
    ];
  };

  const getSortedPurchases = (purchases: Purchase[]) => {
    if (!sortColumn) return purchases;

    return [...purchases].sort((a, b) => {
      const aValue = a[sortColumn] || '';
      const bValue = b[sortColumn] || '';

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filteredPurchases = filterEntities(purchases);
  const sortedPurchases = getSortedPurchases(filteredPurchases);

  return (
    <div className="min-h-screen">
      <Navigation title="Purchases" showBackButton={true} />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Purchases</h1>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-1" /> Add Purchase
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Purchase</DialogTitle>
              </DialogHeader>
              <NewPurchaseForm 
                onSubmit={handleAdd} 
                fields={getPurchaseFormFields()}
                agents={agents}
                suppliers={suppliers}
                transporters={transporters}
                brokers={brokers}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="mb-4">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search purchases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div>
                <Label>Filter by Location</Label>
                <Input
                  placeholder="Enter location"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Filter by Agent</Label>
                <Select onValueChange={setFilterAgent}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map(agent => (
                      <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-3">
                <Label>Filter by Date Range</Label>
                <DateRangePicker date={dateRange} onDateChange={setDateRange} />
              </div>
            </div>
          </CardContent>
        </Card>

        {sortedPurchases.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No purchases found.</p>
        ) : (
          <>
            <div className="mb-4">
              <BulkAddToInventoryButton
                purchases={sortedPurchases}
                onAddToInventory={handleBulkAddToInventory}
                disabled={isAddingToInventory}
              />
            </div>
            <PurchaseTable
              purchases={sortedPurchases}
              onDelete={confirmDelete}
              onEdit={openEditDialog}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={(column) => {
                if (column === sortColumn) {
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortColumn(column);
                  setSortDirection('asc');
                }
              }}
            />
          </>
        )}
        
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this purchase? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Purchase</DialogTitle>
            </DialogHeader>
            {entityToEdit && (
              <NewPurchaseForm 
                onSubmit={handleUpdate} 
                initialData={entityToEdit}
                fields={getPurchaseFormFields()}
                agents={agents}
                suppliers={suppliers}
                transporters={transporters}
                brokers={brokers}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const PurchaseTable = ({ purchases, onDelete, onEdit, sortColumn, sortDirection, onSort }) => {
  const handleSort = (column: keyof Purchase) => {
    onSort(column);
  };

  return (
    <ScrollArea className="h-[calc(100vh-350px)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('date')} className="cursor-pointer">
              Date {sortColumn === 'date' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('lotNumber')} className="cursor-pointer">
              Lot Number {sortColumn === 'lotNumber' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('party')} className="cursor-pointer">
              Supplier {sortColumn === 'party' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('agent')} className="cursor-pointer">
              Agent {sortColumn === 'agent' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('quantity')} className="cursor-pointer">
              Quantity {sortColumn === 'quantity' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('netWeight')} className="cursor-pointer">
              Net Weight {sortColumn === 'netWeight' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('rate')} className="cursor-pointer">
              Rate {sortColumn === 'rate' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('totalAmount')} className="cursor-pointer">
              Total Amount {sortColumn === 'totalAmount' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell>{purchase.date}</TableCell>
              <TableCell>{purchase.lotNumber}</TableCell>
              <TableCell>{purchase.party}</TableCell>
              <TableCell>{purchase.agent || '-'}</TableCell>
              <TableCell>{purchase.quantity}</TableCell>
              <TableCell>{purchase.netWeight}</TableCell>
              <TableCell>{purchase.rate}</TableCell>
              <TableCell>{purchase.totalAmount}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(purchase)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onDelete(purchase.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

const BulkAddToInventoryButton = ({ purchases, onAddToInventory, disabled }) => {
  const [selectedPurchases, setSelectedPurchases] = useState<Purchase[]>([]);
  const [isBulkAddDialogOpen, setIsBulkAddDialogOpen] = useState(false);

  useEffect(() => {
    if (isBulkAddDialogOpen) {
      setSelectedPurchases(purchases);
    } else {
      setSelectedPurchases([]);
    }
  }, [isBulkAddDialogOpen, purchases]);

  const handleCheckboxChange = (purchase: Purchase) => {
    setSelectedPurchases((prevSelected) => {
      if (prevSelected.find((p) => p.id === purchase.id)) {
        return prevSelected.filter((p) => p.id !== purchase.id);
      } else {
        return [...prevSelected, purchase];
      }
    });
  };

  const isPurchaseSelected = (purchase: Purchase) => {
    return selectedPurchases.find((p) => p.id === purchase.id);
  };

  const handleBulkAdd = () => {
    onAddToInventory(selectedPurchases);
    setIsBulkAddDialogOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsBulkAddDialogOpen(true)} disabled={disabled}>
        <PackagePlus size={18} className="mr-2" />
        Add Selected to Inventory
      </Button>

      <Dialog open={isBulkAddDialogOpen} onOpenChange={setIsBulkAddDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add Purchases to Inventory</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] mb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Select</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Lot Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Net Weight</TableHead>
                  <TableHead>Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="w-[100px]">
                      <Input
                        type="checkbox"
                        checked={isPurchaseSelected(purchase)}
                        onChange={() => handleCheckboxChange(purchase)}
                      />
                    </TableCell>
                    <TableCell>{purchase.date}</TableCell>
                    <TableCell>{purchase.lotNumber}</TableCell>
                    <TableCell>{purchase.party}</TableCell>
                    <TableCell>{purchase.quantity}</TableCell>
                    <TableCell>{purchase.netWeight}</TableCell>
                    <TableCell>{purchase.rate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsBulkAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleBulkAdd} disabled={selectedPurchases.length === 0}>
              Add {selectedPurchases.length} to Inventory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Purchases;
