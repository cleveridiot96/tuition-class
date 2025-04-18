import { Sale } from './types';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';
import { v4 as uuidv4 } from 'uuid';

export const getSales = (): Sale[] => {
  return getYearSpecificStorageItem<Sale[]>('sales') || [];
};

export const addSale = (sale: Sale): void => {
  const sales = getSales();
  
  // Ensure transportCost is set if missing and proper broker info
  const saleWithDefaults = {
    ...sale,
    id: sale.id || uuidv4(),
    transportCost: sale.transportCost ?? 0,
    // Make sure broker information is consistent
    brokerId: sale.brokerId || null,
    broker: sale.broker || null
  };
  
  sales.push(saleWithDefaults);
  saveYearSpecificStorageItem('sales', sales);
};

export const updateSale = (updatedSale: Sale): void => {
  const sales = getSales();
  const index = sales.findIndex(sale => sale.id === updatedSale.id);
  
  if (index !== -1) {
    // Ensure transportCost is set if missing and broker info is maintained
    const saleWithDefaults = {
      ...updatedSale,
      transportCost: updatedSale.transportCost ?? 0,
      // Keep broker relationship consistent
      brokerId: updatedSale.brokerId || sales[index].brokerId,
      broker: updatedSale.broker || sales[index].broker
    };
    
    sales[index] = saleWithDefaults;
    saveYearSpecificStorageItem('sales', sales);
  }
};

export const deleteSale = (id: string): void => {
  const sales = getSales();
  const index = sales.findIndex(sale => sale.id === id);
  if (index !== -1) {
    sales[index] = { ...sales[index], isDeleted: true };
    saveYearSpecificStorageItem('sales', sales);
  }
};

export const saveSales = (sales: Sale[]): void => {
  // Ensure all sales have transportCost and proper broker info
  const normalizedSales = sales.map(sale => ({
    ...sale,
    transportCost: sale.transportCost ?? 0
  }));
  
  saveYearSpecificStorageItem('sales', normalizedSales);
};
