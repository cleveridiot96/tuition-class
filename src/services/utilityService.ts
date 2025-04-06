// Helper function to download CSV
export const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Modify the exportDataBackup function to accept a silent parameter
export const exportDataBackup = (silent = false) => {
  try {
    const data = {
      purchases: JSON.parse(localStorage.getItem('purchases') || '[]'),
      sales: JSON.parse(localStorage.getItem('sales') || '[]'),
      inventory: JSON.parse(localStorage.getItem('inventory') || '[]'),
      agents: JSON.parse(localStorage.getItem('agents') || '[]'),
      suppliers: JSON.parse(localStorage.getItem('suppliers') || '[]'),
      customers: JSON.parse(localStorage.getItem('customers') || '[]'),
      brokers: JSON.parse(localStorage.getItem('brokers') || '[]'),
      transporters: JSON.parse(localStorage.getItem('transporters') || '[]'),
      ledger: JSON.parse(localStorage.getItem('ledger') || '[]'),
      receipts: JSON.parse(localStorage.getItem('receipts') || '[]'),
      payments: JSON.parse(localStorage.getItem('payments') || '[]'),
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

    // Try to export Excel format as well
    try {
      exportExcelBackup(data);
    } catch (excelError) {
      console.error('Error exporting Excel backup:', excelError);
    }

    return jsonData;
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

// Function to export data in Excel-compatible format
export const exportExcelBackup = (data: any) => {
  // This is a simplified version - in a real app you'd use a library like xlsx
  // For now we'll create a CSV format which Excel can open
  try {
    // Purchases CSV
    let purchasesCSV = "ID,Date,Lot Number,Quantity,Agent,Party,Location,Net Weight,Rate,Total Amount\n";
    data.purchases.forEach((p: any) => {
      purchasesCSV += `${p.id},${p.date},${p.lotNumber},${p.quantity},${p.agent},${p.party},${p.location},${p.netWeight},${p.rate},${p.totalAmount}\n`;
    });

    // Inventory CSV
    let inventoryCSV = "ID,Lot Number,Quantity,Location,Date Added,Net Weight\n";
    data.inventory.forEach((i: any) => {
      inventoryCSV += `${i.id},${i.lotNumber},${i.quantity},${i.location},${i.dateAdded},${i.netWeight || 0}\n`;
    });

    // Receipts CSV
    let receiptsCSV = "ID,Date,Receipt Number,Party Name,Party Type,Amount,Payment Method\n";
    data.receipts.forEach((r: any) => {
      receiptsCSV += `${r.id},${r.date},${r.receiptNumber},${r.partyName},${r.partyType},${r.amount},${r.paymentMethod}\n`;
    });

    // Payments CSV
    let paymentsCSV = "ID,Date,Payment Number,Agent,Amount,Payment Method\n";
    data.payments.forEach((p: any) => {
      paymentsCSV += `${p.id},${p.date},${p.paymentNumber},${p.agent},${p.amount},${p.paymentMethod}\n`;
    });

    // Download purchases CSV
    downloadCSV(purchasesCSV, `purchases-backup-${new Date().toISOString().split('T')[0]}.csv`);
    
    // Download inventory CSV
    downloadCSV(inventoryCSV, `inventory-backup-${new Date().toISOString().split('T')[0]}.csv`);
    
    // Download receipts CSV
    downloadCSV(receiptsCSV, `receipts-backup-${new Date().toISOString().split('T')[0]}.csv`);
    
    // Download payments CSV
    downloadCSV(paymentsCSV, `payments-backup-${new Date().toISOString().split('T')[0]}.csv`);

    return true;
  } catch (error) {
    console.error('Error creating Excel backup:', error);
    return false;
  }
};

export const importDataBackup = (jsonData: string) => {
  try {
    const data = JSON.parse(jsonData);
    
    // Check if the data object has the required properties
    if (!data || typeof data !== 'object') {
      console.error('Invalid backup data format');
      return false;
    }
    
    // Create a backup before importing
    exportDataBackup(true);
    
    // Set each data item in localStorage if present
    if ('purchases' in data) localStorage.setItem('purchases', JSON.stringify(data.purchases));
    if ('sales' in data) localStorage.setItem('sales', JSON.stringify(data.sales));
    if ('inventory' in data) localStorage.setItem('inventory', JSON.stringify(data.inventory));
    if ('agents' in data) localStorage.setItem('agents', JSON.stringify(data.agents));
    if ('suppliers' in data) localStorage.setItem('suppliers', JSON.stringify(data.suppliers));
    if ('customers' in data) localStorage.setItem('customers', JSON.stringify(data.customers));
    if ('brokers' in data) localStorage.setItem('brokers', JSON.stringify(data.brokers));
    if ('transporters' in data) localStorage.setItem('transporters', JSON.stringify(data.transporters));
    if ('ledger' in data) localStorage.setItem('ledger', JSON.stringify(data.ledger));
    if ('receipts' in data) localStorage.setItem('receipts', JSON.stringify(data.receipts));
    if ('payments' in data) localStorage.setItem('payments', JSON.stringify(data.payments));
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
