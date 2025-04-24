
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

  // Load purchases and related data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get purchases and convert any data type issues
      let purchasesData = getPurchases();
      purchasesData = purchasesData.filter(p => !p.isDeleted);
      
      // Load related data
      const agentsData = getAgents();
      const suppliersData = getSuppliers();
      const transportersData = getTransporters();
      const brokersData = getBrokers();
      
      // Update state
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

  // Filter purchases based on filter criteria
  const filteredPurchases = useMemo(() => {
    if (!purchases) return [];
    
    return purchases.filter(purchase => {
      // Filter by text
      const textLower = filterText.toLowerCase();
      const matchText = !filterText || 
        (purchase.lotNumber?.toLowerCase().includes(textLower)) ||
        (purchase.party?.toLowerCase().includes(textLower)) || 
        (purchase.brokerName?.toLowerCase().includes(textLower));
      
      // Filter by location
      const matchLocation = selectedLocation === 'all' || purchase.location === selectedLocation;
      
      // Filter by status
      let matchStatus = true;
      if (selectedStatus === 'inventorized') {
        matchStatus = !!purchase.isInventorized;
      } else if (selectedStatus === 'not-inventorized') {
        matchStatus = !purchase.isInventorized;
      }
      
      // Filter by date range
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

  // Handle adding purchase to inventory
  const handleAddToInventory = useCallback((purchase: Purchase) => {
    try {
      // Get current inventory
      const currentInventory = getInventory() || [];
      
      // Check if already in inventory
      if (purchase.isInventorized) {
        toast.error('This purchase is already in inventory');
        return;
      }
      
      // Create inventory item
      const inventoryItem: InventoryItem = {
        id: `inv-${purchase.id}`,
        purchaseId: purchase.id,
        date: purchase.date,
        lotNumber: purchase.lotNumber,
        productType: purchase.items[0]?.name || 'Unknown',
        quantity: purchase.quantity,
        remainingQuantity: purchase.quantity,
        isSoldOut: false,
        purchaseRate: purchase.rate,
        finalCost: purchase.totalAfterExpenses,
        location: purchase.location || 'Unknown',
        purchaseDate: purchase.date,
        createdAt: new Date().toISOString(),
        // Add location quantities
        locationQuantities: {
          [purchase.location || 'Unknown']: purchase.quantity
        }
      };
      
      // Add to inventory
      const updatedInventory = [...currentInventory, inventoryItem];
      saveInventory(updatedInventory);
      
      // Update purchase status
      const updatedPurchase = { ...purchase, isInventorized: true };
      updatePurchase(purchase.id, updatedPurchase);
      
      // Update local state
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
