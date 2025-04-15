
import { v4 as uuidv4 } from 'uuid';
import { 
  addPurchase, 
  addAgent, 
  addTransporter,
  addBroker,
  addCustomer,
  addSupplier,
  updateAgentBalance,
} from '@/services/storageService';

// Create or ensure parties exist
const purchaseParty = {
  id: uuidv4(),
  name: 'PP',
  address: '',
  balance: 0
};
addSupplier(purchaseParty);

const agent = {
  id: uuidv4(),
  name: 'AR',
  address: '',
  balance: 0
};
addAgent(agent);

const transporter = {
  id: uuidv4(),
  name: 'SUDHA',
  address: '',
  balance: 0
};
addTransporter(transporter);

const broker = {
  id: uuidv4(),
  name: 'LB',
  address: '',
  balance: 0,
  commissionRate: 1 // Default commission rate
};
addBroker(broker);

const customer = {
  id: uuidv4(),
  name: 'JNT',
  address: '',
  balance: 0
};
addCustomer(customer);

// Record the purchase
const purchase = {
  id: uuidv4(),
  date: new Date().toISOString().split('T')[0],
  lotNumber: 'PP/20',
  quantity: Math.ceil(1012 / 50), // Assuming standard bag size of 50kg
  party: purchaseParty.name,
  partyId: purchaseParty.id,
  netWeight: 1012,
  rate: 300,
  totalAmount: 1012 * 300,
  transporterId: transporter.id,
  transporter: transporter.name,
  transportRate: 17,
  transportCost: 17204,
  agentId: agent.id,
  agent: agent.name,
  location: 'Mumbai', // Default location
  notes: 'High rate sale potential via broker LB'
};

addPurchase(purchase);

// Update agent balance
updateAgentBalance(agent.id, purchase.totalAmount);

// Record the sale
const sale = {
  id: uuidv4(),
  date: new Date().toISOString().split('T')[0],
  lotNumber: 'PP/20',
  quantity: 3, // Number of bags sold
  customerId: customer.id,
  customer: customer.name,
  netWeight: 151,
  rate: 430,
  totalAmount: 151 * 430,
  brokerId: broker.id,
  broker: broker.name,
  amount: 151 * 430,
  netAmount: 151 * 430,
  transportCost: 0, // Added the missing required property
  notes: 'High rate sale of PP/20 to JNT via broker LB'
};

const { addSale } = await import('@/services/saleService');
addSale(sale);

// Update inventory after sale
const { updateInventoryAfterSale } = await import('@/services/inventoryService');
updateInventoryAfterSale('PP/20', 3); // Update based on number of bags sold
