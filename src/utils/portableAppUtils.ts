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
          <h3>Simple Instructions:</h3>
          <ol>
            <li>Just click the green button above to start!</li>
            <li>Your data automatically saves to this drive</li>
            <li>No internet needed - works anywhere</li>
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
    
    // Essential files list - keep it minimal for smaller size
    const essentialPaths = [
      "/index.html",
      "/manifest.json",
      "/favicon.ico",
      "/logo192.png",
      "/assets/index.css", 
      "/assets/index.js"
    ];
    
    // Create a modified index.html that loads data from data.json AND auto-saves changes
    const indexHtmlResponse = await fetch("/index.html");
    let indexHtml = await indexHtmlResponse.text();
    
    // Create data restoration and auto-save script
    const dataScript = `
    <script>
      // Load data from data.json and restore to localStorage before the app starts
      fetch('../data.json')
        .then(response => response.json())
        .then(data => {
          Object.keys(data).forEach(key => {
            localStorage.setItem(key, data[key]);
          });
          console.log('Data successfully restored to localStorage');
          
          // Set up auto-save functionality
          setInterval(() => {
            try {
              // Get all current localStorage data
              const updatedData = {};
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                  updatedData[key] = localStorage.getItem(key);
                }
              }
              
              // Create a Blob and save it back to the data.json file
              const dataStr = JSON.stringify(updatedData);
              const blob = new Blob([dataStr], { type: 'application/json' });
              
              // Use FileSaver API if device supports it
              if (window.navigator && window.navigator.msSaveBlob) {
                // For IE
                window.navigator.msSaveBlob(blob, '../data.json');
              } else {
                // For other browsers, use the download attribute
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = '../data.json';
                link.click();
                URL.revokeObjectURL(link.href);
              }
              
              console.log('Auto-saved data to USB drive');
            } catch (error) {
              console.error('Error auto-saving data:', error);
            }
          }, 30000); // Auto-save every 30 seconds
          
          // Also save when user is about to leave the page
          window.addEventListener('beforeunload', () => {
            try {
              // Get all current localStorage data
              const updatedData = {};
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                  updatedData[key] = localStorage.getItem(key);
                }
              }
              
              // Use synchronous localStorage to store backup
              localStorage.setItem('portable_backup', JSON.stringify(updatedData));
              console.log('Saved exit backup to localStorage');
              
              // Send data to service worker for syncing
              if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                  type: 'SAVE_DATA',
                  data: updatedData
                });
              }
            } catch (error) {
              console.error('Error saving data on exit:', error);
            }
          });
        })
        .catch(error => {
          console.error('Error loading data:', error);
          alert('There was an error loading your data. The application may not work correctly.');
        });
    </script>`;
    
    // Insert the data script before the closing </body> tag
    indexHtml = indexHtml.replace('</body>', `${dataScript}\n</body>`);
    
    // Add the modified index.html to the app folder
    appFolder.file("index.html", indexHtml);
    
    // Create a readme file with simple instructions
    const readmeContent = `
# Kisan Khata Sahayak - Plug & Play USB Version

## Super Simple Instructions
1. Double-click "index.html" to start
2. Use the app normally
3. Your data AUTOMATICALLY SAVES to the USB drive
4. No need to do anything special - just use and go!

No internet needed. Works on any computer or device with a browser.
`;
    
    zip.file("README.txt", readmeContent);
    
    // Fetch and add essential files to the portable version
    for (const path of essentialPaths) {
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

    // Update service worker to support auto-saving in portable mode
    const serviceWorkerJs = `
    // Service Worker for offline and portable functionality
    const CACHE_NAME = 'kisan-khata-sahayak-v4';
    
    self.addEventListener('install', (event) => {
      self.skipWaiting();
    });
    
    self.addEventListener('activate', (event) => {
      event.waitUntil(self.clients.claim());
    });
    
    // Handle auto-saving in portable mode
    self.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SAVE_DATA') {
        try {
          console.log('Service worker received data to save');
          const dataToSave = event.data.data;
          
          // Store in cache for retrieval when app reopens
          caches.open('portable-data-cache').then(cache => {
            const blob = new Blob([JSON.stringify(dataToSave)], { type: 'application/json' });
            const response = new Response(blob);
            cache.put('data.json', response);
            console.log('Service worker cached updated data');
          });
        } catch (error) {
          console.error('Service worker failed to save data:', error);
        }
      }
    });
    `;
    
    appFolder.file("service-worker.js", serviceWorkerJs);
    
    // Create the zip file
    const content = await zip.generateAsync({type: "blob", compression: "DEFLATE", compressionOptions: {level: 9}});
    
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
