
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function createPortableVersion() {
  try {
    // Create a new zip file
    const zip = new JSZip();
    
    // Add all the necessary files from localStorage
    // First, save all localStorage data
    const storedData: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        storedData[key] = localStorage.getItem(key);
      }
    }
    
    // Add the data file to the zip
    zip.file("data.json", JSON.stringify(storedData));
    
    // Create a simple launcher HTML file that will load the application
    const launcherHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kisan Khata Sahayak - Launch</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f8f3e9;
          color: #333;
          text-align: center;
        }
        .container {
          max-width: 600px;
          padding: 2rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        h1 { 
          color: #4d7c0f;
          margin-top: 0;
        }
        .button {
          background-color: #4d7c0f;
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 18px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 20px;
          text-decoration: none;
          display: inline-block;
        }
        .instructions {
          margin-top: 30px;
          text-align: left;
          background: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
          border-left: 4px solid #4d7c0f;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Kisan Khata Sahayak</h1>
        <p>Agricultural Business Management System</p>
        
        <a href="app/index.html" class="button">Launch Application</a>
        
        <div class="instructions">
          <h3>How to use:</h3>
          <ol>
            <li>Click the "Launch Application" button above to start Kisan Khata Sahayak.</li>
            <li>The application will load with all your data intact.</li>
            <li>Any changes you make will be saved locally to this device.</li>
            <li>To transfer your updated data to another device, create a new portable version from the dashboard.</li>
          </ol>
        </div>
      </div>
    </body>
    </html>
    `;
    
    // Add the launcher HTML file (this will be the entry point)
    zip.file("index.html", launcherHTML);
    
    // Create the app folder
    const appFolder = zip.folder("app");
    if (!appFolder) {
      throw new Error("Failed to create app folder in the zip file");
    }
    
    // Fetch the current application build assets
    const response = await fetch("/asset-manifest.json");
    let assetPaths: string[] = [];
    
    if (response.ok) {
      try {
        const manifest = await response.json();
        if (manifest.files) {
          // Modern Create React App manifest structure
          assetPaths = Object.values(manifest.files) as string[];
        } else if (manifest.entrypoints) {
          // Vite/Webpack style manifest
          assetPaths = manifest.entrypoints;
        }
      } catch (error) {
        console.warn("Could not parse asset manifest, falling back to static file list");
      }
    }
    
    // If we couldn't get the manifest, use a predefined list of essential files
    if (assetPaths.length === 0) {
      // Add core application files - these will be included in the portable version
      assetPaths = [
        "/index.html",
        "/manifest.json",
        "/favicon.ico",
        "/logo192.png",
        "/logo512.png",
        "/assets/index.css", 
        "/assets/index.js"
      ];
    }
    
    // Create a modified index.html that loads data from data.json before starting the app
    // First, get the current index.html
    const indexHtmlResponse = await fetch("/index.html");
    let indexHtml = await indexHtmlResponse.text();
    
    // Create data restoration script
    const dataRestorationScript = `
    <script>
      // Load data from data.json and restore to localStorage before the app starts
      fetch('../data.json')
        .then(response => response.json())
        .then(data => {
          Object.keys(data).forEach(key => {
            localStorage.setItem(key, data[key]);
          });
          console.log('Data successfully restored to localStorage');
        })
        .catch(error => {
          console.error('Error loading data:', error);
          alert('There was an error loading your data. The application may not work correctly.');
        });
    </script>`;
    
    // Insert the data restoration script before the closing </body> tag
    indexHtml = indexHtml.replace('</body>', `${dataRestorationScript}\n</body>`);
    
    // Add the modified index.html to the app folder
    appFolder.file("index.html", indexHtml);
    
    // Create a readme file with instructions
    const readmeContent = `
# Kisan Khata Sahayak - Portable Version

## How to Use
1. Extract this entire folder to your USB drive or any storage device
2. Open the folder and double-click on "index.html" to launch the application
3. The application will run directly from your storage device with all your data

## Important Notes
- This portable version contains all your data at the time it was created
- Any changes you make in this portable version will stay on the device you're using
- To update the portable version with your latest data, create a new portable version from the main application

## Troubleshooting
- If the application doesn't launch, make sure you're opening the index.html file with a modern web browser
- The application works best with Chrome, Firefox, or Edge
- Internet connection is NOT required to use the application
    `;
    
    zip.file("README.txt", readmeContent);
    
    // Try to fetch and add essential files to the portable version
    for (const path of assetPaths) {
      try {
        const fileResponse = await fetch(path);
        if (fileResponse.ok) {
          const content = await fileResponse.blob();
          // Remove the leading slash if present and add to the app folder
          const filePath = path.startsWith('/') ? path.substring(1) : path;
          appFolder.file(filePath, content);
        }
      } catch (error) {
        console.warn(`Could not add ${path} to the portable version`);
      }
    }
    
    // Create the zip file
    const content = await zip.generateAsync({type: "blob"});
    
    // Trigger download
    saveAs(content, "kisan-khata-portable.zip");
    
    // Dispatch an event to notify the application about the successful creation
    const event = new CustomEvent('portable-version-created', { 
      detail: { success: true } 
    });
    window.dispatchEvent(event);
    
    return true;
  } catch (error) {
    console.error("Error creating portable version:", error);
    
    // Dispatch an event to notify the application about the failed creation
    const event = new CustomEvent('portable-version-created', { 
      detail: { success: false, error } 
    });
    window.dispatchEvent(event);
    
    return false;
  }
}
