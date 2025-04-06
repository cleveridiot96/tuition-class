
import { exportDataBackup } from './utilityService';

// Modify seedInitialData to accept a force parameter
export const seedInitialData = (force = false) => {
  // Check if data already exists
  const purchases = localStorage.getItem('purchases');
  const sales = localStorage.getItem('sales');
  const inventory = localStorage.getItem('inventory');
  
  // If force is true or any of the required data is missing, seed the data
  if (force || !purchases || !sales || !inventory) {
    // Create a backup first if data exists
    if (purchases || sales || inventory) {
      exportDataBackup(true);
    }
    
    // Seed initial data
    const initialPurchases = [
      {
        id: '1',
        date: '2024-01-01',
        agent: 'Agent A',
        quantity: 50,
        ratePerKg: 250,
        netWeight: 50,
        transportCharges: 1000,
        otherExpenses: 500,
        totalAfterExpenses: 14000
      },
      {
        id: '2',
        date: '2024-01-05',
        agent: 'Agent B',
        quantity: 30,
        ratePerKg: 260,
        netWeight: 30,
        transportCharges: 800,
        otherExpenses: 400,
        totalAfterExpenses: 9000
      },
    ];
    
    const initialSales = [
      {
        id: '101',
        date: '2024-01-10',
        customer: 'Customer X',
        quantity: 20,
        ratePerKg: 300,
        netWeight: 20,
        amount: 6000
      },
      {
        id: '102',
        date: '2024-01-15',
        customer: 'Customer Y',
        quantity: 15,
        ratePerKg: 310,
        netWeight: 15,
        amount: 4650
      },
    ];
    
    const initialInventory = [
      {
        id: '201',
        lotNumber: 'LOT001',
        location: 'Mumbai',
        quantity: 100,
        dateAdded: '2024-01-01',
        netWeight: 1000
      },
      {
        id: '202',
        lotNumber: 'LOT002',
        location: 'Chiplun',
        quantity: 50,
        dateAdded: '2024-01-05',
        netWeight: 500
      },
      {
        id: '203',
        lotNumber: 'LOT003',
        location: 'Sawantwadi',
        quantity: 75,
        dateAdded: '2024-01-10',
        netWeight: 750
      },
    ];
    
    localStorage.setItem('purchases', JSON.stringify(initialPurchases));
    localStorage.setItem('sales', JSON.stringify(initialSales));
    localStorage.setItem('inventory', JSON.stringify(initialInventory));
    
    // Initialize other collections if they don't exist
    if (!localStorage.getItem('agents')) {
      localStorage.setItem('agents', JSON.stringify([
        { id: '1', name: 'Agent A', contactNumber: '1234567890', address: 'Mumbai', balance: 0 },
        { id: '2', name: 'Agent B', contactNumber: '9876543210', address: 'Chiplun', balance: 0 }
      ]));
    }
    
    if (!localStorage.getItem('customers')) {
      localStorage.setItem('customers', JSON.stringify([
        { id: '1', name: 'Customer X', contactNumber: '5556667777', address: 'Delhi', balance: 0 },
        { id: '2', name: 'Customer Y', contactNumber: '8889990000', address: 'Pune', balance: 0 }
      ]));
    }
    
    if (!localStorage.getItem('suppliers')) {
      localStorage.setItem('suppliers', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('brokers')) {
      localStorage.setItem('brokers', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('transporters')) {
      localStorage.setItem('transporters', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('ledger')) {
      localStorage.setItem('ledger', JSON.stringify([
        {
          id: '1001',
          date: '2024-01-01',
          partyName: 'Agent A',
          partyType: 'agent',
          description: 'Initial transaction',
          debit: 5000,
          credit: 0,
          balance: -5000
        },
        {
          id: '1002',
          date: '2024-01-05',
          partyName: 'Agent B',
          partyType: 'agent',
          description: 'Initial transaction',
          debit: 0,
          credit: 3000,
          balance: 3000
        },
        {
          id: '1003',
          date: '2024-01-10',
          partyName: 'Cash',
          partyType: 'cash',
          description: 'Opening balance',
          debit: 0,
          credit: 10000,
          balance: 10000
        }
      ]));
    }
  }
};
