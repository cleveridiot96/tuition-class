import { v4 as uuidv4 } from 'uuid';
import { getStorageItem, saveStorageItem } from './storageUtils';
import { Supplier } from './types';

export function getSuppliers(): Supplier[] {
  return getStorageItem('suppliers', []);
}

export const addSupplier = (supplier: Supplier): void => {
  const suppliers = getSuppliers();
  suppliers.push(supplier);
  saveStorageItem('suppliers', suppliers);
};

export const updateSupplier = (updatedSupplier: Supplier): void => {
  const suppliers = getSuppliers();
  const index = suppliers.findIndex(supplier => supplier.id === updatedSupplier.id);
  if (index !== -1) {
    suppliers[index] = updatedSupplier;
    saveStorageItem('suppliers', suppliers);
  }
};

export const deleteSupplier = (id: string): void => {
  const suppliers = getSuppliers();
  const index = suppliers.findIndex(supplier => supplier.id === id);
  if (index !== -1) {
    suppliers.splice(index, 1);
    saveStorageItem('suppliers', suppliers);
  }
};
