
// Sales functions
export const getSales = () => {
  const sales = localStorage.getItem('sales');
  return sales ? JSON.parse(sales) : [];
};

export const saveSales = (sales: any[]) => {
  localStorage.setItem('sales', JSON.stringify(sales));
};
