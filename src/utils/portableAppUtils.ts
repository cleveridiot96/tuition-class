
import { toast } from "sonner";
import { isFileProtocol, isOffline, registerOfflineHandlers } from "./offlineDetection";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Portable mode flag in localStorage
 */
export const PORTABLE_MODE_KEY = 'portableMode';

/**
 * Check if the application is in portable mode
 */
export const isPortableMode = (): boolean => {
  // Check for portable mode flag in localStorage
  const portableMode = localStorage.getItem(PORTABLE_MODE_KEY) === 'true';
  
  // Check for file protocol (always indicates portable mode)
  const fileProtocol = isFileProtocol();
  
  // Check for portable=true in URL query params
  const urlParams = new URLSearchParams(window.location.search);
  const portableParam = urlParams.get('portable') === 'true';
  
  return portableMode || fileProtocol || portableParam;
};

/**
 * Initialize portable app mode
 */
export const initializePortableApp = (): void => {
  // If we're running in portable mode, register offline handlers
  if (isPortableMode()) {
    console.log("Initializing portable app mode");
    localStorage.setItem(PORTABLE_MODE_KEY, 'true');
    
    // Register offline handlers
    registerOfflineHandlers(
      () => {
        console.log("App is offline in portable mode");
        // Being offline in portable mode is normal, so no need for alerts
      },
      () => {
        console.log("App is back online in portable mode");
        // This shouldn't matter in portable mode, but we log it anyway
      }
    );
  }
};

/**
 * Ensure portable data is loaded
 */
export const ensurePortableDataLoaded = (): void => {
  if (!isPortableMode()) return;
  
  try {
    // Create default schema if data doesn't exist
    const requiredKeys = ['suppliers', 'customers', 'brokers', 'agents', 'transporters', 'masters'];
    
    requiredKeys.forEach(key => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
        console.log(`Created empty array for ${key}`);
      }
    });
    
    // Set default locations if they don't exist
    if (!localStorage.getItem('locations')) {
      localStorage.setItem('locations', JSON.stringify(['Mumbai', 'Chiplun', 'Sawantwadi']));
      console.log("Created default locations");
    }
    
    // Check if data loaded correctly by reading it back
    requiredKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (!data) {
        throw new Error(`Failed to initialize ${key} data - storage access issue`);
      }
      
      try {
        // Make sure it's valid JSON array
        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) {
          console.warn(`${key} data is not an array, resetting to empty array`);
          localStorage.setItem(key, JSON.stringify([]));
        }
      } catch (e) {
        console.error(`Invalid JSON for ${key}, resetting to empty array`);
        localStorage.setItem(key, JSON.stringify([]));
      }
    });
    
    console.log("Portable data schema initialized successfully");
  } catch (error) {
    console.error("Error initializing portable data:", error);
    throw error; // Re-throw to be caught by caller
  }
};

/**
 * Exit portable mode
 */
export const exitPortableMode = (): void => {
  localStorage.removeItem(PORTABLE_MODE_KEY);
  sessionStorage.removeItem('portable-mode-message');
  console.log("Exited portable mode");
  toast.success("Exited portable mode");
};

/**
 * Check if the browser supports offline storage
 */
export const checkOfflineStorageSupport = (): boolean => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Create a portable version of the application
 * This exports current data and generates a ZIP file with launcher
 */
