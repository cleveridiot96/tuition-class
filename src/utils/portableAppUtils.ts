
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
    
    // Check for data in the initialData key
    const initialData = localStorage.getItem('initialData');
    if (initialData) {
      try {
        const data = JSON.parse(initialData);
        // Import data to localStorage if not already there
        if (!localStorage.getItem('locations')) {
          for (const key in data) {
            if (!localStorage.getItem(key)) {
              localStorage.setItem(key, JSON.stringify(data[key]));
            }
          }
          console.log("Imported initial data from portable mode");
          window.dispatchEvent(new Event('storage'));
        }
      } catch (e) {
        console.error("Error parsing initial data:", e);
      }
    }
    
    // Initialize default locations if needed
    const locations = localStorage.getItem('locations');
    if (!locations) {
      localStorage.setItem('locations', JSON.stringify(["Mumbai", "Chiplun", "Sawantwadi"]));
    }
    
    return true;
  } catch (err) {
    console.error("Portable mode error:", err);
    toast.error("Error loading data in portable mode. Try using Chrome or Edge browser with file access enabled.");
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
    
    // Ensure master data arrays exist
    const masterArrays = ['suppliers', 'customers', 'agents', 'brokers', 'transporters'];
    masterArrays.forEach(key => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
      }
    });
    
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
    
    // Add index.html that will be included in the portable version
    const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kisan Khata Sahayak</title>
  <script>
    // Store portable mode flag
    localStorage.setItem('portableMode', 'true');
    
    // Function to load data from data.json
    async function loadData() {
      try {
        const response = await fetch('./data.json');
        if (response.ok) {
          const data = await response.text();
          localStorage.setItem('initialData', data);
          console.log('Data loaded for portable app');
          
          // Redirect to app with portable flag
          window.location.href = 'launcher.html';
        } else {
          document.body.innerHTML += '<p style="color:red">Error loading data. Please ensure data.json is in the same folder.</p>';
        }
      } catch (e) {
        console.error('Error loading data:', e);
        document.body.innerHTML += '<p style="color:red">Error: ' + e.message + '</p>';
      }
    }
    
    // Load data on page load
    window.onload = loadData;
  </script>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background-color: #f5f0e6;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    .loading {
      font-size: 18px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div>
    <h1>Kisan Khata Sahayak</h1>
    <p class="loading">Loading data, please wait...</p>
  </div>
