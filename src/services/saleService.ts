import { v4 as uuidv4 } from 'uuid';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';

export function getSales() {
  return getYearSpecificStorageItem('sales', []);
}

export function saveSale(sale: any, year?: string): boolean {
  try {
    const sales = getSales();
    sale.id = sale.id || uuidv4();
    sales.push(sale);
    saveYearSpecificStorageItem('sales', sales, year, true);
    return true;
  } catch (error) {
    console.error("Error saving sale:", error);
    return false;
  }
}

export function updateSale(updatedSale: any, year?: string): boolean {
  try {
    const sales = getSales();
    const index = sales.findIndex((sale: any) => sale.id === updatedSale.id);
    
    if (index === -1) {
      console.error("Sale not found for update:", updatedSale.id);
      return false;
    }
    
    sales[index] = { ...sales[index], ...updatedSale };
    saveYearSpecificStorageItem('sales', sales, year);
    return true;
  } catch (error) {
    console.error("Error updating sale:", error);
    return false;
  }
}

export function deleteSale(saleId: string, year?: string): boolean {
  try {
    const sales = getSales();
    const index = sales.findIndex((sale: any) => sale.id === saleId);
    
    if (index === -1) {
      console.error("Sale not found for deletion:", saleId);
      return false;
    }
    
    sales.splice(index, 1);
    saveYearSpecificStorageItem('sales', sales, year);
    return true;
  } catch (error) {
    console.error("Error deleting sale:", error);
    return false;
  }
}
