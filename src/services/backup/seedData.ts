
import { saveStorageItem, getStorageItem } from '../storageUtils';
import { toast } from "sonner";

// Function to seed initial data
export const seedInitialData = (force?: boolean) => {
  try {
    if (force || !getStorageItem('locations')) {
      saveStorageItem('locations', ["Mumbai", "Chiplun", "Sawantwadi"]);
      toast.success("Initial data seeded successfully");
    }
    return true;
  } catch (error) {
    console.error("Seed initial data error:", error);
    toast.error("Failed to seed initial data");
    return false;
  }
};
