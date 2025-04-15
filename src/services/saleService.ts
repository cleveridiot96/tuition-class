
import { v4 as uuidv4 } from 'uuid';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';
import { Sale } from './types';

export function getSales(): Sale[] {
  return getYearSpecificStorageItem('sales', []);
}

export function saveSales(sales: Sale[]): void {
  saveYearSpecificStorageItem('sales', sales);
}

export function addSale(sale: Sale): void {
  const sales = getSales();
  sales.push(sale);
  saveSales(sales);
}

export function updateSale(updatedSale: Sale): void {
  const sales = getSales();
  const index = sales.findIndex(sale => sale.id === updatedSale.id);
  
  if (index !== -1) {
    sales[index] = updatedSale;
    saveSales(sales);
  }
}

export function deleteSale(id: string): void {
  const sales = getSales();
  const index = sales.findIndex(sale => sale.id === id);
  
  if (index !== -1) {
    sales[index] = { ...sales[index], isDeleted: true };
    saveSales(sales);
  }
}