export const createPortableVersion = async (): Promise<{success: boolean, message: string}> => {
  try {
    // Backup all localStorage data
    const data: Record<string, any> = {};
    
    // Get all data from localStorage
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
    
    // Create ZIP file
    const zip = new JSZip();
    
    // Add data.json with all localStorage data
    zip.file("data.json", jsonData);
    
    // Create enhanced launcher.html
    const launcherHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';">
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
        .error {
            color: #e53e3e;
            margin-top: 20px;
            display: none;
            padding: 10px;
            background-color: #fff5f5;
            border-left: 4px solid #e53e3e;
            text-align: left;
        }
        .offline-notice {
            background-color: #fff9e6;
            border-left: 4px solid #f5c518;
            padding: 10px;
            text-align: left;
            margin: 20px 0;
            display: none;
        }
        .version {
            font-size: 12px;
            color: #999;
            margin-top: 30px;
        }
        .debug-info {
            margin-top: 20px;
            font-size: 12px; 
            color: #666;
            text-align: left;
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">KKS</div>
        <h1>किसान खाता सहायक</h1>
        <p class="subtitle">आपका कृषि व्यापार प्रबंधन सॉफ्टवेयर</p>
        
        <div class="offline-notice" id="offlineNotice">
            <p><strong>Offline Mode:</strong> You are currently offline.</p>
            <p>The application will run using locally stored data.</p>
        </div>
        
        <button class="button" id="startButton">शुरू करें (Start)</button>
        
        <div class="progress" id="progress">
            <div class="progress-bar"></div>
        </div>
        
        <div class="error" id="errorMessage">
            <p><strong>Error:</strong> <span id="errorDetail">Could not start the application.</span></p>
            <p>This is an offline application. Please make sure all files are in the same folder.</p>
            <button class="button" id="debugButton" style="background-color: #666; margin-top: 10px; padding: 8px 16px; font-size: 14px;">Show Debug Info</button>
        </div>
        
        <div class="debug-info" id="debugInfo">
            <h4>Debug Information:</h4>
            <div id="debugContent"></div>
        </div>
        
        <p class="version">Version 1.0.0</p>
    </div>
    
    <script>
        // Debug helpers
        function showError(message) {
            document.getElementById('errorDetail').textContent = message;
            document.getElementById('errorMessage').style.display = 'block';
            document.getElementById('progress').style.display = 'none';
        }
        
        function addDebugInfo(text) {
            const debugContent = document.getElementById('debugContent');
            const p = document.createElement('p');
            p.textContent = text;
            debugContent.appendChild(p);
        }
        
        // Debug button handler
        document.getElementById('debugButton').addEventListener('click', function() {
            const debugInfo = document.getElementById('debugInfo');
            debugInfo.style.display = debugInfo.style.display === 'block' ? 'none' : 'block';
        });
        
        // Check if we're offline
        if (!navigator.onLine) {
            document.getElementById('offlineNotice').style.display = 'block';
            addDebugInfo("Offline mode detected.");
        }
        
        // Set portable mode flag
        try {
            localStorage.setItem('portableMode', 'true');
            addDebugInfo("Set portableMode = true in localStorage");
        } catch (err) {
            addDebugInfo("Failed to set portableMode: " + err.message);
        }
        
        document.getElementById('startButton').addEventListener('click', function() {
            this.style.display = 'none';
            document.getElementById('progress').style.display = 'block';
            
            try {
                // Load data from data.json if it exists
                fetch('./data.json')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to load data.json (HTTP ' + response.status + ')');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Loading data from data.json...');
                        addDebugInfo("Successfully loaded data.json");
                        
                        // Import all data to localStorage
                        let importCount = 0;
                        Object.entries(data).forEach(([key, value]) => {
                            try {
                                localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                                importCount++;
                            } catch (error) {
                                console.error('Failed to import item ' + key + ':', error);
                                addDebugInfo("Failed to import: " + key + " - " + error.message);
                            }
                        });
                        console.log('Data loaded successfully');
                        addDebugInfo("Imported " + importCount + " data items to localStorage");
                        
                        // Initialize any required data that might be missing
                        initializeDefaultData();
                        
                        // Redirect to main app with portable flag
                        console.log('Redirecting to main app...');
                        window.location.href = 'index.html?portable=true';
                    })
                    .catch(error => {
                        console.error('Error loading data.json:', error);
                        addDebugInfo("Error: " + error.message);
                        showError("Could not load data: " + error.message);
                        
                        // Even if data.json fails, try to launch app with default data
                        initializeDefaultData();
                        
                        // Set a slight delay before redirecting
                        setTimeout(() => {
                            console.log('Redirecting to main app with default data...');
                            window.location.href = 'index.html?portable=true';
                        }, 2000);
                    });
            } catch (err) {
                console.error('Error launching application:', err);
                showError(err.message || "Unknown error");
                addDebugInfo("Critical error: " + err.message);
            }
        });
        
        // Initialize default data if needed
        function initializeDefaultData() {
            // Create default schema if data doesn't exist
            const requiredKeys = ['suppliers', 'customers', 'brokers', 'agents', 'transporters', 'masters'];
            
            requiredKeys.forEach(key => {
                if (!localStorage.getItem(key)) {
                    localStorage.setItem(key, JSON.stringify([]));
                    addDebugInfo("Created empty array for: " + key);
                }
            });
            
            // Set default locations
            if (!localStorage.getItem('locations')) {
                localStorage.setItem('locations', JSON.stringify(['Mumbai', 'Chiplun', 'Sawantwadi']));
                addDebugInfo("Created default locations");
            }
        }
    </script>
</body>
</html>`;
    
    zip.file("launcher.html", launcherHtml);
    
    // Readme file with instructions
    const readmeContent = `# किसान खाता सहायक - Portable Edition

## How to Use

1. Extract all files from this ZIP archive to a folder
2. Open the "launcher.html" file in your browser
3. Click the "Start" button
4. The application will load with your data

## Notes

- This portable version works completely offline
- All your data is stored in your browser's local storage
- For best results, use Chrome or Edge browser
- If you see any errors about "undefined is not iterable", make sure all files are extracted from the ZIP and in the same folder

`;
    
    zip.file("README.md", readmeContent);
    
    // Generate the zip file
    const content = await zip.generateAsync({ type: "blob" });
    
    // Generate a filename with the current date
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const filename = `KisanKhataSahayak_Portable_${dateStr}.zip`;
    
    // Save the zip file
    saveAs(content, filename);
    
    return { success: true, message: "Portable version created successfully" };
  } catch (error) {
    console.error("Error creating portable version:", error);
    return { success: false, message: `Failed to create portable version: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};
