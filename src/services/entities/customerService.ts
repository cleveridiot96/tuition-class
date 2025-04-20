
import { Customer } from '../types';
import { getEntities, addEntity, updateEntity, deleteEntity } from '../utils/entityUtils';

const STORAGE_KEY = 'customers';

export const getCustomers = (): Customer[] => {
  return getEntities<Customer>(STORAGE_KEY);
};

export const addCustomer = (customer: Customer): void => {
  addEntity<Customer>(STORAGE_KEY, customer);
};

export const updateCustomer = (updatedCustomer: Customer): void => {
  updateEntity<Customer>(STORAGE_KEY, updatedCustomer);
};

export const deleteCustomer = (id: string): void => {
  deleteEntity<Customer>(STORAGE_KEY, id);
};

