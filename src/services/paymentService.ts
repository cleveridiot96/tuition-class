
import { v4 as uuidv4 } from 'uuid';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';
import { Payment } from './types';

export function getPayments(): Payment[] {
  return getYearSpecificStorageItem('payments', []);
}

export function savePayments(payments: Payment[]): void {
  saveYearSpecificStorageItem('payments', payments);
}

export function addPayment(payment: Payment): void {
  const payments = getPayments();
  payments.push(payment);
  savePayments(payments);
}

export function updatePayment(updatedPayment: Payment): void {
  const payments = getPayments();
  const index = payments.findIndex(payment => payment.id === updatedPayment.id);
  
  if (index !== -1) {
    payments[index] = updatedPayment;
    savePayments(payments);
  }
}

export function deletePayment(id: string): void {
  const payments = getPayments();
  const index = payments.findIndex(payment => payment.id === id);
  
  if (index !== -1) {
    payments[index] = { ...payments[index], isDeleted: true };
    savePayments(payments);
  }
}
