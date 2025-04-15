
import { Payment } from './types';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';

export const getPayments = (): Payment[] => {
  return getYearSpecificStorageItem<Payment[]>('payments') || [];
};

export const addPayment = (payment: Payment): void => {
  // Ensure backward compatibility fields
  const paymentWithCompat = {
    ...payment,
    reference: payment.referenceNumber,
    paymentMethod: payment.mode
  };
  
  const payments = getPayments();
  payments.push(paymentWithCompat);
  saveYearSpecificStorageItem('payments', payments);
};

export const updatePayment = (updatedPayment: Payment): void => {
  const payments = getPayments();
  const index = payments.findIndex(payment => payment.id === updatedPayment.id);
  if (index !== -1) {
    // Ensure backward compatibility fields
    const paymentWithCompat = {
      ...updatedPayment,
      reference: updatedPayment.referenceNumber,
      paymentMethod: updatedPayment.mode
    };
    
    payments[index] = paymentWithCompat;
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
