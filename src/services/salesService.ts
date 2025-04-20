
import { Sale } from './types';
import { getStorageItem, saveStorageItem } from './storageUtils';

export const getSales = (): Sale[] => {
  return getStorageItem<Sale[]>('sales') || [];
};

export const addSale = (sale: Sale): void => {
  const sales = getSales();
  
  // Ensure all required fields are present
  const saleWithDefaults = {
    ...sale,
    transportCost: sale.transportCost ?? 0,
    brokerId: sale.brokerId || null,
    broker: sale.broker || null,
    salesBroker: sale.salesBroker || sale.broker || null
  };
  
  sales.push(saleWithDefaults);
  saveStorageItem('sales', sales);
};

export const updateSale = (updatedSale: Sale): void => {
  const sales = getSales();
  const index = sales.findIndex(sale => sale.id === updatedSale.id);
  
  if (index !== -1) {
    // Ensure transportCost is set if missing
    const saleWithDefaults = {
      ...updatedSale,
      transportCost: updatedSale.transportCost ?? sales[index].transportCost ?? 0,
      brokerId: updatedSale.brokerId || sales[index].brokerId,
      broker: updatedSale.broker || sales[index].broker,
      salesBroker: updatedSale.salesBroker || updatedSale.broker || sales[index].broker
    };
    
    sales[index] = saleWithDefaults;
    saveStorageItem('sales', sales);
  }
};

export const deleteSale = (id: string): void => {
  const sales = getSales();
  const index = sales.findIndex(sale => sale.id === id);
  if (index !== -1) {
    sales[index] = { ...sales[index], isDeleted: true };
    saveStorageItem('sales', sales);
  }
};

export const saveSales = (sales: Sale[]): void => {
  // Ensure all sales have transportCost
  const normalizedSales = sales.map(sale => ({
    ...sale,
    transportCost: sale.transportCost ?? 0,
    salesBroker: sale.salesBroker || sale.broker || null
  }));
  
  saveStorageItem('sales', normalizedSales);
};
