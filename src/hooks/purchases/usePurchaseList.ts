import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  getPurchases, 
  updatePurchase, 
  deletePurchase, 
  getAgents, 
  getBrokers, 
  getSuppliers, 
  getTransporters,
  getInventory,
  saveInventory
} from '@/services/storageService';
import { Purchase, Agent, Broker, Supplier, Transporter, InventoryItem } from '@/services/types';
import { toast } from 'sonner';

export const usePurchaseList = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filterText, setFilterText] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      let purchasesData = getPurchases();
      purchasesData = purchasesData.filter(p => !p.isDeleted);
      
      const agentsData = getAgents();
      const suppliersData = getSuppliers();
      const transportersData = getTransporters();
      const brokersData = getBrokers();
      
      setPurchases(purchasesData);
      setAgents(agentsData);
      setSuppliers(suppliersData);
      setTransporters(transportersData);
      setBrokers(brokersData);
    } catch (err: any) {
      console.error('Error loading purchase data:', err);
      setError(err instanceof Error ? err : new Error(err?.message || 'Unknown error'));
      toast.error('Failed to load purchase data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredPurchases = useMemo(() => {
    if (!purchases) return [];
    
    return purchases.filter(purchase => {
      const textLower = filterText.toLowerCase();
      const matchText = !filterText || 
        (purchase.lotNumber?.toLowerCase().includes(textLower)) ||
        (purchase.party?.toLowerCase().includes(textLower)) || 
        (purchase.brokerName?.toLowerCase().includes(textLower));
      
      const matchLocation = selectedLocation === 'all' || purchase.location === selectedLocation;
      
      let matchStatus = true;
      if (selectedStatus === 'inventorized') {
        matchStatus = !!purchase.isInventorized;
      } else if (selectedStatus === 'not-inventorized') {
        matchStatus = !purchase.isInventorized;
      }
      
      let matchDate = true;
      if (selectedDateRange[0] && selectedDateRange[1]) {
        const purchaseDate = new Date(purchase.date);
        const startDate = selectedDateRange[0];
        const endDate = selectedDateRange[1];
        matchDate = purchaseDate >= startDate && purchaseDate <= endDate;
      }
      
      return matchText && matchLocation && matchStatus && matchDate;
    });
  }, [purchases, filterText, selectedLocation, selectedStatus, selectedDateRange]);

  const handleAddToInventory = useCallback((purchase: Purchase) => {
    try {
      const currentInventory = getInventory() || [];
      
      if (purchase.isInventorized) {
        toast.error('This purchase is already in inventory');
        return;
      }
      
      const inventoryItem: InventoryItem = {
        id: `inv-${purchase.id}`,
        purchaseId: purchase.id,
        date: purchase.date,
        lotNumber: purchase.lotNumber,
        quantity: purchase.quantity,
        remainingQuantity: purchase.quantity,
        location: purchase.location || 'Unknown',
        netWeight: purchase.netWeight,
        rate: purchase.rate,
        ratePerKgAfterExpenses: purchase.ratePerKgAfterExpenses || 0,
        supplier: purchase.party || 'Unknown',
        isDeleted: false,
        isSoldOut: false,
        purchaseRate: purchase.rate,
        finalCost: purchase.totalAfterExpenses,
        dateAdded: new Date().toISOString()
      };
      
      const updatedInventory = [...currentInventory, inventoryItem];
      saveInventory(updatedInventory);
      
      const updatedPurchase = { ...purchase, isInventorized: true };
      updatePurchase(purchase.id, updatedPurchase);
      
      setPurchases(prev => prev.map(p => p.id === purchase.id ? updatedPurchase : p));
      
      toast.success('Added to inventory successfully');
    } catch (err: any) {
      console.error('Error adding to inventory:', err);
      toast.error('Failed to add to inventory');
    }
  }, []);

  return {
    purchases,
    filteredPurchases,
    agents,
    suppliers,
    transporters,
    brokers,
    loading,
    error,
    filterText,
    setFilterText,
    selectedLocation,
    setSelectedLocation,
    selectedStatus, 
    setSelectedStatus,
    selectedDateRange,
    setSelectedDateRange,
    refreshData: loadData,
    handleAddToInventory,
    updatePurchase,
    deletePurchase
  };
};
