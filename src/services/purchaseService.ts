import { Purchase } from './types';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';
import { v4 as uuidv4 } from 'uuid';

export const getPurchases = (): Purchase[] => {
  return getYearSpecificStorageItem<Purchase[]>('purchases') || [];
};

export const addPurchase = (purchase: Purchase): void => {
  const purchases = getPurchases();
  
  // Ensure proper ID structure for new purchases
  const newPurchase: Purchase = {
    ...purchase,
    id: purchase.id || uuidv4(),
    // Make sure agent information is properly set 
    agentId: purchase.agentId || null,
    agent: purchase.agent || null
  };
  
  purchases.push(newPurchase);
  saveYearSpecificStorageItem('purchases', purchases);
};

export const updatePurchase = (updatedPurchase: Purchase): void => {
  const purchases = getPurchases();
  const index = purchases.findIndex(purchase => purchase.id === updatedPurchase.id);
  
  if (index !== -1) {
    // Ensure we maintain agent information properly
    purchases[index] = {
      ...updatedPurchase,
      // Keep agent relationship consistent
      agentId: updatedPurchase.agentId || purchases[index].agentId,
      agent: updatedPurchase.agent || purchases[index].agent
    };
    saveYearSpecificStorageItem('purchases', purchases);
  }
};

export const deletePurchase = (id: string): void => {
  const purchases = getPurchases();
  const index = purchases.findIndex(purchase => purchase.id === id);
  if (index !== -1) {
    purchases[index] = { ...purchases[index], isDeleted: true };
    saveYearSpecificStorageItem('purchases', purchases);
  }
};

export const savePurchases = (purchases: Purchase[]): void => {
  saveYearSpecificStorageItem('purchases', purchases);
};
