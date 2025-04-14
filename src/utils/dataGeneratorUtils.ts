
import { v4 as uuidv4 } from 'uuid';
import { format, subDays, addDays } from 'date-fns';
import { 
  addPurchase, 
  addSale, 
  addPayment, 
  addReceipt 
} from '@/services/storageService';

// Sample data arrays
const parties = [
  { name: 'Rajesh Kumar', address: 'Village Kanpur, District Lucknow' },
  { name: 'Sunil Patel', address: 'Village Bhopal, District Indore' },
  { name: 'Amit Singh', address: 'Village Jaipur, District Alwar' },
  { name: 'Vikram Verma', address: 'Village Patna, District Gaya' },
  { name: 'Sanjay Sharma', address: 'Village Delhi, District Gurugram' }
];

const brokers = [
  { name: 'Dinesh Broker', address: 'Market Yard, Nagpur', commissionRate: 2.5 },
  { name: 'Mahesh Agency', address: 'APMC Market, Mumbai', commissionRate: 2 },
  { name: 'Singh Brothers', address: 'Main Market, Punjab', commissionRate: 1.5 }
];

const transporters = [
  { name: 'Tata Transport', address: 'Highway Road, Delhi' },
  { name: 'Singh Logistics', address: 'Transport Nagar, Jaipur' },
  { name: 'Fast Movers', address: 'Truck Terminal, Chennai' }
];

const customers = [
  { name: 'Reliance Fresh', address: 'Commercial Area, Mumbai' },
  { name: 'Big Bazaar', address: 'Mall Road, Delhi' },
  { name: 'Metro Cash & Carry', address: 'Industrial Area, Bangalore' },
  { name: 'Local Kirana Store', address: 'Main Market, Pune' }
];

const locations = [
  'Warehouse A', 'Cold Storage B', 'Market Yard', 'Factory Unit', 'Village Store'
];

const products = [
  { name: 'Wheat', avgWeight: 50, priceRange: [1800, 2200] },
  { name: 'Rice', avgWeight: 25, priceRange: [2500, 3000] },
  { name: 'Cotton', avgWeight: 170, priceRange: [5500, 6500] },
  { name: 'Soybean', avgWeight: 60, priceRange: [3700, 4200] },
  { name: 'Pulses', avgWeight: 45, priceRange: [4500, 5500] }
];

// Helper functions
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDate = (startDate: Date, endDate: Date): string => {
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  return format(new Date(randomTime), 'yyyy-MM-dd');
};

// Generate a purchase transaction
const generatePurchase = (existingIds: Set<string> = new Set()) => {
  const product = getRandomItem(products);
  const quantity = getRandomNumber(10, 100);
  const netWeight = quantity * product.avgWeight;
  const rate = getRandomNumber(product.priceRange[0], product.priceRange[1]) / 100;
  const totalAmount = netWeight * rate;
  
  // Generate unique lot number
  let lotNumber;
  do {
    lotNumber = `LOT-${getRandomNumber(1000, 9999)}`;
  } while (existingIds.has(lotNumber));
  existingIds.add(lotNumber);
  
  const useBroker = Math.random() > 0.5;
  const broker = useBroker ? getRandomItem(brokers) : null;
  const brokerId = broker ? `broker-${Date.now()}-${getRandomNumber(1, 1000)}` : undefined;
  const brokerageRate = broker ? broker.commissionRate : 0;
  const brokerageAmount = broker ? (totalAmount * brokerageRate / 100) : 0;
  
  const transporterId = `transporter-${Date.now()}-${getRandomNumber(1, 1000)}`;
  const transportRate = getRandomNumber(10, 50) / 100;
  const transportCost = netWeight * transportRate;
  
  const expenses = getRandomNumber(500, 2000);
  const totalAfterExpenses = totalAmount + transportCost + expenses;
  const ratePerKgAfterExpenses = totalAfterExpenses / netWeight;
  
  return {
    id: `purchase-${Date.now()}-${getRandomNumber(1, 1000)}`,
    date: getRandomDate(subDays(new Date(), 90), subDays(new Date(), 2)),
    lotNumber,
    quantity,
    agentId: `agent-${Date.now()}-${getRandomNumber(1, 1000)}`,
    agent: getRandomItem(parties).name,
    party: getRandomItem(parties).name,
    partyId: `party-${Date.now()}-${getRandomNumber(1, 1000)}`,
    location: getRandomItem(locations),
    netWeight,
    rate,
    transporter: getRandomItem(transporters).name,
    transporterId,
    transportRate,
    transportCost,
    totalAmount,
    expenses,
    broker: broker?.name,
    brokerId,
    brokerageRate,
    brokerageAmount,
    brokerageType: "percentage" as "percentage" | "fixed",
    totalAfterExpenses,
    ratePerKgAfterExpenses,
    notes: `Purchase of ${product.name}`,
    isDeleted: false
  };
};

