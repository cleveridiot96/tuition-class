
import { Customer } from './types';
import { getStorageItem, saveStorageItem } from './storageUtils';

export const getCustomers = (): Customer[] => {
  return getStorageItem<Customer[]>('customers') || [];
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
    customers[index] = { ...customers[index], isDeleted: true };
    saveStorageItem('customers', customers);
  }
};

export const updateCustomerBalance = (customerId: string, changeAmount: number): void => {
  const customers = getCustomers();
  const customerIndex = customers.findIndex(customer => customer.id === customerId);
  
  if (customerIndex !== -1) {
    customers[customerIndex].balance = (customers[customerIndex].balance || 0) + changeAmount;
    saveStorageItem('customers', customers);
  }
};
