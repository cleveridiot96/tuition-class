
import { Customer } from './types';
import { getStorageItem, saveStorageItem } from './storageUtils';

export const getCustomers = (): Customer[] => {
  return getStorageItem<Customer>('customers');
};

export const addCustomer = (customer: Customer): void => {
  const customers = getCustomers();
  customers.push(customer);
  saveStorageItem('customers', customers);
};

export const updateCustomer = (updatedCustomer: Customer): void => {
  const customers = getCustomers();
  const index = customers.findIndex(customer => customer.id === updatedCustomer.id);
  if (index !== -1) {
    customers[index] = updatedCustomer;
    saveStorageItem('customers', customers);
  }
};

export const deleteCustomer = (id: string): void => {
  const customers = getCustomers();
  const index = customers.findIndex(customer => customer.id === id);
  if (index !== -1) {
    customers.splice(index, 1);
    saveStorageItem('customers', customers);
  }
};
