
import { Supplier } from './types';

// Supplier functions
export const getSuppliers = (): Supplier[] => {
  const suppliers = localStorage.getItem('suppliers');
  return suppliers ? JSON.parse(suppliers) : [];
};

export const addSupplier = (supplier: Supplier): void => {
  const suppliers = getSuppliers();
  suppliers.push(supplier);
  localStorage.setItem('suppliers', JSON.stringify(suppliers));
};

export const updateSupplier = (updatedSupplier: Supplier): void => {
  const suppliers = getSuppliers();
  const index = suppliers.findIndex(s => s.id === updatedSupplier.id);
  if (index !== -1) {
    suppliers[index] = updatedSupplier;
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
  }
};

export const deleteSupplier = (id: string): void => {
  const suppliers = getSuppliers();
  const updatedSuppliers = suppliers.filter(s => s.id !== id);
  localStorage.setItem('suppliers', JSON.stringify(updatedSuppliers));
};
