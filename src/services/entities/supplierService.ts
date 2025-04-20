
import { Supplier } from '../types';
import { getEntities, addEntity, updateEntity, deleteEntity } from '../utils/entityUtils';

const STORAGE_KEY = 'suppliers';

export const getSuppliers = (): Supplier[] => {
  return getEntities<Supplier>(STORAGE_KEY);
};

export const addSupplier = (supplier: Supplier): void => {
  addEntity<Supplier>(STORAGE_KEY, supplier);
};

export const updateSupplier = (updatedSupplier: Supplier): void => {
  updateEntity<Supplier>(STORAGE_KEY, updatedSupplier);
};

export const deleteSupplier = (id: string): void => {
  deleteEntity<Supplier>(STORAGE_KEY, id);
};

