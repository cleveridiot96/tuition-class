
import { Sale } from './types';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';

export const getSales = (): Sale[] => {
  return getYearSpecificStorageItem<Sale>('sales');
};

export const addSale = (sale: Sale): void => {
  const sales = getSales();
  sales.push(sale);
  saveYearSpecificStorageItem('sales', sales);
};

export const updateSale = (updatedSale: Sale): void => {
  const sales = getSales();
  const index = sales.findIndex(sale => sale.id === updatedSale.id);
  if (index !== -1) {
    sales[index] = updatedSale;
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
