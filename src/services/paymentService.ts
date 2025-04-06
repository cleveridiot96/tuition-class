
import { Payment } from './types';
import { addLedgerEntry } from './ledgerService';
import { addCashbookEntry } from './ledgerService';

// Payment functions
export const getPayments = (): Payment[] => {
  const payments = localStorage.getItem('payments');
  return payments ? JSON.parse(payments) : [];
};

export const addPayment = (payment: Payment): void => {
  const payments = getPayments();
  payments.push(payment);
  localStorage.setItem('payments', JSON.stringify(payments));
  
  // Also update the ledger for this payment
  addLedgerEntry({
    id: Date.now().toString(),
    date: payment.date,
    partyName: payment.agent,
    partyType: 'agent',
    description: `Payment: ${payment.paymentNumber}`,
    debit: payment.amount,
    credit: 0,
    balance: 0, // Will be calculated when retrieved
    referenceId: payment.id,
    referenceType: 'payment'
  });

  // If payment method is cash, add to cashbook
  if (payment.paymentMethod === 'cash') {
    addCashbookEntry(
      payment.date,
      `Payment: ${payment.agent}`,
      payment.amount, // Debit
      0, // Credit
      payment.id,
      'payment'
    );
  }
};

export const updatePayment = (updatedPayment: Payment): void => {
  const payments = getPayments();
  const index = payments.findIndex(p => p.id === updatedPayment.id);
  if (index !== -1) {
    payments[index] = updatedPayment;
    localStorage.setItem('payments', JSON.stringify(payments));
  }
};

export const deletePayment = (id: string): void => {
  const payments = getPayments();
  const updatedPayments = payments.filter(p => p.id !== id);
  localStorage.setItem('payments', JSON.stringify(updatedPayments));
};
