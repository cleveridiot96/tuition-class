
import { toast } from '@/hooks/use-toast';

export const exportDataBackup = (silent: boolean = false): string | null => {
  try {
    const data: Record<string, any> = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || "null");
        } catch (e) {
          data[key] = localStorage.getItem(key);
        }
      }
    }
    
    const jsonData = JSON.stringify(data, null, 2);
    if (!silent) {
      toast({
        title: "Backup Created",
        description: `Successfully backed up ${Object.keys(data).length} data items`,
      });
    }
    return jsonData;
  } catch (error) {
    console.error("Error creating data backup:", error);
    if (!silent) {
      toast({
        title: "Backup Error",
        description: "Failed to create data backup",
        variant: "destructive",
      });
    }
    return null;
  }
};
