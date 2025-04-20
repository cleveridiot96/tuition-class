
import { toast } from '@/hooks/use-toast';

const validateBackupData = (data: unknown): boolean => {
  if (typeof data !== 'object' || data === null) {
    console.error("Invalid backup format: Data is not an object");
    return false;
  }

  const requiredKeys = ['locations', 'currentFinancialYear'];
  const dataObject = data as Record<string, unknown>;
  const missingKeys = requiredKeys.filter(key => !(key in dataObject));
  
  if (missingKeys.length > 0) {
    console.error(`Backup is missing required keys: ${missingKeys.join(', ')}`);
    return false;
  }
  
  return true;
};

export const importDataBackup = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    if (!validateBackupData(data)) {
      toast({
        title: "Invalid Backup",
        description: "The backup file is missing required data",
        variant: "destructive",
      });
      return false;
    }
    
    localStorage.clear();
    
    let importedKeyCount = 0;
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        try {
          localStorage.setItem(key, JSON.stringify(data[key]));
          importedKeyCount++;
        } catch (e) {
          console.error(`Error importing key ${key}:`, e);
        }
      }
    }
    
    toast({
      title: "Import Successful",
      description: `Restored ${importedKeyCount} data items`,
    });
    
    window.dispatchEvent(new Event('storage'));
    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    toast({
      title: "Import Failed",
      description: "Could not import the backup data",
      variant: "destructive",
    });
    return false;
  }
};
