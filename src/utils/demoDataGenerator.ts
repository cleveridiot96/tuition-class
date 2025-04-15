import { v4 as uuidv4 } from 'uuid';
import { format, subDays, addDays, subMonths } from 'date-fns';
import { 
  generateTraderName, 
  generateBrokerName,
  generateIndianLotNumber,
  generateVakkalNumber,
  generateApproximateWeight,
  getRandomItem,
  titleCase
} from './helpers';

import { 
  getStorageItem, 
  saveStorageItem, 
  getYearSpecificStorageItem, 
  saveYearSpecificStorageItem,
  getFinancialYearKeyPrefix,
  seedInitialData
} from '@/services/storageUtils';

import { getCurrentFinancialYear } from '@/services/financialYearService';
import { Agent, Broker, Customer, Supplier, Transporter } from '@/services/types';

// Sample products for trading
const products = [
  { name: 'Wheat', bagWeight: 50, priceRange: [1800, 2200] },  // ₹18-22 per kg
  { name: 'Rice', bagWeight: 25, priceRange: [2500, 3300] },   // ₹25-33 per kg
  { name: 'Cotton', bagWeight: 170, priceRange: [5500, 6500] }, // ₹55-65 per kg
  { name: 'Soybean', bagWeight: 60, priceRange: [3700, 4200] }, // ₹37-42 per kg
  { name: 'Toor Dal', bagWeight: 45, priceRange: [4500, 5500] }, // ₹45-55 per kg
  { name: 'Chana', bagWeight: 50, priceRange: [4000, 4800] },   // ₹40-48 per kg
  { name: 'Mustard', bagWeight: 40, priceRange: [3200, 4000] },  // ₹32-40 per kg
  { name: 'Groundnut', bagWeight: 35, priceRange: [5000, 6000] }, // ₹50-60 per kg
];

// Typical locations in an agricultural trading business
const locations = [
  'Warehouse A', 'Cold Storage B', 'Market Yard', 'Processing Unit', 'Main Store', 
  'Godown 1', 'Godown 2', 'Shop Floor'
];

// Common expenses in agri trading
const expenseTypes = [
  'Loading', 'Unloading', 'Weighing', 'Cleaning', 'Sorting', 'Packaging',
  'Labor', 'Storage', 'Electricity', 'Mandi Tax', 'Transport', 
  'Brokerage', 'Commission', 'Fumigation', 'Inspection'
];

