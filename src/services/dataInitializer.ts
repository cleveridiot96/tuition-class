
import { v4 as uuidv4 } from 'uuid';
import { 
  getSuppliers, 
  getCustomers, 
  getAgents, 
  getTransporters,
  addSupplier,
  addCustomer,
  addAgent,
  addTransporter
} from './storageService';

/**
 * Initializes the application with sample data if none exists
 */
export const initializeSampleData = () => {
  console.log('Checking if sample data needs to be created...');
  
  // Add sample suppliers if none exist
  const suppliers = getSuppliers();
  if (!suppliers || suppliers.length === 0) {
    console.log('Creating sample suppliers...');
    [
      { name: 'ABC Suppliers', address: 'Mumbai' },
      { name: 'XYZ Trading Co.', address: 'Chiplun' },
      { name: 'Quality Goods', address: 'Sawantwadi' }
    ].forEach(supplier => {
      addSupplier({
        id: `supplier-${uuidv4()}`,
        name: supplier.name,
        address: supplier.address,
        isDeleted: false,
        createdAt: new Date().toISOString()
      });
    });
  }
  
  // Add sample customers if none exist
  const customers = getCustomers();
  if (!customers || customers.length === 0) {
    console.log('Creating sample customers...');
    [
      { name: 'Retail Store A', address: 'Mumbai' },
      { name: 'Wholesale Market B', address: 'Delhi' },
      { name: 'Restaurant Chain C', address: 'Bangalore' }
    ].forEach(customer => {
      addCustomer({
        id: `customer-${uuidv4()}`,
        name: customer.name,
        address: customer.address,
        isDeleted: false,
        createdAt: new Date().toISOString()
      });
    });
  }
  
  // Add sample agents if none exist
  const agents = getAgents();
  if (!agents || agents.length === 0) {
    console.log('Creating sample agents...');
    [
      { name: 'John Doe', commissionRate: 1.5 },
      { name: 'Jane Smith', commissionRate: 2.0 },
      { name: 'Mike Johnson', commissionRate: 1.0 }
    ].forEach(agent => {
      addAgent({
        id: `agent-${uuidv4()}`,
        name: agent.name,
        commissionRate: agent.commissionRate,
        isDeleted: false,
        createdAt: new Date().toISOString()
      });
    });
  }
  
  // Add sample transporters if none exist
  const transporters = getTransporters();
  if (!transporters || transporters.length === 0) {
    console.log('Creating sample transporters...');
    [
      { name: 'Fast Delivery Services', rate: 2.5 },
      { name: 'Highway Transport', rate: 3.0 },
      { name: 'Reliable Logistics', rate: 2.75 }
    ].forEach(transporter => {
      addTransporter({
        id: `transporter-${uuidv4()}`,
        name: transporter.name,
        rate: transporter.rate,
        isDeleted: false,
        createdAt: new Date().toISOString()
      });
    });
  }
  
  console.log('Sample data initialization complete');
};
