
import { toast } from "sonner";
import { exportDataBackup } from "@/services/backup/exportBackup";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Helper function to check if we're running in portable mode
export const isPortableMode = (): boolean => {
  return window.location.protocol === 'file:' || 
    window.location.href.includes('portable=true') ||
    localStorage.getItem('portableMode') === 'true';
};

// Helper function to ensure data is properly loaded in portable mode
export const ensurePortableDataLoaded = (): boolean => {
  if (!isPortableMode()) return true;
  
  try {
    // Check if we can access localStorage in portable mode
    const testKey = 'portable-test-' + Date.now();
    localStorage.setItem(testKey, 'test');
    const testValue = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    if (testValue !== 'test') {
      console.error("Portable mode storage test failed");
      toast.error("Error: Cannot access storage in portable mode. Try using a different browser.");
      return false;
    }
    
    // Initialize default locations if needed
    const locations = localStorage.getItem('locations');
    if (!locations) {
      localStorage.setItem('locations', JSON.stringify(["Mumbai", "Chiplun", "Sawantwadi"]));
    }
    
    return true;
  } catch (err) {
    console.error("Portable mode error:", err);
    toast.error("Error loading data in portable mode. Try allowing local file access in your browser.");
    return false;
  }
};

// Helper function to fix common portable app issues
export const fixPortableAppIssues = (): void => {
  if (!isPortableMode()) return;
  
  try {
    // Ensure default locations exist
    const locations = localStorage.getItem('locations');
    if (!locations || locations === '[]') {
      localStorage.setItem('locations', JSON.stringify(["Mumbai", "Chiplun", "Sawantwadi"]));
    }
    
    // Ensure financial year is set
    const currentYear = localStorage.getItem('currentFinancialYear');
    if (!currentYear) {
      const now = new Date();
      const yearEnd = now.getMonth() >= 3 ? now.getFullYear() + 1 : now.getFullYear();
      const yearStart = yearEnd - 1;
      localStorage.setItem('currentFinancialYear', `${yearStart}-${yearEnd}`);
    }
    
    console.log("Portable app settings verified and fixed if needed");
  } catch (err) {
    console.error("Error fixing portable app issues:", err);
  }
};

// Call this function early in the app initialization
export const initializePortableApp = (): void => {
  if (isPortableMode()) {
    console.log("Running in portable mode");
    fixPortableAppIssues();
    ensurePortableDataLoaded();
  }
};

// Create a portable version of the application
export const createPortableVersion = async (): Promise<boolean> => {
  try {
    // Create a backup of the data
    const dataBackup = exportDataBackup(true);
    if (!dataBackup) {
      toast.error("Failed to create data backup");
      return false;
    }

    // Create zip file with all necessary files
    const zip = new JSZip();
    
    // Add data backup
    zip.file("data.json", dataBackup);
    
    // Add launcher HTML
    const launcherContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kisan Khata Sahayak - Portable</title>
  <script>
    // Store the portable mode flag
    localStorage.setItem('portableMode', 'true');
    
    // Check if we have a data backup to import
    const dataJson = localStorage.getItem('initialData');
    if (dataJson) {
      try {
        const data = JSON.parse(dataJson);
        // Import data to localStorage
        for (const key in data) {
          localStorage.setItem(key, JSON.stringify(data[key]));
        }
        console.log("Imported initial data");
      } catch (e) {
        console.error("Error importing initial data:", e);
      }
    }
    
    // Redirect to main app
    window.location.href = './index.html?portable=true';
  </script>
</head>
<body>
  <p>Loading Kisan Khata Sahayak...</p>
</body>
</html>`;
    
    zip.file("launcher.html", launcherContent);
    
    // Import data.json content into the app
    const importScript = `
    // This script imports the data.json file's contents into localStorage
    // It's executed when the portable app is launched
    document.addEventListener('DOMContentLoaded', async () => {
      try {
        const response = await fetch('./data.json');
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('initialData', JSON.stringify(data));
          console.log("Data loaded for portable mode");
        } else {
          console.error("Failed to load data.json");
        }
      } catch (e) {
        console.error("Error loading portable data:", e);
      }
    });
    `;
    
    zip.file("portable-loader.js", importScript);
    
    // Generate and save zip file
    const content = await zip.generateAsync({ type: "blob" });
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    saveAs(content, `KisanKhataSahayak_Portable_${dateStr}.zip`);
    
    toast.success("Portable version created successfully");
    
    // Enable portable mode in localStorage for testing
    localStorage.setItem('portableMode', 'true');
    
    return true;
  } catch (error) {
    console.error("Error creating portable version:", error);
    toast.error("Failed to create portable version");
    return false;
  }
};
