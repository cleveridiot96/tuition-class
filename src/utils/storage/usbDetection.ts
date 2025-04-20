
import { toast } from '@/hooks/use-toast';
import { emergencyBackup } from '../backup/emergencyBackup';

export const setupUSBDetection = () => {
  try {
    if ('storage' in navigator && 'ondevicechange' in navigator.storage) {
      navigator.storage.ondevicechange = () => {
        console.log('Storage device change detected (USB insertion/removal)');
        emergencyBackup();
        toast({
          title: "Storage Device Change Detected",
          description: "Data has been automatically backed up for safety",
        });
      };
      
      console.log("USB storage change detection initialized");
      return true;
    } else {
      console.log("USB storage detection not supported in this browser");
      return false;
    }
  } catch (error) {
    console.error("Error setting up USB detection:", error);
    return false;
  }
};
