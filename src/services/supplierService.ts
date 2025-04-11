
import { Supplier } from './types';
import { getStorageItem, saveStorageItem } from './storageUtils';

export const getSuppliers = (): Supplier[] => {
  return getStorageItem<Supplier>('suppliers');
};

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