// Generate a sale transaction
const generateSale = (existingIds: Set<string> = new Set()) => {
  const product = getRandomItem(products);
  const quantity = getRandomNumber(5, 50);
  const netWeight = quantity * product.avgWeight;
  const rate = getRandomNumber(product.priceRange[0] + 300, product.priceRange[1] + 700) / 100;
  const amount = netWeight * rate;
  
  // Generate unique lot/bill number
  let lotNumber, billNumber;
  do {
    lotNumber = `LOT-${getRandomNumber(1000, 9999)}`;
    billNumber = `BILL-${getRandomNumber(10000, 99999)}`;
  } while (existingIds.has(lotNumber) || existingIds.has(billNumber));
  existingIds.add(lotNumber);
  existingIds.add(billNumber);
  
  const useBroker = Math.random() > 0.6;
  const broker = useBroker ? getRandomItem(brokers) : null;
  const brokerId = broker ? `broker-${Date.now()}-${getRandomNumber(1, 1000)}` : undefined;
  const brokerageRate = broker ? broker.commissionRate : 0;
  const brokerageAmount = broker ? (amount * brokerageRate / 100) : 0;
  
  const useTransport = Math.random() > 0.3;
  const transporterId = useTransport ? `transporter-${Date.now()}-${getRandomNumber(1, 1000)}` : undefined;
  const transportRate = useTransport ? getRandomNumber(10, 50) / 100 : 0;
  const transportCost = useTransport ? netWeight * transportRate : 0;
  
  const totalAmount = amount;
  const netAmount = totalAmount - brokerageAmount;
  
  return {
    id: `sale-${Date.now()}-${getRandomNumber(1, 1000)}`,
    date: getRandomDate(subDays(new Date(), 60), new Date()),
    lotNumber,
    billNumber: Math.random() > 0.7 ? billNumber : undefined,
    billAmount: Math.random() > 0.7 ? totalAmount : undefined,
    customer: getRandomItem(customers).name,
    customerId: `customer-${Date.now()}-${getRandomNumber(1, 1000)}`,
    quantity,
    netWeight,
    rate,
    broker: broker?.name,
    brokerId,
    brokerageRate,
    brokerageAmount,
    brokerageType: "percentage" as "percentage" | "fixed",
    transporter: useTransport ? getRandomItem(transporters).name : undefined,
    transporterId,
    transportRate,
    transportCost,
    location: getRandomItem(locations),
    notes: `Sale of ${product.name}`,
    totalAmount,
    netAmount,
    amount,
    isDeleted: false
  };
};

// Generate a payment
const generatePayment = () => {
  const amount = getRandomNumber(5000, 50000);
  const partyTypes = ['agent', 'supplier', 'broker', 'transporter'];
  const partyType = getRandomItem(partyTypes);
  
  let party;
  switch(partyType) {
    case 'broker': party = getRandomItem(brokers); break;
    case 'transporter': party = getRandomItem(transporters); break;
    default: party = getRandomItem(parties);
  }
  
  const paymentModes = ['cash', 'cheque', 'bank', 'upi'];
  const paymentMode = getRandomItem(paymentModes);
  
  const isAgainstTransaction = Math.random() > 0.6;
  const isOnAccount = !isAgainstTransaction && Math.random() > 0.5;
  
  return {
    id: `payment-${Date.now()}-${getRandomNumber(1, 1000)}`,
    date: getRandomDate(subDays(new Date(), 45), new Date()),
    party: party.name,
    partyId: `${partyType}-${Date.now()}-${getRandomNumber(1, 1000)}`,
    partyName: party.name,
    partyType,
    amount,
    paymentMethod: paymentMode,
    paymentMode,
    reference: `REF-${getRandomNumber(100000, 999999)}`,
    notes: `Payment to ${party.name}`,
    billNumber: Math.random() > 0.6 ? `BILL-${getRandomNumber(10000, 99999)}` : undefined,
    billAmount: Math.random() > 0.6 ? getRandomNumber(amount - 5000, amount + 5000) : undefined,
    referenceNumber: Math.random() > 0.7 ? `TXN-${getRandomNumber(10000, 99999)}` : undefined,
    isDeleted: false,
    isOnAccount,
    isAgainstTransaction,
    transactionDetails: isAgainstTransaction ? {
      type: Math.random() > 0.5 ? 'purchase' : 'sale',
      id: `txn-${Date.now()}-${getRandomNumber(1, 1000)}`,
      number: `TXN-${getRandomNumber(1000, 9999)}`
    } : undefined
  };
};

