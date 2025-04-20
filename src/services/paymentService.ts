
import { v4 as uuidv4 } from 'uuid';
import { Payment } from './types';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';
import { performAutoSave } from './storageService';

// Get all non-deleted payments
export const getPayments = (): Payment[] => {
  const payments = getYearSpecificStorageItem<Payment[]>('payments') || [];
  // Filter out deleted payments
  return payments.filter(payment => !payment.isDeleted);
};

// Get all payments including deleted ones
export const getAllPayments = (): Payment[] => {
  return getYearSpecificStorageItem<Payment[]>('payments') || [];
};

// Add new payment and trigger auto-save
export const addPayment = (payment: Payment): void => {
  // Ensure ID is present
  const newPayment = {
    ...payment,
    id: payment.id || uuidv4(),
    isDeleted: false,
    // Ensure backward compatibility fields
    reference: payment.referenceNumber,
    paymentMethod: payment.mode,
    // Make sure we have date as string
    date: typeof payment.date === 'object' ? payment.date.toISOString() : payment.date
  };
  
  const payments = getAllPayments();
  payments.push(newPayment);
  saveYearSpecificStorageItem('payments', payments);
  
  // Add to cashbook as well for double entry
  addPaymentToCashbook(newPayment);
  
  // Auto-save after adding
  performAutoSave();
};

// Update existing payment
export const updatePayment = (updatedPayment: Payment): void => {
  const payments = getAllPayments();
  const index = payments.findIndex(payment => payment.id === updatedPayment.id);
  
  if (index !== -1) {
    // Ensure backward compatibility fields
    const paymentWithCompat = {
      ...updatedPayment,
      reference: updatedPayment.referenceNumber,
      paymentMethod: updatedPayment.mode,
      // Make sure we have date as string
      date: typeof updatedPayment.date === 'object' ? updatedPayment.date.toISOString() : updatedPayment.date
    };
    
    payments[index] = paymentWithCompat;
    saveYearSpecificStorageItem('payments', payments);
    
    // Update in cashbook
    updatePaymentInCashbook(paymentWithCompat);
    
    // Auto-save after update
    performAutoSave();
  }
};

// Soft delete payment
export const deletePayment = (id: string): void => {
  const payments = getAllPayments();
  const index = payments.findIndex(payment => payment.id === id);
  
  if (index !== -1) {
    payments[index] = { ...payments[index], isDeleted: true };
    saveYearSpecificStorageItem('payments', payments);
    
    // Remove from cashbook
    removePaymentFromCashbook(payments[index]);
    
    // Auto-save after deletion
    performAutoSave();
  }
};

// Restore a previously deleted payment
export const restorePayment = (id: string): void => {
  const payments = getAllPayments();
  const index = payments.findIndex(payment => payment.id === id);
  
  if (index !== -1 && payments[index].isDeleted) {
    payments[index] = { ...payments[index], isDeleted: false };
    saveYearSpecificStorageItem('payments', payments);
    
    // Add back to cashbook
    addPaymentToCashbook(payments[index]);
    
    // Auto-save after restoration
    performAutoSave();
  }
};

// Function to synchronize payments with cashbook
export const syncPaymentsWithCashbook = (): void => {
  const payments = getPayments();
  
  // First get the cashbook entries
  const cashbook = getYearSpecificStorageItem<any[]>('cashbook') || [];
  
  // Remove existing payment entries
  const filteredCashbook = cashbook.filter(entry => 
    entry.type !== 'payment' && !entry.paymentId
  );
  
  // Add all non-deleted payments to the cashbook
  payments.forEach(payment => {
    filteredCashbook.push({
      id: `payment_${payment.id}`,
      date: payment.date,
      type: 'payment',
      paymentId: payment.id,
      description: `Payment to ${payment.partyName}`,
      amount: payment.amount,
      inflow: 0,
      outflow: payment.amount,
      notes: payment.notes || '',
      isDeleted: false
    });
  });
  
  // Save the updated cashbook
  saveYearSpecificStorageItem('cashbook', filteredCashbook);
};

// Helper functions for cashbook integration
const addPaymentToCashbook = (payment: Payment): void => {
  const cashbook = getYearSpecificStorageItem<any[]>('cashbook') || [];
  
  cashbook.push({
    id: `payment_${payment.id}`,
    date: payment.date,
    type: 'payment',
    paymentId: payment.id,
    description: `Payment to ${payment.partyName}`,
    amount: payment.amount,
    inflow: 0,
    outflow: payment.amount,
    notes: payment.notes || '',
    isDeleted: false
  });
  
  saveYearSpecificStorageItem('cashbook', cashbook);
};

const updatePaymentInCashbook = (payment: Payment): void => {
  const cashbook = getYearSpecificStorageItem<any[]>('cashbook') || [];
  const index = cashbook.findIndex(entry => entry.paymentId === payment.id);
  
  if (index !== -1) {
    cashbook[index] = {
      ...cashbook[index],
      date: payment.date,
      description: `Payment to ${payment.partyName}`,
      amount: payment.amount,
      outflow: payment.amount,
      notes: payment.notes || '',
      isDeleted: false
    };
    
    saveYearSpecificStorageItem('cashbook', cashbook);
  } else {
    // If not found, add it as new
    addPaymentToCashbook(payment);
  }
};

const removePaymentFromCashbook = (payment: Payment): void => {
  const cashbook = getYearSpecificStorageItem<any[]>('cashbook') || [];
  const index = cashbook.findIndex(entry => entry.paymentId === payment.id);
  
  if (index !== -1) {
    cashbook[index] = { ...cashbook[index], isDeleted: true };
    saveYearSpecificStorageItem('cashbook', cashbook);
  }
};
