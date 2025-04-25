
import { getStorageItem, saveStorageItem } from './storageUtils';

interface Master {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  isDeleted?: boolean;
  type?: string;
  commissionRate?: number;
}

export const getMasters = (): Master[] => {
  try {
    const data = getStorageItem<Master[]>('masters');
    return data || [];
  } catch (err) {
    console.error("Failed to load masters", err);
    return [];
  }
};

export const addMaster = (master: Master): void => {
  try {
    const existing = getMasters();
    existing.push(master);
    saveStorageItem('masters', existing);
  } catch (err) {
    console.error("Failed to save master", err);
  }
};

export const deleteMaster = (masterId: string): void => {
  try {
    const existing = getMasters();
    
    // Instead of filtering, mark as deleted or fully remove
    const updatedMasters = existing.map(m => {
      if (m.id === masterId) {
        return { ...m, isDeleted: true };
      }
      return m;
    });
    
    saveStorageItem('masters', updatedMasters);
  } catch (err) {
    console.error("Failed to delete master", err);
  }
};

export const updateMaster = (masterId: string, updatedMaster: Partial<Master>): void => {
  try {
    const existing = getMasters();
    const masterIndex = existing.findIndex(m => m.id === masterId);
    if (masterIndex !== -1) {
      existing[masterIndex] = { 
        ...existing[masterIndex], 
        ...updatedMaster 
      };
      saveStorageItem('masters', existing);
    }
  } catch (err) {
    console.error("Failed to update master", err);
  }
};