</body>
</html>`;
    
    zip.file("index.html", indexHtml);
    
    // Add launcher HTML
    const launcherContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>किसान खाता सहायक - Start</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background-color: #f5f0e6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
        }
        .container {
            background-color: white;
            border-radius: 8px;
            padding: 30px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: #4C543F;
            margin-top: 0;
        }
        .subtitle {
            color: #7C8569;
            margin-bottom: 30px;
        }
        .button {
            background-color: #5B8E7D;
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 18px;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #4C7C6B;
        }
        .logo {
            width: 120px;
            height: 120px;
            margin: 0 auto 20px;
            background-color: #5B8E7D;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 36px;
            font-weight: bold;
        }
        .progress {
            width: 100%;
            height: 8px;
            background-color: #e5e7eb;
            border-radius: 4px;
            margin: 20px 0;
            overflow: hidden;
            display: none;
        }
        .progress-bar {
            height: 100%;
            background-color: #5B8E7D;
            width: 0;
            animation: progress 1.5s ease-in-out forwards;
        }
        @keyframes progress {
            from { width: 0; }
            to { width: 100%; }
        }
        .info {
            color: #666;
            font-size: 14px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">KKS</div>
        <h1>किसान खाता सहायक</h1>
        <p class="subtitle">आपका कृषि व्यापार प्रबंधन सॉफ्टवेयर</p>
        
        <button class="button" id="startButton">शुरू करें (Start)</button>
        
        <div class="progress" id="progress">
            <div class="progress-bar"></div>
        </div>
        
        <p class="info">Chrome या Edge ब्राउज़र का उपयोग करें (Use Chrome or Edge browser)</p>
    </div>
    
    <script>
        document.getElementById('startButton').addEventListener('click', function() {
            this.style.display = 'none';
            document.getElementById('progress').style.display = 'block';
            
            try {
                // Store portable mode flag
                localStorage.setItem('portableMode', 'true');
                
                // Load initial data from localStorage if available
                const initialData = localStorage.getItem('initialData');
                if (initialData) {
                    try {
                        const data = JSON.parse(initialData);
                        // Import data to localStorage if needed
                        for (const key in data) {
                            localStorage.setItem(key, JSON.stringify(data[key]));
                        }
                        console.log("Imported initial data to localStorage");
                    } catch (e) {
                        console.error("Error importing initial data:", e);
                    }
                }
                
                setTimeout(function() {
                    window.location.href = 'app.html';
                }, 1000);
            } catch (e) {
                alert("Error starting app: " + e.message + "\\nPlease try using Chrome or Edge with file access enabled.");
                console.error("Error starting app:", e);
                document.getElementById('progress').style.display = 'none';
                document.getElementById('startButton').style.display = 'block';
            }
        });
    </script>
</body>
</html>`;
    
    zip.file("launcher.html", launcherContent);
    
    // Add app.html that contains the actual application
    const appHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kisan Khata Sahayak</title>
  <script>
    // Ensure portable mode is set
    localStorage.setItem('portableMode', 'true');
    
    // Simple function to check if localStorage is working
    function testLocalStorage() {
      try {
        const testKey = 'test-' + Date.now();
        localStorage.setItem(testKey, 'test');
        const value = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        
        if (value !== 'test') {
          alert('Error: Cannot access local storage. Please try a different browser.');
          return false;
        }
        return true;
      } catch (e) {
        alert('Error: ' + e.message + '\\nPlease try using Chrome or Edge with file access enabled.');
        return false;
      }
    }
    
    // Only proceed if localStorage is working
    if (!testLocalStorage()) {
      window.location.href = 'launcher.html';
    }
  </script>
  <!-- Include your app content here -->
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 0;
    }
    .error-container {
      padding: 20px;
      text-align: center;
      color: red;
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="error-container">
      <h1>Kisan Khata Sahayak</h1>
      <p>If you're seeing this message, please use Chrome or Edge browser with file access enabled.</p>
      <button onclick="window.location.href='launcher.html'">Go Back</button>
    </div>
  </div>
</body>
</html>`;
    
    zip.file("app.html", appHtml);
    
    // Create a README file with instructions
    const readmeContent = `
# Kisan Khata Sahayak - Portable Version

## How to use this portable version:

1. Extract all files from this ZIP to a folder
2. Make sure all files (index.html, launcher.html, app.html, data.json) are in the same folder
3. Open the "index.html" file using Chrome or Edge browser
4. If you see security warnings, you may need to enable "Allow access to file URLs" in your browser
5. For Chrome: go to chrome://extensions, find "Kisan Khata Sahayak" and enable "Allow access to file URLs"
6. For better compatibility, use Chrome or Edge browser

## Troubleshooting:

- If you see "Error loading data" message, make sure all files are in the same folder
- If the app doesn't work, try opening it in Chrome or Edge browser
- Some browsers restrict access to localStorage when opening files directly
- If you still have issues, try using the web version instead

For support, contact the application provider.
`;
    
    zip.file("README.txt", readmeContent);
    
    // Generate and save zip file
    const content = await zip.generateAsync({ type: "blob" });
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    saveAs(content, `KisanKhataSahayak_Portable_${dateStr}.zip`);
    
    toast.success("Portable version created successfully");
    
    return true;
  } catch (error) {
    console.error("Error creating portable version:", error);
    toast.error("Failed to create portable version");
    return false;
  }
};
