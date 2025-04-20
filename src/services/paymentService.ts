import { Payment } from './types';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';

export const getPayments = (): Payment[] => {
  return getYearSpecificStorageItem<Payment[]>('payments') || [];
};

export const addPayment = (payment: Payment): void => {
  const payments = getPayments();
  
  // Ensure payment.date is not null
  const paymentWithDefaults = {
    ...payment,
    date: payment.date || new Date().toISOString().split('T')[0],
  };
  
  payments.push(paymentWithDefaults);
  saveYearSpecificStorageItem('payments', payments);
};

export const updatePayment = (updatedPayment: Payment): void => {
  const payments = getPayments();
  const index = payments.findIndex(payment => payment.id === updatedPayment.id);
  
  if (index !== -1) {
    // Ensure updatedPayment.date is not null
    const paymentWithDefaults = {
      ...updatedPayment,
      date: updatedPayment.date || payments[index].date || new Date().toISOString().split('T')[0],
    };
    
    payments[index] = paymentWithDefaults;
    saveYearSpecificStorageItem('payments', payments);
  }
};

export const deletePayment = (id: string): void => {
  const payments = getPayments();
  const index = payments.findIndex(payment => payment.id === id);
  if (index !== -1) {
    payments[index] = { ...payments[index], isDeleted: true };
    saveYearSpecificStorageItem('payments', payments);
  }
};

export const savePayments = (payments: Payment[]): void => {
  saveYearSpecificStorageItem('payments', payments);
};
