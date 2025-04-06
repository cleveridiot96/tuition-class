export const getPurchases = () => {
  const purchases = localStorage.getItem('purchases');
  return purchases ? JSON.parse(purchases) : [];
};

export const savePurchases = (purchases: any[]) => {
  localStorage.setItem('purchases', JSON.stringify(purchases));
};

export const getSales = () => {
  const sales = localStorage.getItem('sales');
  return sales ? JSON.parse(sales) : [];
};

export const saveSales = (sales: any[]) => {
  localStorage.setItem('sales', JSON.stringify(sales));
};

export const getInventory = () => {
  const inventory = localStorage.getItem('inventory');
  return inventory ? JSON.parse(inventory) : [];
};

export const saveInventory = (inventory: any[]) => {
  localStorage.setItem('inventory', JSON.stringify(inventory));
};

// Modify the exportDataBackup function to accept a silent parameter
export const exportDataBackup = (silent = false) => {
  try {
    const data = {
      purchases: JSON.parse(localStorage.getItem('purchases') || '[]'),
      sales: JSON.parse(localStorage.getItem('sales') || '[]'),
      inventory: JSON.parse(localStorage.getItem('inventory') || '[]'),
      // Add any other data you want to include in the backup
    };

    // Convert data to JSON string
    const jsonData = JSON.stringify(data, null, 2);

    // If silent mode is requested, just return the JSON data
    if (silent) {
      return jsonData;
    }

    // Otherwise, trigger a download
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-data-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Display success message using the toast function if available
    if (typeof toast !== 'undefined') {
      toast({
        title: "Backup Created",
        description: "Data backup successfully downloaded",
      });
    }
    
    return jsonData;
  } catch (error) {
    console.error('Error exporting data:', error);
    if (typeof toast !== 'undefined') {
      toast({
        title: "Backup Failed",
        description: "There was a problem creating the backup",
        variant: "destructive",
      });
    }
    return null;
  }
};

export const importDataBackup = (jsonData: string) => {
  try {
    const data = JSON.parse(jsonData);
    
    // Check if the data object has the required properties
    if (!data || typeof data !== 'object' || !('purchases' in data) || !('sales' in data) || !('inventory' in data)) {
      console.error('Invalid backup data format');
      return false;
    }
    
    // Set each data item in localStorage
    localStorage.setItem('purchases', JSON.stringify(data.purchases));
    localStorage.setItem('sales', JSON.stringify(data.sales));
    localStorage.setItem('inventory', JSON.stringify(data.inventory));
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

// Modify seedInitialData to accept a force parameter
export const seedInitialData = (force = false) => {
  // Check if data already exists
  const purchases = localStorage.getItem('purchases');
  const sales = localStorage.getItem('sales');
  const inventory = localStorage.getItem('inventory');
  
  // If force is true or any of the required data is missing, seed the data
  if (force || !purchases || !sales || !inventory) {
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
        location: 'Mumbai',
        item: 'Rice',
        quantity: 100
      },
      {
        id: '202',
        location: 'Chiplun',
        item: 'Wheat',
        quantity: 50
      },
      {
        id: '203',
        location: 'Sawantwadi',
        item: 'Sugar',
        quantity: 75
      },
    ];
    
    localStorage.setItem('purchases', JSON.stringify(initialPurchases));
    localStorage.setItem('sales', JSON.stringify(initialSales));
    localStorage.setItem('inventory', JSON.stringify(initialInventory));
  }
};
