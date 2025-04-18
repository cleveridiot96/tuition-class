
export const extractBagsFromBillNumber = (billNumber: string): number | null => {
  try {
    const match = billNumber.match(/\/(\d+)$/);
    if (match && match[1]) {
      const bags = parseInt(match[1], 10);
      return isNaN(bags) ? null : bags;
    }
    return null;
  } catch (error) {
    console.error('Error parsing bill number:', error);
    return null;
  }
};
