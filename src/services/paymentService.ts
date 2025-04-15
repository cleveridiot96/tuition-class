
import { Payment } from './types';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';

export const getPayments = (): Payment[] => {
  return getYearSpecificStorageItem<Payment>('payments');
};

export const addPayment = (payment: Payment): void => {
  const payments = getPayments();
  payments.push(payment);
  saveYearSpecificStorageItem('payments', payments);
};

export const updatePayment = (updatedPayment: Payment): void => {
  const payments = getPayments();
  const index = payments.findIndex(payment => payment.id === updatedPayment.id);
  if (index !== -1) {
    payments[index] = updatedPayment;
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
