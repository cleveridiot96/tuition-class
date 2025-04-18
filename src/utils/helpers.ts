import { format } from 'date-fns';

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Invalid Date';
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const getFinancialYearString = (): string => {
  const today = new Date();
  let yearStart, yearEnd;

  if (today.getMonth() >= 3) { // April is month 3 (zero-based index)
    yearStart = today.getFullYear();
    yearEnd = today.getFullYear() + 1;
  } else {
    yearStart = today.getFullYear() - 1;
    yearEnd = today.getFullYear();
  }

  return `${yearStart}-${yearEnd.toString().slice(-2)}`;
};

export const getPurchaseIdFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
};

export const getSaleIdFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
};
