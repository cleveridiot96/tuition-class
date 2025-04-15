
import { Sale } from './types';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';

export const getSales = (): Sale[] => {
  return getYearSpecificStorageItem<Sale[]>('sales') || [];
};

export const addSale = (sale: Sale): void => {
  const sales = getSales();
  // Ensure transportCost is set if missing
  const saleWithDefaults = {
    ...sale,
    transportCost: sale.transportCost ?? 0
  };
  sales.push(saleWithDefaults);
  saveYearSpecificStorageItem('sales', sales);
};

export const updateSale = (updatedSale: Sale): void => {
  const sales = getSales();
  const index = sales.findIndex(sale => sale.id === updatedSale.id);
  if (index !== -1) {
    // Ensure transportCost is set if missing
    const saleWithDefaults = {
      ...updatedSale,
      transportCost: updatedSale.transportCost ?? 0
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
  // Ensure all sales have transportCost
  const normalizedSales = sales.map(sale => ({
    ...sale,
    transportCost: sale.transportCost ?? 0
  }));
  saveYearSpecificStorageItem('sales', normalizedSales);
};
