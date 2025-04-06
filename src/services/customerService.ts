
import { Customer } from './types';

// Customer functions
export const getCustomers = (): Customer[] => {
  const customers = localStorage.getItem('customers');
  return customers ? JSON.parse(customers) : [];
};

export const addCustomer = (customer: Customer): void => {
  const customers = getCustomers();
  customers.push(customer);
  localStorage.setItem('customers', JSON.stringify(customers));
};

export const updateCustomer = (updatedCustomer: Customer): void => {
  const customers = getCustomers();
  const index = customers.findIndex(c => c.id === updatedCustomer.id);
  if (index !== -1) {
    customers[index] = updatedCustomer;
    localStorage.setItem('customers', JSON.stringify(customers));
  }
};

export const deleteCustomer = (id: string): void => {
  const customers = getCustomers();
  const updatedCustomers = customers.filter(c => c.id !== id);
  localStorage.setItem('customers', JSON.stringify(updatedCustomers));
};
