
import { toast } from '@/hooks/use-toast';

/**
 * Import data backup from string or File
 * @param dataOrFile Backup data as JSON string or File object
 * @param silent Whether to suppress toast notifications
 * @returns Promise resolving to success state
 */
export const importDataBackup = async (dataOrFile: string | File, silent: boolean = false): Promise<boolean> => {
  try {
    let jsonData: string;

    // Handle File object
    if (dataOrFile instanceof File) {
      jsonData = await dataOrFile.text();
    } else {
      // It's already a string
      jsonData = dataOrFile;
    }

    // Parse the JSON data
    const data = JSON.parse(jsonData);

    // Clear existing data if needed (optional step)
    // localStorage.clear();

    // Import all data
    Object.entries(data).forEach(([key, value]) => {
      try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      } catch (error) {
        console.error(`Failed to import item ${key}:`, error);
      }
    });

    if (!silent) {
      toast({
        title: "Import Complete",
        description: `Successfully imported ${Object.keys(data).length} data items`,
      });
    }

    // Dispatch a storage event to notify components of the change
    window.dispatchEvent(new Event('storage'));
    
    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    
    if (!silent) {
      toast({
        title: "Import Error",
        description: "Failed to import data backup. File may be corrupt or invalid.",
        variant: "destructive",
      });
    }
    
    return false;
  }
};
