
import { 
  getPurchases, 
  getSales, 
  getPayments, 
  getReceipts,
  getAgents,
  getSuppliers,
  getBrokers,
  getCustomers,
  getTransporters 
} from '@/services/storageService';

export function calculateAgentBalances() {
  const agents = getAgents();
  const purchases = getPurchases();
  const payments = getPayments();

  return agents.map(agent => {
    const relatedPurchases = purchases.filter(p => p.agentId === agent.id && !p.isDeleted);
    const relatedPayments = payments.filter(p => p.partyId === agent.id && !p.isDeleted);
    
    const totalPurchases = relatedPurchases.reduce((sum, p) => sum + (p.totalAfterExpenses || p.totalAmount), 0);
    const totalPayments = relatedPayments.reduce((sum, p) => sum + p.amount, 0);
    const balance = totalPurchases - totalPayments;
    
    return {
      id: agent.id,
      name: agent.name,
      type: 'agent',
      balance,
      balanceType: balance >= 0 ? 'debit' : 'credit'
    };
  });
}

export function calculateSupplierBalances() {
  const suppliers = getSuppliers();
  const purchases = getPurchases();
  const payments = getPayments();

  return suppliers.map(supplier => {
    const relatedPurchases = purchases.filter(p => p.partyId === supplier.id && !p.isDeleted);
    const relatedPayments = payments.filter(p => p.partyId === supplier.id && !p.isDeleted);
    
    const totalPurchases = relatedPurchases.reduce((sum, p) => sum + (p.totalAfterExpenses || p.totalAmount), 0);
    const totalPayments = relatedPayments.reduce((sum, p) => sum + p.amount, 0);
    const balance = totalPurchases - totalPayments;
    
    return {
      id: supplier.id,
      name: supplier.name,
      type: 'supplier',
      balance,
      balanceType: balance >= 0 ? 'debit' : 'credit'
    };
  });
}

export function calculateCustomerBalances() {
  const customers = getCustomers();
  const sales = getSales();
  const receipts = getReceipts();

  return customers.map(customer => {
    const relatedSales = sales.filter(s => s.customerId === customer.id && !s.isDeleted);
    const relatedReceipts = receipts.filter(r => r.customerId === customer.id && !r.isDeleted);
    
    const totalSales = relatedSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalReceipts = relatedReceipts.reduce((sum, r) => sum + r.amount, 0);
    const balance = totalSales - totalReceipts;
    
    return {
      id: customer.id,
      name: customer.name,
      type: 'customer',
      balance,
      balanceType: balance >= 0 ? 'debit' : 'credit'
    };
  });
}
