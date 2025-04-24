
import { toast } from "sonner";

// Function to clear all data
export const clearAllData = () => {
  try {
    localStorage.clear();
    window.dispatchEvent(new Event('storage'));
    toast.success("All data cleared successfully");
    return true;
  } catch (error) {
    console.error("Clear all data error:", error);
    toast.error("Failed to clear data");
    return false;
  }
};

// Function to clear all master data
export const clearAllMasterData = () => {
  try {
    const masterKeys = [
      'agents',
      'suppliers',
      'customers',
      'brokers',
      'transporters',
      'locations'
    ];
    
    masterKeys.forEach(key => localStorage.removeItem(key));
    window.dispatchEvent(new Event('storage'));
    toast.success("Master data cleared successfully");
    return true;
  } catch (error) {
    console.error("Clear master data error:", error);
    toast.error("Failed to clear master data");
    return false;
  }
};