// Generate a receipt
const generateReceipt = () => {
  const amount = getRandomNumber(10000, 100000);
  const customer = getRandomItem(customers);
  
  const paymentModes = ['cash', 'cheque', 'bank', 'upi'];
  const paymentMode = getRandomItem(paymentModes);
  
  return {
    id: `receipt-${Date.now()}-${getRandomNumber(1, 1000)}`,
    date: getRandomDate(subDays(new Date(), 30), new Date()),
    customer: customer.name,
    customerId: `customer-${Date.now()}-${getRandomNumber(1, 1000)}`,
    customerName: customer.name,
    amount,
    paymentMethod: paymentMode,
    paymentMode,
    reference: `REF-${getRandomNumber(100000, 999999)}`,
    notes: `Receipt from ${customer.name}`,
    isDeleted: false
  };
};

// Generate sample data set
export const generateSampleData = async () => {
  try {
    console.log('Starting sample data generation...');
    
    const existingIds = new Set<string>();
    const purchases = [];
    const sales = [];
    const payments = [];
    const receipts = [];
    
    // Generate purchases (80)
    for (let i = 0; i < 80; i++) {
      purchases.push(generatePurchase(existingIds));
    }
    
    // Generate sales (60)
    for (let i = 0; i < 60; i++) {
      sales.push(generateSale(existingIds));
    }
    
    // Generate payments (40)
    for (let i = 0; i < 40; i++) {
      payments.push(generatePayment());
    }
    
    // Generate receipts (20)
    for (let i = 0; i < 20; i++) {
      receipts.push(generateReceipt());
    }
    
    // Add all transactions
    let count = 0;
    for (const purchase of purchases) {
      addPurchase(purchase);
      count++;
      // Add delay every 10 items to prevent browser freeze
      if (count % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    for (const sale of sales) {
      addSale(sale);
      count++;
      if (count % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    for (const payment of payments) {
      addPayment(payment);
      count++;
      if (count % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    for (const receipt of receipts) {
      addReceipt(receipt);
      count++;
      if (count % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Create an Excel-compatible CSV export
    const createCSVData = () => {
      const headers = [
        'Type', 'ID', 'Date', 'Party/Customer', 'Description', 'Amount', 'Payment Method',
        'Location', 'Quantity', 'Weight', 'Rate', 'Total', 'Transaction ID'
      ].join(',');
      
      const rows = [
        ...purchases.map(p => [
          'Purchase', p.id, p.date, p.party, `Lot ${p.lotNumber}`, p.totalAmount.toFixed(2),
          'N/A', p.location, p.quantity, p.netWeight.toFixed(2), p.rate.toFixed(2), 
          p.totalAfterExpenses.toFixed(2), p.lotNumber
        ].join(',')),
        
        ...sales.map(s => [
          'Sale', s.id, s.date, s.customer, `${s.billNumber || s.lotNumber}`, s.totalAmount.toFixed(2),
          'N/A', s.location || 'N/A', s.quantity, s.netWeight.toFixed(2), s.rate.toFixed(2),
          s.netAmount.toFixed(2), s.billNumber || s.lotNumber
        ].join(',')),
        
        ...payments.map(p => [
          'Payment', p.id, p.date, p.partyName, p.notes || 'Payment', p.amount.toFixed(2),
          p.paymentMode, 'N/A', 'N/A', 'N/A', 'N/A', p.amount.toFixed(2), p.reference
        ].join(',')),
        
        ...receipts.map(r => [
          'Receipt', r.id, r.date, r.customerName, r.notes || 'Receipt', r.amount.toFixed(2),
          r.paymentMode, 'N/A', 'N/A', 'N/A', 'N/A', r.amount.toFixed(2), r.reference
        ].join(','))
      ];
      
      return [headers, ...rows].join('\n');
    };
    
    const csvData = createCSVData();
    
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
    
    console.log('Sample data generation complete!');
    return {
      purchaseCount: purchases.length,
      saleCount: sales.length,
      paymentCount: payments.length,
      receiptCount: receipts.length,
      totalCount: purchases.length + sales.length + payments.length + receipts.length,
      csvUrl: url
    };
  } catch (error) {
    console.error('Error generating sample data:', error);
    throw error;
  }
};

// Add a utility function to download the transaction data as Excel-compatible CSV
export const exportTransactionsToCSV = async () => {
  // Implementation will be similar to the CSV part in generateSampleData
  // This can be extended as needed
};
