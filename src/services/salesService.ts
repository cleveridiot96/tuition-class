
import { Sale } from './types';
import { getStorageItem, saveStorageItem } from './storageUtils';

export const getSales = (): Sale[] => {
  return getStorageItem<Sale[]>('sales') || [];
};

export const addSale = (sale: Sale): void => {
  const sales = getSales();
  sales.push(sale);
  saveStorageItem('sales', sales);
};

export const updateSale = (updatedSale: Sale): void => {
  const sales = getSales();
  const index = sales.findIndex(sale => sale.id === updatedSale.id);
  
  if (index !== -1) {
    sales[index] = updatedSale;
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
  saveStorageItem('sales', sales);
};
