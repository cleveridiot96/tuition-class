
import { Sale } from '@/services/types';

// Function to ensure Sale objects match the expected interface
export const normalizeSale = (sale: any): Sale => {
  return {
    ...sale,
    netAmount: sale.netAmount ?? sale.totalAmount ?? 0,
    transportCost: sale.transportCost ?? 0,
    amount: sale.amount ?? sale.totalAmount ?? 0, // Ensure amount is always set
  };
};

// Function to normalize an array of sales
export const normalizeSales = (sales: any[]): Sale[] => {
  return sales.map(sale => normalizeSale(sale));
};
