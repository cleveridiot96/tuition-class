
import { v4 as uuidv4 } from 'uuid';
import { 
  addBroker, addCustomer, addTransporter, addSupplier, 
  addInventoryItem, updateInventoryAfterSale
} from '@/services/storageService';
import { addSale } from '@/services/saleService';
import { addPayment } from '@/services/paymentService';
import { addReceipt } from '@/services/receiptService';
import { Broker, Customer, Transporter, Supplier, Sale, Payment, Receipt, InventoryItem } from '@/services/types';

// Helper function to generate random integer within range
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to get random element from array
export const randomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper function to get random date within range
export const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to format date as ISO string (YYYY-MM-DD)
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Generate demo inventory items
export const generateInventoryItems = (count: number = 5): InventoryItem[] => {
  const items: InventoryItem[] = [];
  const locations = ['Warehouse A', 'Warehouse B', 'Store Room'];
  
  for (let i = 0; i < count; i++) {
    const quantity = randomInt(50, 300);
    const rate = randomInt(5000, 12000);
    const netWeight = quantity * randomInt(48, 52);
    
    const item: InventoryItem = {
      id: uuidv4(),
      lotNumber: `LOT-${String(i+1).padStart(3, '0')}`,
      quantity,
      netWeight,
      rate,
      location: randomElement(locations),
      isDeleted: false
    };
    
    items.push(item);
    addInventoryItem(item);
  }
  
  return items;
};

// Generate demo data for a complete cycle
export const generateDemoCycle = (
  count: number = 10,
  startDate: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
): void => {
  // Generate master data first
  const brokers = generateBrokers();
  const customers = generateCustomers();
  const transporters = generateTransporters();
  const suppliers = generateSuppliers();
  
  // Generate inventory
  const inventory = generateInventoryItems(Math.ceil(count / 2));
  
  // Generate sales from inventory
  const sales = generateSales(count, inventory, customers, brokers, transporters, startDate);
  
  // Generate payments and receipts based on sales
  generateReceipts(sales, customers);
  generatePayments(suppliers, transporters, brokers);
};

// Generate demo brokers
export const generateBrokers = (count: number = 5): Broker[] => {
  const brokerNames = [
    'DS Traders', 'Ashok Jain Brokerage', 'Rajesh Commodities', 'LB Trading Co.',
    'SK Broker Services', 'Pradeep Singh', 'Mahesh Brokers', 'Rajan & Sons'
  ];
  
  const brokers: Broker[] = [];
  
  for (let i = 0; i < Math.min(count, brokerNames.length); i++) {
    const broker: Broker = {
      id: uuidv4(),
      name: brokerNames[i],
      contactNumber: `98${randomInt(10000000, 99999999)}`,
      commissionRate: randomInt(1, 5) / 10, // 0.1% to 0.5%
      notes: 'Demo broker data',
      isDeleted: false,
      balance: 0
    };
    
    brokers.push(broker);
    addBroker(broker);
  }
  
  return brokers;
};

// Generate demo customers
export const generateCustomers = (count: number = 8): Customer[] => {
  const customerNames = [
    'Anand Traders', 'Shree Ganesh Merchants', 'Sai Traders', 'Krishna Store',
    'Mahalaxmi Enterprises', 'Patel Trading Co.', 'Gupta Brothers', 'Sharma & Sons',
    'Royal Merchants', 'Agarwal Traders', 'Mittal Store', 'Jain Brothers'
  ];
  
  const customers: Customer[] = [];
  
  for (let i = 0; i < Math.min(count, customerNames.length); i++) {
    const customer: Customer = {
      id: uuidv4(),
      name: customerNames[i],
      contactNumber: `98${randomInt(10000000, 99999999)}`,
      address: `Shop No. ${randomInt(1, 50)}, Market Road, City`,
      gstNumber: `27AAAAA${randomInt(1000, 9999)}A1Z${randomInt(0, 9)}`,
      creditLimit: randomInt(100000, 500000),
      payableByCustomer: Math.random() > 0.5,
      notes: 'Demo customer data',
      isDeleted: false,
      balance: 0
    };
    
    customers.push(customer);
    addCustomer(customer);
  }
  
  return customers;
};

// Generate demo transporters
export const generateTransporters = (count: number = 4): Transporter[] => {
  const transporterNames = [
    'Express Logistics', 'Fast Cargo Services', 'Highway Transporters', 
    'Roadways Freight', 'Speed Transport Co.', 'Reliable Logistics'
  ];
  
  const transporters: Transporter[] = [];
  
  for (let i = 0; i < Math.min(count, transporterNames.length); i++) {
    const transporter: Transporter = {
      id: uuidv4(),
      name: transporterNames[i],
      contactNumber: `98${randomInt(10000000, 99999999)}`,
      address: `Plot No. ${randomInt(1, 100)}, Industrial Area, City`,
      gstNumber: `27BBBBB${randomInt(1000, 9999)}B1Z${randomInt(0, 9)}`,
      notes: 'Demo transporter data',
      isDeleted: false,
      balance: 0
    };
    
    transporters.push(transporter);
    addTransporter(transporter);
  }
  
  return transporters;
};