// Create parties for the demo
function generateParties() {
  // Generate supplier/agent data
  const suppliers = Array(15).fill(0).map((_, i) => ({
    id: `supplier-${uuidv4()}`,
    name: generateTraderName(),
    contactNumber: `98${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    address: `${getRandomItem(['Village', 'Town', 'Market'])} ${getRandomItem(['Nagpur', 'Amravati', 'Pune', 'Nashik', 'Akola', 'Solapur'])}, ${getRandomItem(['Maharashtra', 'Gujarat', 'MP'])}`,
    gstNumber: Math.random() > 0.4 ? `27${Math.random().toString().substring(2, 14)}` : undefined,
    notes: `${Math.random() > 0.7 ? 'Regular supplier. ' : ''}${Math.random() > 0.8 ? 'Credit: 30 days. ' : ''}`,
    createdAt: new Date().toISOString(),
    isDeleted: false
  }));
  
  // Generate agents data (similar to suppliers)
  const agents = Array(8).fill(0).map((_, i) => ({
    id: `agent-${uuidv4()}`,
    name: generateTraderName().replace('Traders', 'Agency').replace('Merchants', 'Associates'),
    contactNumber: `94${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    address: `${getRandomItem(['Village', 'Town', 'Market'])} ${getRandomItem(['Jalgaon', 'Kolhapur', 'Sangli', 'Buldhana', 'Jalna', 'Washim'])}`,
    commissionRate: Math.floor(Math.random() * 5 + 1), // 1-5% commission
    notes: `Commission agent.`,
    createdAt: new Date().toISOString(),
    isDeleted: false
  }));
  
  // Generate broker data
  const brokers = Array(10).fill(0).map((_, i) => ({
    id: `broker-${uuidv4()}`,
    name: generateBrokerName(),
    contactNumber: `96${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    address: `Market Yard, ${getRandomItem(['Nagpur', 'Amravati', 'Pune', 'Nashik', 'Akola', 'Mumbai'])}`,
    commissionRate: parseFloat((Math.random() * 2 + 0.5).toFixed(2)), // 0.5-2.5% commission
    notes: Math.random() > 0.7 ? `Active in ${getRandomItem(['cotton', 'wheat', 'rice', 'soybean', 'pulses'])} trade.` : '',
    createdAt: new Date().toISOString(),
    isDeleted: false
  }));

  // Generate customer data
  const customers = Array(12).fill(0).map((_, i) => ({
    id: `customer-${uuidv4()}`,
    name: generateTraderName(),
    contactNumber: `99${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    address: `${getRandomItem(['Shop No.', 'Plot No.', 'Store'])} ${Math.floor(Math.random() * 100 + 1)}, ${getRandomItem(['Market Road', 'Main Street', 'Trading Hub'])}, ${getRandomItem(['Mumbai', 'Pune', 'Nagpur', 'Delhi', 'Indore', 'Ahmedabad'])}`,
    gstNumber: Math.random() > 0.6 ? `27${Math.random().toString().substring(2, 14)}` : undefined,
    creditLimit: Math.random() > 0.5 ? Math.floor(Math.random() * 1000000 + 100000) : undefined,
    payableByCustomer: Math.random() > 0.5,
    notes: Math.random() > 0.7 ? `${Math.random() > 0.5 ? 'Regular' : 'Occasional'} customer.` : '',
    createdAt: new Date().toISOString(),
    isDeleted: false
  }));

  // Generate transporter data
  const transporters = Array(5).fill(0).map((_, i) => ({
    id: `transporter-${uuidv4()}`,
    name: `${getRandomItem(['Shree', 'Jay', 'Om', 'Jai', 'Sai'])} ${getRandomItem(['Kisan', 'Durga', 'Ganesh', 'Mahalaxmi', 'Bajrang'])} Transport`,
    contactNumber: `97${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    address: `Transport Nagar, ${getRandomItem(['Nagpur', 'Mumbai', 'Pune', 'Delhi', 'Indore'])}`,
    gstNumber: Math.random() > 0.4 ? `27${Math.random().toString().substring(2, 14)}` : undefined,
    notes: '',
    createdAt: new Date().toISOString(),
    isDeleted: false
  }));
  
  // Save the generated data
  saveStorageItem('suppliers', suppliers);
  saveStorageItem('agents', agents);
  saveStorageItem('brokers', brokers);
  saveStorageItem('customers', customers);
  saveStorageItem('transporters', transporters);
  saveStorageItem('locations', locations);
  
  return {
    suppliers,
    agents,
    brokers,
    customers,
    transporters,
    locations
  };
}

// Generate a purchase transaction
function generatePurchase(
  parties: {
    suppliers: Supplier[];
    agents: Agent[];
    brokers: Broker[];
    customers: Customer[];
    transporters: Transporter[];
    locations: string[];
  },
  existingIds: Set<string> = new Set(), 
  index: number = 0, 
  financialYear: string = getCurrentFinancialYear()
) {
  const product = getRandomItem(products);
  const bags = Math.floor(Math.random() * 100 + 10); // 10-110 bags
  const targetWeight = bags * product.bagWeight;
  const netWeight = generateApproximateWeight(targetWeight);
  const rate = Math.floor(Math.random() * (product.priceRange[1] - product.priceRange[0]) + product.priceRange[0]) / 100;
  const amount = parseFloat((netWeight * rate).toFixed(2));
  
  // Generate unique lot number
  let lotNumber;
  do {
    lotNumber = generateIndianLotNumber();
  } while (existingIds.has(lotNumber));
  existingIds.add(lotNumber);
  
  // Decide if we'll use a broker
  const useBroker = Math.random() > 0.5;
  const broker = useBroker ? getRandomItem(parties.brokers) : null;
  
  // Decide if we'll use an agent or direct supplier
  const useAgent = Math.random() > 0.3; // 70% chance to use agent
  const agent = useAgent ? getRandomItem(parties.agents) : null;
  const supplier = !useAgent ? getRandomItem(parties.suppliers) : null;
  
  // Always have a transporter
  const transporter = getRandomItem(parties.transporters);
  const transportRate = parseFloat((Math.random() * 0.8 + 0.5).toFixed(2)); // ₹0.5-1.3 per kg
  const transportCost = parseFloat((netWeight * transportRate).toFixed(2));
  
  // Calculate various expenses
  const mandiTax = parseFloat((amount * 0.015).toFixed(2)); // 1.5% mandi tax
  const loadingCharges = parseFloat((bags * 2.5).toFixed(2)); // ₹2.5 per bag for loading
  const unloadingCharges = parseFloat((bags * 2).toFixed(2)); // ₹2 per bag for unloading
  const weighingCharges = parseFloat((bags * 1).toFixed(2)); // ₹1 per bag for weighing
  const cleaningCharges = Math.random() > 0.5 ? parseFloat((bags * 3).toFixed(2)) : 0; // 50% chance of cleaning charges
  
  const totalExpenses = parseFloat((mandiTax + loadingCharges + unloadingCharges + weighingCharges + cleaningCharges).toFixed(2));
  
  const brokerageRate = broker ? broker.commissionRate : 0;
  const brokerageAmount = broker ? parseFloat((amount * brokerageRate / 100).toFixed(2)) : 0;
  
  const totalAmount = parseFloat((amount + totalExpenses + transportCost + brokerageAmount).toFixed(2));
  const ratePerKgAfterExpenses = parseFloat((totalAmount / netWeight).toFixed(2));
  
  // Calculate the date (going backward from today)
  const daysBack = 60 - index * 0.5; // spread purchases over last 60 days
  const purchaseDate = format(subDays(new Date(), daysBack), 'yyyy-MM-dd');
  
  return {
    id: `purchase-${uuidv4()}`,
    date: purchaseDate,
    lotNumber,
    billNumber: Math.random() > 0.7 ? `BILL-${Math.floor(Math.random() * 10000)}` : undefined,
    quantity: bags,
    productName: product.name,
    bagWeight: product.bagWeight,
    agentId: agent ? agent.id : undefined,
    agent: agent ? agent.name : undefined,
    partyId: supplier ? supplier.id : undefined,
    party: supplier ? supplier.name : undefined,
    location: getRandomItem(parties.locations),
    netWeight,
    grossWeight: netWeight + parseFloat((Math.random() * bags * 0.2).toFixed(2)), // Add weight of bags
    bags,
    rate,
    amount,
    transporterId: transporter.id,
    transporter: transporter.name,
    transportRate,
    transportCost,
    vakkalNumber: generateVakkalNumber(),
    expenses: [
      { type: 'Mandi Tax', amount: mandiTax },
      { type: 'Loading', amount: loadingCharges },
      { type: 'Unloading', amount: unloadingCharges },
      { type: 'Weighing', amount: weighingCharges },
      ...(cleaningCharges > 0 ? [{ type: 'Cleaning', amount: cleaningCharges }] : [])
    ],
    totalExpenses,
    brokerId: broker ? broker.id : undefined,
    broker: broker ? broker.name : undefined,
    brokerageRate,
    brokerageAmount,
    brokerageType: "percentage" as "percentage" | "fixed",
    totalAmount,
    ratePerKgAfterExpenses,
    notes: `Purchase of ${product.name} from ${supplier ? supplier.name : agent!.name}`,
    isDeleted: false
  };
}

// Generate a sale transaction
function generateSale(
  parties: {
    suppliers: Supplier[];
    agents: Agent[];
    brokers: Broker[];
    customers: Customer[];
    transporters: Transporter[];
    locations: string[];
  },
  existingIds: Set<string> = new Set(), 
  index: number = 0,
  financialYear: string = getCurrentFinancialYear()
) {
  const product = getRandomItem(products);
  const bags = Math.floor(Math.random() * 50 + 5); // 5-55 bags
  const targetWeight = bags * product.bagWeight;
  const netWeight = generateApproximateWeight(targetWeight);
  
  // Sale rate is higher than purchase rate
  const rate = Math.floor(Math.random() * (product.priceRange[1] + 300 - product.priceRange[0] - 100) + product.priceRange[0] + 100) / 100;
  const amount = parseFloat((netWeight * rate).toFixed(2));
  
  // Generate unique lot/bill number
  let lotNumber, billNumber;
  do {
    lotNumber = generateIndianLotNumber();
    billNumber = `BILL/${format(new Date(), 'yy')}/${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  } while (existingIds.has(lotNumber) || existingIds.has(billNumber));
  existingIds.add(lotNumber);
  existingIds.add(billNumber);
  
  // Decide if we'll use a broker
  const useBroker = Math.random() > 0.6;
  const broker = useBroker ? getRandomItem(parties.brokers) : null;
  
  const customer = getRandomItem(parties.customers);
  
  // Decide if we'll use a transporter
  const useTransport = Math.random() > 0.3; // 70% chance to use transport
  const transporter = useTransport ? getRandomItem(parties.transporters) : null;
  const transportRate = useTransport ? parseFloat((Math.random() * 0.8 + 0.6).toFixed(2)) : 0; // ₹0.6-1.4 per kg
  const transportCost = useTransport ? parseFloat((netWeight * transportRate).toFixed(2)) : 0;
  
  const brokerageRate = broker ? broker.commissionRate : 0;
  const brokerageAmount = broker ? parseFloat((amount * brokerageRate / 100).toFixed(2)) : 0;
  
  const loadingCharges = parseFloat((bags * 2).toFixed(2)); // ₹2 per bag for loading
  const packagingCharges = Math.random() > 0.4 ? parseFloat((bags * 5).toFixed(2)) : 0; // 60% chance of packaging charges
  
  const totalExpenses = parseFloat((loadingCharges + packagingCharges).toFixed(2));
  const totalAmount = parseFloat((amount).toFixed(2)); // Base sale amount
  const netAmount = parseFloat((totalAmount - brokerageAmount - (customer.payableByCustomer ? 0 : totalExpenses)).toFixed(2));
  
  // Calculate the date (going backward from today, but more recent than purchases)
  const daysBack = 40 - index * 0.8; // spread sales over last 40 days
  const saleDate = format(subDays(new Date(), Math.max(2, daysBack)), 'yyyy-MM-dd');
  
  return {
    id: `sale-${uuidv4()}`,
    date: saleDate,
    lotNumber,
    billNumber,
    billAmount: totalAmount,
    billDate: saleDate,
    customerId: customer.id,
    customer: customer.name,
    quantity: bags,
    productName: product.name,
    bagWeight: product.bagWeight,
    netWeight,
    grossWeight: netWeight + parseFloat((Math.random() * bags * 0.2).toFixed(2)), // Add weight of bags
    bags,
    rate,
    amount,
    expenses: [
      { type: 'Loading', amount: loadingCharges },
      ...(packagingCharges > 0 ? [{ type: 'Packaging', amount: packagingCharges }] : [])
    ],
    totalExpenses,
    brokerId: broker ? broker.id : undefined,
    broker: broker ? broker.name : undefined,
    brokerageRate,
    brokerageAmount,
    brokerageType: "percentage" as "percentage" | "fixed",
    transporterId: transporter ? transporter.id : undefined,
    transporter: transporter ? transporter.name : undefined,
    transportRate,
    transportCost,
    vakkalNumber: useTransport ? generateVakkalNumber() : undefined,
    location: getRandomItem(parties.locations),
    notes: `Sale of ${product.name} to ${customer.name}`,
    totalAmount,
    netAmount,
    isDeleted: false
  };
}

// Generate a payment
function generatePayment(
  parties: {
    suppliers: Supplier[];
    agents: Agent[];
    brokers: Broker[];
    customers: Customer[];
    transporters: Transporter[];
    locations: string[];
  },
  purchases: any[] = [], 
  index: number = 0,
  financialYear: string = getCurrentFinancialYear()
) {
  const paymentModes = ['cash', 'cheque', 'bank', 'upi'];
  const paymentMode = getRandomItem(paymentModes);
  
  const paymentDate = format(subDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd');
  
  // Decide payment type: to agent, supplier, broker or transporter
  const partyTypes = ['agent', 'supplier', 'broker', 'transporter'];
  const partyTypeWeights = [0.3, 0.3, 0.2, 0.2]; // Higher probability for agents and suppliers
  
  // Weighted selection
  const rand = Math.random();
  let cumulativeWeight = 0;
  let partyType = '';
  
  for (let i = 0; i < partyTypes.length; i++) {
    cumulativeWeight += partyTypeWeights[i];
    if (rand < cumulativeWeight) {
      partyType = partyTypes[i];
      break;
    }
  }
  
  // Get party based on type
  let party;
  switch(partyType) {
    case 'agent':
      party = getRandomItem(parties.agents);
      break;
    case 'supplier':
      party = getRandomItem(parties.suppliers);
      break;
    case 'broker':
      party = getRandomItem(parties.brokers);
      break;
    case 'transporter':
      party = getRandomItem(parties.transporters);
      break;
    default:
      party = getRandomItem(parties.suppliers);
  }
  
  // Decide if payment is against a specific purchase or general
  const isAgainstTransaction = Math.random() > 0.4;
  const isOnAccount = !isAgainstTransaction && Math.random() > 0.5;
  
  let relatedPurchase = null;
  let amount = 0;
  
  if (isAgainstTransaction && purchases.length > 0) {
    // Filter purchases related to this party
    const partyPurchases = purchases.filter(p => {
      if (partyType === 'agent') return p.agentId === party.id;
      if (partyType === 'supplier') return p.partyId === party.id;
      if (partyType === 'broker') return p.brokerId === party.id;
      if (partyType === 'transporter') return p.transporterId === party.id;
      return false;
    });
    
    if (partyPurchases.length > 0) {
      relatedPurchase = getRandomItem(partyPurchases);
      
      // Determine amount based on party type
      if (partyType === 'agent' || partyType === 'supplier') {
        amount = Math.random() > 0.7 ? 
          relatedPurchase.totalAmount : // Full payment
          parseFloat((relatedPurchase.totalAmount * (0.4 + Math.random() * 0.5)).toFixed(2)); // Partial payment
      } else if (partyType === 'broker') {
        amount = relatedPurchase.brokerageAmount;
      } else if (partyType === 'transporter') {
        amount = relatedPurchase.transportCost;
      }
    }
  }
  
  // If no related purchase or not against transaction, generate a random amount
  if (amount === 0) {
    if (partyType === 'agent' || partyType === 'supplier') {
      amount = parseFloat((Math.random() * 50000 + 10000).toFixed(2));
    } else if (partyType === 'broker') {
      amount = parseFloat((Math.random() * 5000 + 1000).toFixed(2));
    } else if (partyType === 'transporter') {
      amount = parseFloat((Math.random() * 8000 + 2000).toFixed(2));
    }
  }

  return {
    id: `payment-${uuidv4()}`,
    date: paymentDate,
    party: party.name,
    partyId: party.id,
    partyName: party.name,
    partyType,
    amount,
    paymentMethod: paymentMode,
    paymentMode,
    reference: `PAY/${Math.floor(Math.random() * 10000)}`,
    notes: `Payment to ${party.name} for ${relatedPurchase ? `purchase lot ${relatedPurchase.lotNumber}` : 'various services'}`,
    billNumber: relatedPurchase?.billNumber || undefined,
    billAmount: relatedPurchase?.totalAmount || undefined,
    referenceNumber: relatedPurchase ? `TXN-${relatedPurchase.lotNumber}` : undefined,
    isDeleted: false,
    isOnAccount,
    isAgainstTransaction,
    transactionDetails: relatedPurchase ? {
      type: 'purchase',
      id: relatedPurchase.id,
      number: relatedPurchase.lotNumber
    } : undefined
  };
}

// Generate a receipt
function generateReceipt(
  parties: {
    suppliers: Supplier[];
    agents: Agent[];
    brokers: Broker[];
    customers: Customer[];
    transporters: Transporter[];
    locations: string[];
  }, 
  sales: any[] = [], 
  index: number = 0,
  financialYear: string = getCurrentFinancialYear()
) {
  const paymentModes = ['cash', 'cheque', 'bank', 'upi'];
  const paymentMode = getRandomItem(paymentModes);
  
  const receiptDate = format(subDays(new Date(), Math.floor(Math.random() * 20)), 'yyyy-MM-dd');
  
  const customer = getRandomItem(parties.customers);
  
  // Decide if receipt is against a specific sale or general
  const isAgainstTransaction = Math.random() > 0.4;
  let relatedSale = null;
  let amount = 0;
  
  if (isAgainstTransaction && sales.length > 0) {
    // Filter sales related to this customer
    const customerSales = sales.filter(s => s.customerId === customer.id);
    
    if (customerSales.length > 0) {
      relatedSale = getRandomItem(customerSales);
      amount = Math.random() > 0.7 ? 
        relatedSale.totalAmount : // Full payment
        parseFloat((relatedSale.totalAmount * (0.4 + Math.random() * 0.5)).toFixed(2)); // Partial payment
    }
  }
  
  // If no related sale or not against transaction, generate a random amount
  if (amount === 0) {
    amount = parseFloat((Math.random() * 70000 + 15000).toFixed(2));
  }

  return {
    id: `receipt-${uuidv4()}`,
    date: receiptDate,
    customer: customer.name,
    customerId: customer.id,
    customerName: customer.name,
    amount,
    paymentMethod: paymentMode,
    paymentMode,
    reference: `RCT/${Math.floor(Math.random() * 10000)}`,
    notes: `Receipt from ${customer.name} for ${relatedSale ? `sale bill ${relatedSale.billNumber}` : 'various transactions'}`,
    billNumber: relatedSale?.billNumber || undefined,
    billAmount: relatedSale?.totalAmount || undefined,
    isDeleted: false,
    isOnAccount: !isAgainstTransaction,
    isAgainstTransaction,
    transactionDetails: relatedSale ? {
      type: 'sale',
      id: relatedSale.id,
      number: relatedSale.billNumber
    } : undefined
  };
}

// Generate sample data set
export const generateSampleData = async () => {
  try {
    console.log('Starting sample data generation...');
    
    // Ensure essential data structures exist
    seedInitialData();
    
    // First, generate all parties
    const parties = generateParties();
    console.log('Generated parties:', {
      suppliers: parties.suppliers.length,
      agents: parties.agents.length,
      brokers: parties.brokers.length,
      customers: parties.customers.length,
      transporters: parties.transporters.length
    });
    
    const financialYear = getCurrentFinancialYear();
    const yearPrefix = getFinancialYearKeyPrefix(financialYear);
    const existingIds = new Set<string>();
    
    const purchases = [];
    const sales = [];
    const payments = [];
    const receipts = [];
    
    // Generate 120 purchases
    for (let i = 0; i < 120; i++) {
      purchases.push(generatePurchase(parties, existingIds, i, financialYear));
    }
    
    // Generate 80 sales
    for (let i = 0; i < 80; i++) {
      sales.push(generateSale(parties, existingIds, i, financialYear));
    }
    
    // Generate 60 payments
    for (let i = 0; i < 60; i++) {
      payments.push(generatePayment(parties, purchases, i, financialYear));
    }
    
    // Generate 40 receipts
    for (let i = 0; i < 40; i++) {
      receipts.push(generateReceipt(parties, sales, i, financialYear));
    }
    
    // Save all transactions
    console.log('Saving transactions to storage...');
    
    // Save in batches to prevent browser freeze
    let count = 0;
    
    // Save purchases
    saveYearSpecificStorageItem('purchases', purchases, financialYear, true);
    
    // Save sales
    saveYearSpecificStorageItem('sales', sales, financialYear, true);
    
    // Save payments
    saveYearSpecificStorageItem('payments', payments, financialYear, true);
    
    // Save receipts
    saveYearSpecificStorageItem('receipts', receipts, financialYear, true);
    
    // Create an inventory based on purchases and sales
    const inventory = calculateInventoryFromTransactions(purchases, sales);
    saveYearSpecificStorageItem('inventory', inventory, financialYear, true);
    
    console.log('Sample data generation complete!');
    
    // Create CSV export
    const createCSVData = () => {
      // Create CSV header row
      const headers = [
        'Type', 'ID', 'Date', 'Party/Customer', 'Description', 'Amount', 'Payment Method',
        'Location', 'Quantity', 'Weight', 'Rate', 'Total'
      ].join(',');
      
      // Format purchases
      const purchaseRows = purchases.map(p => [
        'Purchase', p.id, p.date, p.party || p.agent, `Lot ${p.lotNumber}`, p.amount.toFixed(2),
        'N/A', p.location, p.bags, p.netWeight.toFixed(2), p.rate.toFixed(2), 
        p.totalAmount.toFixed(2)
      ].join(','));
      
      // Format sales
      const salesRows = sales.map(s => [
        'Sale', s.id, s.date, s.customer, s.billNumber || s.lotNumber, s.amount.toFixed(2),
        'N/A', s.location || 'N/A', s.bags, s.netWeight.toFixed(2), s.rate.toFixed(2),
        s.totalAmount.toFixed(2)
      ].join(','));
      
      // Format payments
      const paymentRows = payments.map(p => [
        'Payment', p.id, p.date, p.partyName, p.notes || 'Payment', p.amount.toFixed(2),
        p.paymentMode, 'N/A', 'N/A', 'N/A', 'N/A', p.amount.toFixed(2)
      ].join(','));
      
      // Format receipts
      const receiptRows = receipts.map(r => [
        'Receipt', r.id, r.date, r.customerName, r.notes || 'Receipt', r.amount.toFixed(2),
        r.paymentMode, 'N/A', 'N/A', 'N/A', 'N/A', r.amount.toFixed(2)
      ].join(','));
      
      return [headers, ...purchaseRows, ...salesRows, ...paymentRows, ...receiptRows].join('\n');
    };
    
    const csvData = createCSVData();
    
    // Return summary
    return {
      purchaseCount: purchases.length,
      saleCount: sales.length,
      paymentCount: receipts.length,
      receiptCount: receipts.length,
      totalCount: purchases.length + sales.length + payments.length + receipts.length,
      csvData: csvData
    };
  } catch (error) {
    console.error('Error generating sample data:', error);
    throw error;
  }
}

// Helper function to calculate inventory from transactions
function calculateInventoryFromTransactions(purchases: any[], sales: any[]) {
  const inventoryMap = new Map(); // key format: "product|location"
  
  // Process purchases first (adding to inventory)
  purchases.forEach(purchase => {
    const key = `${purchase.productName}|${purchase.location}`;
    const existing = inventoryMap.get(key) || {
      id: `inv-${uuidv4()}`,
      productName: purchase.productName,
      location: purchase.location,
      quantity: 0,
      bags: 0,
      netWeight: 0,
      avgRate: 0,
      totalValue: 0,
      lastUpdated: '',
    };
    
    // Calculate new weighted average rate
    const newTotalValue = existing.totalValue + purchase.amount;
    const newNetWeight = existing.netWeight + purchase.netWeight;
    const newAvgRate = newNetWeight > 0 ? (newTotalValue / newNetWeight) : 0;
    
    inventoryMap.set(key, {
      ...existing,
      quantity: existing.quantity + purchase.quantity,
      bags: existing.bags + purchase.bags,
      netWeight: newNetWeight,
      avgRate: parseFloat(newAvgRate.toFixed(2)),
      totalValue: parseFloat(newTotalValue.toFixed(2)),
      lastUpdated: purchase.date
    });
  });
  
  // Process sales (reducing inventory)
  sales.forEach(sale => {
    const key = `${sale.productName}|${sale.location}`;
    
    if (!inventoryMap.has(key)) {
      console.warn(`Trying to sell from non-existent inventory: ${key}`);
      return;
    }
    
    const existing = inventoryMap.get(key);
    
    // Make sure we don't go negative
    const newQuantity = Math.max(0, existing.quantity - sale.quantity);
    const newBags = Math.max(0, existing.bags - sale.bags);
    const newNetWeight = Math.max(0, existing.netWeight - sale.netWeight);
    
    // Keep the same average rate
    const newTotalValue = parseFloat((newNetWeight * existing.avgRate).toFixed(2));
    
    inventoryMap.set(key, {
      ...existing,
      quantity: newQuantity,
      bags: newBags,
      netWeight: newNetWeight,
      totalValue: newTotalValue,
      lastUpdated: sale.date
    });
    
    // Remove empty inventory items
    if (newNetWeight <= 0) {
      inventoryMap.delete(key);
    }
  });
  
  // Convert map to array
  return Array.from(inventoryMap.values());
}

// Download the generated data as CSV
export const downloadSampleDataAsCsv = (csvData: string) => {
  try {
    // Create CSV blob and save
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary link and click it
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'kisan_khata_sample_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error downloading CSV:', error);
    return false;
  }
};
