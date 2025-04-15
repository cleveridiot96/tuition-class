import { v4 as uuidv4 } from 'uuid';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';

export function getPayments() {
  return getYearSpecificStorageItem('payments', []);
}

export function savePayment(payment: any, year?: string): boolean {
  try {
    const payments = getYearSpecificStorageItem('payments', [], year);
    payment.id = payment.id || uuidv4();
    payments.push(payment);
    saveYearSpecificStorageItem('payments', payments, year);
    return true;
  } catch (error) {
    console.error("Error saving payment:", error);
    return false;
  }
}

export function updatePayment(payment: any, year?: string): boolean {
  try {
    const payments = getYearSpecificStorageItem('payments', [], year);
    const index = payments.findIndex((p: any) => p.id === payment.id);
    if (index >= 0) {
      payments[index] = payment;
      saveYearSpecificStorageItem('payments', payments, year);
      return true;
    } else {
      console.warn("Payment not found for update:", payment.id);
      return false;
    }
  } catch (error) {
    console.error("Error updating payment:", error);
    return false;
  }
}

export function deletePayment(paymentId: string, year?: string): boolean {
  try {
    const payments = getYearSpecificStorageItem('payments', [], year);
    const updatedPayments = payments.map((payment: any) => {
      if (payment.id === paymentId) {
        payment.isDeleted = true;
      }
      return payment;
    });
    saveYearSpecificStorageItem('payments', updatedPayments, year);
    return true;
  } catch (error) {
    console.error("Error deleting payment:", error);
    return false;
  }
}
