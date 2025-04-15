
import { v4 as uuidv4 } from 'uuid';
import { addPurchase } from '@/services/purchaseService';
import { addSale } from '@/services/saleService';
import { addPayment } from '@/services/paymentService';
import { addReceipt } from '@/services/receiptService';
import { addInventoryItem } from '@/services/inventoryService';
import { 
  getAgents, 
  getBrokers, 
  getCustomers, 
  getSuppliers, 
  getTransporters,
  getLocations
} from '@/services/storageService';
import { 
  Broker,
  Agent,
  Customer,
  Supplier,
  Transporter,
  Receipt
} from '@/services/types';
import { subDays, format } from 'date-fns';

// Function to generate random Indian names for parties
export function generateIndianName(type: 'purchase' | 'sale' | 'agent' | 'broker' | 'transporter'): string {
  // Different name generators based on type
  if (type === 'purchase') {
    const firstNames = ['Ravi', 'Ajay', 'Suresh', 'Dalvi', 'Karunesh', 'Vijay', 'AR', 'Manoj', 'Prakash', 'Ganesh'];
    return firstNames[Math.floor(Math.random() * firstNames.length)];
  } else if (type === 'broker') {
    const brokerNames = ['DS', 'Ashok Jain', 'Rajesh', 'LB', 'Pratap', 'MK', 'Kishor', 'Sanjay'];
    return brokerNames[Math.floor(Math.random() * brokerNames.length)];
  } else if (type === 'transporter') {
    const transporterNames = ['Roadways', 'Transport', 'Logistics', 'Carrier', 'Cargo'];
    const firstNames = ['Mahalaxmi', 'Sainath', 'Durga', 'Shree', 'Maruti', 'Vaishnavi', 'Krishna', 'Balaji'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${transporterNames[Math.floor(Math.random() * transporterNames.length)]}`;
  } else if (type === 'agent') {
    const agentNames = ['Ganpat', 'Ramesh', 'Dinesh', 'Bharat', 'Mahesh', 'KV', 'ST', 'RK'];
    return agentNames[Math.floor(Math.random() * agentNames.length)];
  } else {
    const businessTypes = ['Traders', 'Merchants', 'Store', 'Enterprises', 'Industries', 'Corporation'];
    const firstNames = ['Agarwal', 'Sharma', 'Patel', 'Shah', 'Kumar', 'Singh', 'Joshi', 'Mehta', 'Gupta', 'Desai'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${businessTypes[Math.floor(Math.random() * businessTypes.length)]}`;
  }
}

// Generate sample data 
export function generateSampleData() {
  const startDate = subDays(new Date(), 90); // Start from 90 days ago
  
  // Sample stats
  let purchaseCount = 0;
  let saleCount = 0;
  let paymentCount = 0;
  let receiptCount = 0;
  let locations: string[] = [];
  
  const agents = getAgents() || [];
  const brokers = getBrokers() || [];
  const customers = getCustomers() || [];
  const suppliers = getSuppliers() || [];
  const transporters = getTransporters() || [];
  
  // If there are no locations, create some
  try {
    locations = getLocations();
    if (!locations || locations.length === 0) {
      locations = ['Warehouse A', 'Godown 1', 'Godown 2', 'Main Store', 'Annex'];
    }
  } catch (error) {
    locations = ['Warehouse A', 'Godown 1', 'Godown 2', 'Main Store', 'Annex'];
  }
  
  // Generate 50 purchases over the past 90 days
  const purchases = [];
  for (let i = 0; i < 50; i++) {
    // Generate a purchase date within the past 90 days
    const purchaseDate = subDays(new Date(), Math.floor(Math.random() * 90));
    
    // Generate lot number - format: "Two letters/two numerics"
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lotNumber = `${letters.charAt(Math.floor(Math.random() * letters.length))}${letters.charAt(Math.floor(Math.random() * letters.length))}/${Math.floor(Math.random() * 100)}`;
    
    // Calculate quantity, weight, and rate
    const quantity = Math.floor(Math.random() * 15) + 5; // 5 to 20 bags
    const bagWeight = 49 + (Math.random() * 2); // approx 50kg per bag (+/- 1kg)
    const netWeight = quantity * bagWeight;
    const rate = 500 + (Math.random() * 1500); // rate between 500 and 2000 per kg
    
    // Calculate total amount
    const totalAmount = netWeight * rate;
    
    // Select random broker if broker commission is applicable
    const useBroker = Math.random() > 0.5;
    let broker;
    let brokerId;
    let brokerageAmount = 0;
    
    if (useBroker && brokers.length > 0) {
      const selectedBroker = brokers[Math.floor(Math.random() * brokers.length)] as Broker;
      broker = selectedBroker.name;
      brokerId = selectedBroker.id;
      
      // Calculate brokerage based on commission rate or default to 1%
      const commissionRate = selectedBroker.commissionRate || 1;
      brokerageAmount = totalAmount * (commissionRate / 100);
    }
    
    // Select random agent
    let agent;
    let agentId;
    
    if (Math.random() > 0.7 && agents.length > 0) {
      const selectedAgent = agents[Math.floor(Math.random() * agents.length)] as Agent;
      agent = selectedAgent.name;
      agentId = selectedAgent.id;
    }
    
    // Select random transporter
    const selectedTransporter = transporters.length > 0 ? 
                               transporters[Math.floor(Math.random() * transporters.length)] as Transporter : 
                               { id: uuidv4(), name: generateIndianName('transporter') };
    
    const transporterId = selectedTransporter.id;
    const transporter = selectedTransporter.name;
    const transportRate = 0.5 + (Math.random() * 1.5); // 0.5 to 2 per kg
    const transportCost = netWeight * transportRate;
    
    // Random additional expenses
    const expenses = Math.floor(Math.random() * 1000);
    
    // Total after expenses
    const totalAfterExpenses = totalAmount + transportCost + brokerageAmount + expenses;
    
    // Create the purchase object with correct brokerageType
    const purchase = {
      id: uuidv4(),
      date: format(purchaseDate, 'yyyy-MM-dd'),
      lotNumber,
      quantity,
      netWeight,
      rate,
      party: suppliers.length > 0 ? 
             (suppliers[Math.floor(Math.random() * suppliers.length)] as Supplier).name : 
             generateIndianName('purchase'),
      location: locations[Math.floor(Math.random() * locations.length)],
      transporterId,
      transporter,
      transportRate,
      expenses,
      totalAmount,
      totalAfterExpenses,
      brokerageType: useBroker ? (Math.random() > 0.5 ? "percentage" : "fixed") as "percentage" | "fixed" : "percentage" as "percentage" | "fixed",
      brokerageValue: useBroker ? (Math.random() * 2) + 0.5 : undefined, // 0.5% to 2.5% or fixed amount
      brokerageAmount,
      transportCost,
      notes: Math.random() > 0.8 ? `Sample purchase note ${i+1}` : undefined,
      broker,
      brokerId,
      agent,
      agentId
    };
    
    // Add the purchase to storage
    try {
      addPurchase(purchase);
      
      // Add to inventory
      addInventoryItem({
        id: `${purchase.id}-inv`,
        lotNumber: purchase.lotNumber,
        quantity: purchase.quantity,
        netWeight: purchase.netWeight,
        rate: purchase.rate,
        location: purchase.location,
        dateAdded: purchase.date
      });
      
      purchases.push(purchase);
      purchaseCount++;
    } catch (error) {
      console.error("Error creating sample purchase:", error);
    }
  }
  
  // Generate sales
  const sales = [];
  for (let i = 0; i < 40; i++) {
    // Pick a random purchase to sell from
    if (purchases.length === 0) continue;
    
    const purchaseIndex = Math.floor(Math.random() * purchases.length);
    const purchase = purchases[purchaseIndex];
    
    // Generate a sale date after purchase date but within 30 days
    const purchaseTime = new Date(purchase.date).getTime();
    const maxDaysAfter = Math.min(30, (new Date().getTime() - purchaseTime) / (1000 * 60 * 60 * 24));
    const saleDate = new Date(purchaseTime + (Math.random() * maxDaysAfter * 24 * 60 * 60 * 1000));
    
    // Decide quantity to sell (may be partial)
    const maxQuantity = purchase.quantity;
    const saleQuantity = Math.max(1, Math.floor(Math.random() * maxQuantity));
    
    // Calculate weights and amounts
    const bagWeight = purchase.netWeight / purchase.quantity;
    const saleNetWeight = saleQuantity * bagWeight;
    
    // Determine sale rate (usually higher than purchase rate)
    const margin = 1 + (Math.random() * 0.3); // 0-30% margin
    const saleRate = purchase.rate * margin;
    const totalAmount = saleNetWeight * saleRate;
    
    // Select random broker
    const useBroker = Math.random() > 0.6;
    let broker;
    let brokerId;
    let brokerageAmount = 0;
    
    if (useBroker && brokers.length > 0) {
      const selectedBroker = brokers[Math.floor(Math.random() * brokers.length)] as Broker;
      broker = selectedBroker.name;
      brokerId = selectedBroker.id;
      
      // Calculate brokerage based on commission rate or default to 1%
      const commissionRate = selectedBroker.commissionRate || 1;
      brokerageAmount = totalAmount * (commissionRate / 100);
    }
    
    // Select random customer
    const selectedCustomer = customers.length > 0 ? 
                            customers[Math.floor(Math.random() * customers.length)] as Customer : 
                            { id: uuidv4(), name: generateIndianName('sale') };
    
    const customerId = selectedCustomer.id;
    const customer = selectedCustomer.name;
    
    // Determine if bill amount should include GST
    const includeGST = selectedCustomer.payableByCustomer !== false && Math.random() > 0.5;
    const billAmount = includeGST ? totalAmount * 1.18 : totalAmount; // 18% GST
    
    // Random transport details
    const useTransport = Math.random() > 0.3;
    let transporter;
    let transporterId;
    let transportRate;
    let transportCost = 0;
    
    if (useTransport) {
      const selectedTransporter = transporters.length > 0 ? 
                                 transporters[Math.floor(Math.random() * transporters.length)] as Transporter : 
                                 { id: uuidv4(), name: generateIndianName('transporter') };
      
      transporterId = selectedTransporter.id;
      transporter = selectedTransporter.name;
      transportRate = 0.5 + (Math.random() * 1.5); // 0.5 to 2 per kg
      transportCost = saleNetWeight * transportRate;
    }
    
    // Bill number
    const billNumber = `INV-${String(i + 100).padStart(3, '0')}`;
    
    // Create the sale object
    const sale = {
      id: uuidv4(),
      date: format(saleDate, 'yyyy-MM-dd'),
      lotNumber: purchase.lotNumber,
      billNumber,
      billAmount,
      customer,
      customerId,
      quantity: saleQuantity,
      netWeight: saleNetWeight,
      rate: saleRate,
      broker,
      brokerId,
      transporter,
      transporterId,
      transportRate,
      location: purchase.location,
      notes: Math.random() > 0.8 ? `Sample sale note ${i+1}` : undefined,
      totalAmount,
      transportCost,
      netAmount: totalAmount - (brokerageAmount || 0) - (transportCost || 0),
      brokerageAmount,
      amount: totalAmount
    };
    
    // Add the sale to storage and update inventory
    try {
      addSale(sale);
      purchases[purchaseIndex].quantity -= saleQuantity;
      
      if (purchases[purchaseIndex].quantity <= 0) {
        purchases.splice(purchaseIndex, 1);
      }
      
      sales.push(sale);
      saleCount++;
    } catch (error) {
      console.error("Error creating sample sale:", error);
    }
  }
  
  // Generate payments
  for (let i = 0; i < Math.min(purchases.length * 0.8, 40); i++) {
    try {
      // Pick a random purchase to pay for
      const purchaseIndex = Math.floor(Math.random() * purchases.length);
      const purchase = purchases[purchaseIndex];
      
      // Generate payment date after purchase date
      const purchaseTime = new Date(purchase.date).getTime();
      const maxDaysAfter = Math.min(45, (new Date().getTime() - purchaseTime) / (1000 * 60 * 60 * 24));
      const paymentDate = new Date(purchaseTime + (Math.random() * maxDaysAfter * 24 * 60 * 60 * 1000));
      
      // Decide payment amount (may be partial)
      const paymentPercent = Math.random() > 0.7 ? 1 : 0.3 + (Math.random() * 0.7); // 30-100% payment
      const paymentAmount = Math.round(purchase.totalAfterExpenses * paymentPercent);
      
      // Payment method
      const paymentMethods = ['Cash', 'Bank Transfer', 'Check', 'UPI', 'NEFT'];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      // Create payment object
      const payment = {
        id: uuidv4(),
        date: format(paymentDate, 'yyyy-MM-dd'),
        partyName: purchase.party,
        partyId: purchase.id, // Using purchase ID as party ID for simplicity
        partyType: 'supplier',
        amount: paymentAmount,
        paymentMethod,
        reference: `PUR-${purchase.lotNumber}`,
        referenceNumber: Math.random() > 0.5 ? `REF${Math.floor(Math.random() * 10000)}` : undefined,
        notes: Math.random() > 0.8 ? `Payment for lot ${purchase.lotNumber}` : undefined
      };
      
      // Add payment
      addPayment(payment);
      paymentCount++;
      
    } catch (error) {
      console.error("Error creating sample payment:", error);
    }
  }
  
  // Generate receipts for sales
  for (let i = 0; i < Math.min(sales.length * 0.7, 30); i++) {
    try {
      // Pick a random sale to receive payment for
      const saleIndex = Math.floor(Math.random() * sales.length);
      const sale = sales[saleIndex];
      
      // Generate receipt date after sale date
      const saleTime = new Date(sale.date).getTime();
      const maxDaysAfter = Math.min(30, (new Date().getTime() - saleTime) / (1000 * 60 * 60 * 24));
      const receiptDate = new Date(saleTime + (Math.random() * maxDaysAfter * 24 * 60 * 60 * 1000));
      
      // Decide receipt amount (may be partial)
      const receiptPercent = Math.random() > 0.6 ? 1 : 0.4 + (Math.random() * 0.6); // 40-100% payment
      const receiptAmount = Math.round((sale.billAmount || sale.totalAmount) * receiptPercent);
      
      // Receipt method
      const receiptMethods = ['Cash', 'Bank Transfer', 'Check', 'UPI', 'NEFT', 'IMPS'];
      const paymentMethod = receiptMethods[Math.floor(Math.random() * receiptMethods.length)];
      
      // Create receipt object with the right properties
      const receipt: Receipt = {
        id: uuidv4(),
        date: format(receiptDate, 'yyyy-MM-dd'),
        amount: receiptAmount,
        customerId: sale.customerId,
        customerName: sale.customer,
        paymentMethod,
        reference: `BILL-${sale.billNumber}`,
        notes: Math.random() > 0.8 ? `Receipt against bill ${sale.billNumber}` : undefined,
        paymentMode: paymentMethod // Added this to match the Receipt type
      };
      
      // Add receipt
      addReceipt(receipt);
      receiptCount++;
      
    } catch (error) {
      console.error("Error creating sample receipt:", error);
    }
  }
  
  console.log(`Generated ${purchaseCount} purchases, ${saleCount} sales, ${paymentCount} payments, and ${receiptCount} receipts`);
  
  // Create CSV data for download
  let csvContent = "Type,Date,Lot/Bill,Party,Amount\n";
  
  // Add purchases to CSV
  purchases.forEach(p => {
    csvContent += `Purchase,${p.date},${p.lotNumber},${p.party},${p.totalAmount}\n`;
  });
  
  // Add sales to CSV
  sales.forEach(s => {
    csvContent += `Sale,${s.date},${s.billNumber || 'N/A'},${s.customer},${s.totalAmount}\n`;
  });
  
  const totalCount = purchaseCount + saleCount + paymentCount + receiptCount;
  
  // Create blob for download
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const csvUrl = URL.createObjectURL(blob);
  
  // Trigger download
  const link = document.createElement('a');
  link.href = csvUrl;
  link.download = `sample_transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return {
    purchaseCount,
    saleCount,
    paymentCount,
    receiptCount,
    totalCount,
    csvUrl
  };
}

// Generate individual entities
export const generateSales = () => {
  // Implementation would be similar to generateSampleData but only for sales
  return [];
};
