
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Purchase, Agent, Supplier, Transporter, Broker, InventoryItem } from '@/services/types';
import { 
  getAgents,
  getSuppliers,
  getTransporters,
  getBrokers,
  getPurchases,
  addPurchase,
  updatePurchase,
  deletePurchase,
  addInventoryItem
} from '@/services/storageService';

export const usePurchaseList = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entityToDelete, setEntityToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [entityToEdit, setEntityToEdit] = useState<Purchase | null>(null);
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
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === null || e.key.includes('purchases')) {
        loadData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', loadData);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', loadData);
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

  const handleSort = (column: keyof Purchase) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
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

  const filteredPurchases = filterEntities(purchases);
  const sortedPurchases = getSortedPurchases(filteredPurchases);

  return {
    purchases: sortedPurchases,
    agents,
    suppliers,
    transporters,
    brokers,
    searchTerm,
    setSearchTerm,
    filterLocation,
    setFilterLocation,
    filterAgent,
    setFilterAgent,
    dateRange,
    setDateRange,
    isAddingToInventory,
    sortColumn,
    sortDirection,
    handleSort,
    entityToDelete,
    setEntityToDelete,
    showDeleteDialog,
    setShowDeleteDialog,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    entityToEdit,
    setEntityToEdit,
    handleDelete,
    handleAdd,
    handleUpdate,
    handleBulkAddToInventory,
    loadData
  };
};
