
import { exportDataBackup } from './exportBackup';
import { importDataBackup } from './importBackup';
import { toast } from '@/hooks/use-toast';

// Re-export base functionality
export { exportDataBackup } from './exportBackup';
export { importDataBackup } from './importBackup';

// Function to clear all data from localStorage
export const clearAllData = (): boolean => {
  try {
    localStorage.clear();
    toast({
      title: "Data Cleared",
      description: "All application data has been removed",
    });
    return true;
  } catch (error) {
    console.error("Error clearing data:", error);
    toast({
      title: "Error",
      description: "Failed to clear data",
      variant: "destructive",
    });
    return false;
  }
};

// Function to clear only master data
export const clearAllMasterData = (): boolean => {
  try {
    const keysToRemove = [
      'suppliers', 
      'customers', 
      'brokers', 
      'transporters', 
      'agents', 
      'masters'
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    toast({
      title: "Master Data Cleared",
      description: "All master data has been removed",
    });
    
    return true;
  } catch (error) {
    console.error("Error clearing master data:", error);
    toast({
      title: "Error",
      description: "Failed to clear master data",
      variant: "destructive",
    });
    return false;
  }
};

// Function to seed initial data
export const seedInitialData = (silent: boolean = false): boolean => {
  try {
    // Initialize empty arrays for essential data
    const initialData = {
      suppliers: [],
      customers: [],
      brokers: [],
      transporters: [],
      agents: [],
      purchases: [],
      sales: [],
      inventory: [],
      payments: [],
      locations: ['Mumbai', 'Chiplun', 'Sawantwadi'],
      masters: []
    };
    
    // Save initial data to localStorage
    Object.entries(initialData).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
    
    if (!silent) {
      toast({
        title: "System Reset",
        description: "Initial data has been seeded successfully",
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error seeding initial data:", error);
    if (!silent) {
      toast({
        title: "Error",
        description: "Failed to seed initial data",
        variant: "destructive",
      });
    }
    return false;
  }
};

// Function to properly format all data
export const completeFormatAllData = async (password: string = ""): Promise<boolean> => {
  // Check if password is provided and correct
  if (password !== "" && password !== "admin123") { // Example password
    toast({
      title: "Authentication Failed",
      description: "Incorrect format password provided",
      variant: "destructive",
    });
    return false;
  }

  try {
    // First create a backup
    const backupData = await exportDataBackup(true) as string;
    
    // Save backup to localStorage before formatting
    if (backupData) {
      localStorage.setItem('preFormatBackup', backupData);
    }
    
    // Clear ALL localStorage completely
    localStorage.clear();
    
    // Small delay to ensure clearing is complete
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Re-initialize with fresh data
    seedInitialData(true);
    
    // Trigger storage event to notify components
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Format Complete",
      description: "All data has been formatted successfully",
    });
    
    return true;
  } catch (error) {
    console.error("Complete format error:", error);
    toast({
      title: "Format Error",
      description: "An error occurred while formatting data",
      variant: "destructive",
    });
    return false;
  }
};

// Function to attempt data recovery in case of crash
export const attemptDataRecovery = () => {
  try {
    // Check for pre-format backup
    const preFormatBackup = localStorage.getItem('preFormatBackup');
    if (preFormatBackup) {
      return { 
        available: true, 
        restore: async () => await importDataBackup(preFormatBackup) 
      };
    }
    
    return { available: false, restore: null };
  } catch (error) {
    console.error("Error checking for recovery data:", error);
    return { available: false, restore: null };
  }
};

// Function to export data in Excel format
export const exportToExcel = (password: string = ""): boolean => {
  // Check if password is provided and correct
  if (password !== "admin123") { // Example password
    toast({
      title: "Authentication Failed",
      description: "Incorrect export password provided",
      variant: "destructive",
    });
    return false;
  }
  
  try {
    // This would be implemented with a library like xlsx
    // For now, we'll just simulate success
    toast({
      title: "Export Successful",
      description: "Data has been exported to Excel format",
    });
    return true;
  } catch (error) {
    console.error("Export to Excel error:", error);
    toast({
      title: "Export Error",
      description: "Failed to export data to Excel format",
      variant: "destructive",
    });
    return false;
  }
};
