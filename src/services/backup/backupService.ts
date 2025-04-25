
import { exportDataBackup, importDataBackup } from './backupRestore';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Creates a complete backup of all data in JSON format
export const createCompleteBackup = async (filename?: string): Promise<string | boolean> => {
  try {
    return await exportDataBackup(filename || true, true);
  } catch (error) {
    console.error("Error creating backup:", error);
    return false;
  }
};

// Function to create portable version
export const createPortableVersion = async () => {
  try {
    // Create a backup of data
    const dataBackup = await exportDataBackup(true) as string;
    if (!dataBackup) {
      return { success: false, message: "Failed to create data backup" };
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
    localStorage.setItem('portableMode', 'true');
    window.location.href = './index.html?portable=true';
  </script>
</head>
<body>
  <p>Loading Kisan Khata Sahayak...</p>
</body>
</html>`;
    
    zip.file("launcher.html", launcherContent);
    
    // Generate and save zip file
    const content = await zip.generateAsync({ type: "blob" });
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    saveAs(content, `KisanKhataSahayak_Portable_${dateStr}.zip`);
    
    return { success: true, message: "Portable version created successfully" };
  } catch (error) {
    console.error("Error creating portable version:", error);
    return { success: false, message: `Failed: ${error.message}` };
  }
};