// Generate demo suppliers
export const generateSuppliers = (count: number = 6): Supplier[] => {
  const supplierNames = [
    'AR Products', 'Dalvi Supply Co.', 'Ravi Enterprises', 'Karunesh Trading',
    'Nashik Farmers Cooperative', 'Vidarbha Agro Supplies', 'Marathwada Producers',
    'Western Zone Suppliers'
  ];
  
  const suppliers: Supplier[] = [];
  
  for (let i = 0; i < Math.min(count, supplierNames.length); i++) {
    const supplier: Supplier = {
      id: uuidv4(),
      name: supplierNames[i],
      contactNumber: `98${randomInt(10000000, 99999999)}`,
      address: `${randomInt(100, 999)}, Industrial Estate, City`,
      gstNumber: `27CCCCC${randomInt(1000, 9999)}C1Z${randomInt(0, 9)}`,
      notes: 'Demo supplier data',
      isDeleted: false,
      balance: 0
    };
    
    suppliers.push(supplier);
    addSupplier(supplier);
  }
  
  return suppliers;
};

// Generate demo sales
export const generateSales = (
  count: number,
  inventory: InventoryItem[],
  customers: Customer[],
  brokers: Broker[],
  transporters: Transporter[],
  startDate: Date
): Sale[] => {
  const endDate = new Date();
  const sales: Sale[] = [];
  
  for (let i = 0; i < count && i < inventory.length; i++) {
    const item = inventory[i];
    const customer = randomElement(customers);
    const broker = Math.random() > 0.3 ? randomElement(brokers) : undefined;
    const transporter = randomElement(transporters);
    const date = formatDate(randomDate(startDate, endDate));
    
    // Generate a vakkal number (two letters / two numerics)
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const letter1 = letters.charAt(randomInt(0, letters.length - 1));
    const letter2 = letters.charAt(randomInt(0, letters.length - 1));
    const num1 = randomInt(1, 9);
    const num2 = randomInt(0, 9);
    const vakkal = `${letter1}${letter2}/${num1}${num2}`;
    
    // Determine a partial quantity to sell (not the entire inventory)
    const saleQuantity = Math.max(1, Math.floor(item.quantity * (randomInt(50, 90) / 100)));
    const saleWeight = Math.floor(item.netWeight * (saleQuantity / item.quantity));
    
    // Calculate brokerage if applicable
    const brokerageAmount = broker 
      ? Math.round(item.rate * saleQuantity * (broker.commissionRate || 0.005)) 
      : 0;
    
    // Generate sale price with some variation from inventory rate
    const saleRate = item.rate * (1 + (randomInt(-5, 15) / 100)); // -5% to +15%
    const totalAmount = Math.round(saleRate * saleQuantity);
    
    // Generate transport rate and cost
    const transportRate = randomInt(50, 200);
    const transportCost = transportRate * saleQuantity;
    
    // Calculate final bill amount with some rounding
    const roundedTotal = Math.ceil(totalAmount / 100) * 100;
    const billAmount = roundedTotal + (customer.payableByCustomer ? 0 : transportCost);
    
    const sale: Sale = {
      id: uuidv4(),
      date,
      lotNumber: item.lotNumber,
      billNumber: `BILL-${String(i+1).padStart(3, '0')}`,
      billAmount,
      customer: customer.name,
      customerId: customer.id,
      quantity: saleQuantity,
      netWeight: saleWeight,
      rate: saleRate,
      broker: broker?.name,
      brokerId: broker?.id,
      transporter: transporter.name,
      transporterId: transporter.id,
      transportRate,
      location: item.location,
      notes: `Vakkal: ${vakkal}`,
      totalAmount,
      transportCost,
      netAmount: totalAmount - brokerageAmount,
      brokerageAmount,
      amount: totalAmount
    };
    
    sales.push(sale);
    addSale(sale);
    
    // Update inventory
    updateInventoryAfterSale(item.lotNumber, saleQuantity);
  }
  
  return sales;
};

