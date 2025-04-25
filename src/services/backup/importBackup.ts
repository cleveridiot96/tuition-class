
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

/**
 * Import data from a backup
 * @param fileOrData The file or JSON string to import
 * @returns Boolean indicating success
 */
export const importDataBackup = (fileOrData: File | string): boolean => {
  try {
    // Handle string data directly
    if (typeof fileOrData === 'string') {
      const data = JSON.parse(fileOrData);
      
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
    }
    
    // Handle File object
    const reader = new FileReader();
    let success = false;
    
    reader.onload = (event) => {
      try {
        if (typeof event.target?.result !== 'string') {
          throw new Error("Invalid file format");
        }
        
        const data = JSON.parse(event.target.result);
        
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
        success = true;
      } catch (error) {
        console.error("Error importing data:", error);
        toast({
          title: "Import Failed",
          description: "Could not import the backup data",
          variant: "destructive",
        });
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Import Failed",
        description: "Could not read the backup file",
        variant: "destructive",
      });
    };
    
    reader.readAsText(fileOrData);
    return success;
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
