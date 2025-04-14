
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
} from "@/services/storageService";

/**
 * Calculate balances for all account types
 */
export function calculateAllBalances() {
  const purchases = getPurchases();
  const sales = getSales();
  const payments = getPayments();
  const receipts = getReceipts();
  
  const agents = getAgents();
  const suppliers = getSuppliers();
  const brokers = getBrokers();
  const customers = getCustomers();
  const transporters = getTransporters();
  
  // Calculate agent balances
  const agentBalances = agents.map(agent => {
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
  
  // Calculate supplier balances
  const supplierBalances = suppliers.map(supplier => {
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
  
  // Calculate customer balances
  const customerBalances = customers.map(customer => {
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
  
  // Calculate broker balances
  const brokerBalances = brokers.map(broker => {
    const relatedSales = sales.filter(s => s.brokerId === broker.id && !s.isDeleted);
    const relatedPayments = payments.filter(p => p.partyId === broker.id && !p.isDeleted);
    
    const totalCommissions = relatedSales.reduce((sum, s) => {
      return sum + (s.brokerageAmount || (s.totalAmount * broker.commissionRate / 100));
    }, 0);
    const totalPayments = relatedPayments.reduce((sum, p) => sum + p.amount, 0);
    const balance = totalCommissions - totalPayments;
    
    return {
      id: broker.id,
      name: broker.name,
      type: 'broker',
      balance,
      balanceType: balance >= 0 ? 'debit' : 'credit'
    };
  });
  
  // Calculate transporter balances
  const transporterBalances = transporters.map(transporter => {
    const relatedPurchases = purchases.filter(p => p.transporterId === transporter.id && !p.isDeleted);
    const relatedSales = sales.filter(s => s.transporterId === transporter.id && !s.isDeleted);
    const relatedPayments = payments.filter(p => p.partyId === transporter.id && !p.isDeleted);
    
    const totalPurchaseTransport = relatedPurchases.reduce((sum, p) => sum + (p.transportCost || 0), 0);
    const totalSaleTransport = relatedSales.reduce((sum, s) => sum + (s.transportCost || 0), 0);
    const totalTransport = totalPurchaseTransport + totalSaleTransport;
    const totalPayments = relatedPayments.reduce((sum, p) => sum + p.amount, 0);
    const balance = totalTransport - totalPayments;
    
    return {
      id: transporter.id,
      name: transporter.name,
      type: 'transporter',
      balance,
      balanceType: balance >= 0 ? 'debit' : 'credit'
    };
  });
  
  // Return all balances
  return {
    agents: agentBalances,
    suppliers: supplierBalances,
    customers: customerBalances,
    brokers: brokerBalances,
    transporters: transporterBalances,
    // Combined balance arrays
    all: [
      ...agentBalances,
      ...supplierBalances,
      ...customerBalances,
      ...brokerBalances,
      ...transporterBalances
    ]
  };
}

/**
 * Get cash book summary
 */
export function getCashBookSummary() {
  const payments = getPayments();
  const receipts = getReceipts();
  
  // Calculate total payments
  const totalPayments = payments
    .filter(p => !p.isDeleted && p.paymentMode === 'cash')
    .reduce((sum, p) => sum + p.amount, 0);
  
  // Calculate total receipts
  const totalReceipts = receipts
    .filter(r => !r.isDeleted && r.paymentMode === 'cash')
    .reduce((sum, r) => sum + r.amount, 0);
  
  // Calculate balance
  const balance = totalReceipts - totalPayments;
  
  return {
    totalPayments,
    totalReceipts,
    balance,
    balanceType: balance >= 0 ? 'credit' : 'debit'
  };
}

/**
 * Get dashboard summary
 */
export function getDashboardSummary() {
  const purchases = getPurchases();
  const sales = getSales();
  const payments = getPayments();
  const receipts = getReceipts();
  
  // Calculate total purchases
  const totalPurchases = purchases
    .filter(p => !p.isDeleted)
    .reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  
  // Calculate total sales
  const totalSales = sales
    .filter(s => !s.isDeleted)
    .reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  
  // Calculate total payments
  const totalPayments = payments
    .filter(p => !p.isDeleted)
    .reduce((sum, p) => sum + p.amount, 0);
  
  // Calculate total receipts
  const totalReceipts = receipts
    .filter(r => !r.isDeleted)
    .reduce((sum, r) => sum + r.amount, 0);
  
  // Calculate gross profit
  const grossProfit = totalSales - totalPurchases;
  
  // Calculate cash balance
  const cashBalance = totalReceipts - totalPayments;
  
  return {
    totalPurchases,
    totalSales,
    totalPayments,
    totalReceipts,
    grossProfit,
    cashBalance,
    transactionCounts: {
      purchases: purchases.filter(p => !p.isDeleted).length,
      sales: sales.filter(s => !s.isDeleted).length,
      payments: payments.filter(p => !p.isDeleted).length,
      receipts: receipts.filter(r => !r.isDeleted).length
    }
  };
}