// Generate receipts based on sales
export const generateReceipts = (sales: Sale[], customers: Customer[]): Receipt[] => {
  const receipts: Receipt[] = [];
  
  // Group sales by customer
  const salesByCustomer = new Map<string, Sale[]>();
  sales.forEach(sale => {
    if (!salesByCustomer.has(sale.customerId)) {
      salesByCustomer.set(sale.customerId, []);
    }
    salesByCustomer.get(sale.customerId)!.push(sale);
  });
  
  // For each customer, generate receipts for their sales
  salesByCustomer.forEach((customerSales, customerId) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    // Calculate total amount for this customer
    const totalAmount = customerSales.reduce((sum, sale) => sum + (sale.billAmount || 0), 0);
    
    // Determine if we'll create partial or full payment
    const isPartialPayment = Math.random() > 0.6;
    
    if (isPartialPayment) {
      // Create 2-3 partial payments
      const numPayments = randomInt(2, 3);
      let remainingAmount = totalAmount;
      
      for (let i = 0; i < numPayments; i++) {
        const isLastPayment = i === numPayments - 1;
        const paymentAmount = isLastPayment 
          ? remainingAmount 
          : Math.floor(remainingAmount * (randomInt(20, 70) / 100));
        
        remainingAmount -= paymentAmount;
        
        if (paymentAmount <= 0) continue;
        
        const paymentMethods = ['cash', 'bank', 'cheque', 'upi'];
        const receipt: Receipt = {
          id: uuidv4(),
          date: formatDate(new Date(Date.now() - randomInt(0, 15) * 24 * 60 * 60 * 1000)),
          partyName: customer.name,
          partyId: customer.id,
          partyType: 'customer',
          amount: paymentAmount,
          paymentMethod: randomElement(paymentMethods),
          referenceNumber: randomElement(paymentMethods) === 'cheque' ? `CHQ-${randomInt(100000, 999999)}` : undefined,
          notes: `Payment for bill${customerSales.length > 1 ? 's' : ''} ${customerSales.map(s => s.billNumber).join(', ')}`,
          isDeleted: false
        };
        
        receipts.push(receipt);
        addReceipt(receipt);
      }
    } else {
      // Create full payment
      const paymentMethods = ['cash', 'bank', 'cheque', 'upi'];
      const receipt: Receipt = {
        id: uuidv4(),
        date: formatDate(new Date(Date.now() - randomInt(0, 10) * 24 * 60 * 60 * 1000)),
        partyName: customer.name,
        partyId: customer.id,
        partyType: 'customer',
        amount: totalAmount,
        paymentMethod: randomElement(paymentMethods),
        referenceNumber: randomElement(paymentMethods) === 'cheque' ? `CHQ-${randomInt(100000, 999999)}` : undefined,
        notes: `Full payment for bill${customerSales.length > 1 ? 's' : ''} ${customerSales.map(s => s.billNumber).join(', ')}`,
        isDeleted: false
      };
      
      receipts.push(receipt);
      addReceipt(receipt);
    }
  });
  
  return receipts;
};

// Generate payments to suppliers and others
export const generatePayments = (
  suppliers: Supplier[],
  transporters: Transporter[],
  brokers: Broker[]
): Payment[] => {
  const payments: Payment[] = [];
  
  // Payments to suppliers
  suppliers.forEach(supplier => {
    const amount = randomInt(50000, 200000);
    const paymentMethods = ['cash', 'bank', 'cheque'];
    
    const payment: Payment = {
      id: uuidv4(),
      date: formatDate(new Date(Date.now() - randomInt(5, 30) * 24 * 60 * 60 * 1000)),
      partyName: supplier.name,
      partyId: supplier.id,
      partyType: 'supplier',
      amount,
      paymentMethod: randomElement(paymentMethods),
      referenceNumber: randomElement(paymentMethods) === 'cheque' ? `CHQ-${randomInt(100000, 999999)}` : undefined,
      notes: 'Payment for supplies',
      isDeleted: false
    };
    
    payments.push(payment);
    addPayment(payment);
  });
  
  // Payments to transporters
  transporters.forEach(transporter => {
    if (Math.random() > 0.3) {
      const amount = randomInt(10000, 50000);
      const paymentMethods = ['cash', 'bank', 'cheque'];
      
      const payment: Payment = {
        id: uuidv4(),
        date: formatDate(new Date(Date.now() - randomInt(3, 20) * 24 * 60 * 60 * 1000)),
        partyName: transporter.name,
        partyId: transporter.id,
        partyType: 'transporter',
        amount,
        paymentMethod: randomElement(paymentMethods),
        referenceNumber: randomElement(paymentMethods) === 'cheque' ? `CHQ-${randomInt(100000, 999999)}` : undefined,
        notes: 'Payment for transportation services',
        isDeleted: false
      };
      
      payments.push(payment);
      addPayment(payment);
    }
  });
  
  // Payments to brokers
  brokers.forEach(broker => {
    if (Math.random() > 0.5) {
      const amount = randomInt(5000, 30000);
      const paymentMethods = ['cash', 'bank', 'cheque'];
      
      const payment: Payment = {
        id: uuidv4(),
        date: formatDate(new Date(Date.now() - randomInt(1, 15) * 24 * 60 * 60 * 1000)),
        partyName: broker.name,
        partyId: broker.id,
        partyType: 'broker',
        amount,
        paymentMethod: randomElement(paymentMethods),
        referenceNumber: randomElement(paymentMethods) === 'cheque' ? `CHQ-${randomInt(100000, 999999)}` : undefined,
        notes: 'Commission payment',
        isDeleted: false
      };
      
      payments.push(payment);
      addPayment(payment);
    }
  });
  
  return payments;
};

export default {
  generateDemoCycle,
  generateBrokers,
  generateCustomers,
  generateTransporters,
  generateSuppliers,
  generateInventoryItems,
  generateSales,
  generateReceipts,
  generatePayments
};
