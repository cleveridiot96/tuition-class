
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
    
    // Create a simple loader script
    const loaderScript = `
      // Restore data from data.json to localStorage
      fetch('./data.json')
        .then(response => response.json())
        .then(data => {
          Object.keys(data).forEach(key => {
            localStorage.setItem(key, data[key]);
          });
          console.log('Data restored to localStorage');
          
          // Redirect to the app
          window.location.href = 'index.html';
        })
        .catch(error => {
          console.error('Error loading data:', error);
          document.getElementById('error-message').style.display = 'block';
        });
    `;
    
    // Add the loader HTML file
    const loaderHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kisan Khata Sahayak - Launcher</title>
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
        }
        .container {
          text-align: center;
          padding: 2rem;
          max-width: 600px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 {
          color: #4d7c0f;
          margin-bottom: 1rem;
        }
        .loading {
          margin: 20px 0;
          font-size: 18px;
        }
        .progress {
          width: 100%;
          height: 8px;
          background-color: #e5e7eb;
          border-radius: 4px;
          margin: 20px 0;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background-color: #4d7c0f;
          width: 0;
          animation: progress 2s ease-in-out forwards;
        }
        @keyframes progress {
          from { width: 0; }
          to { width: 100%; }
        }
        #error-message {
          display: none;
          color: #dc2626;
          margin-top: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Kisan Khata Sahayak</h1>
        <p>Agricultural Business Management System</p>
        
        <div class="loading">Loading your application...</div>
        <div class="progress">
          <div class="progress-bar"></div>
        </div>
        
        <div id="error-message">
          There was a problem loading your data. Please try again.
        </div>
      </div>

      <script>
        ${loaderScript}
      </script>
    </body>
    </html>
    `;
    
    zip.file("launch.html", loaderHTML);
    
    // Get the current HTML content
    const currentHtml = await fetch(window.location.origin + "/index.html").then(response => response.text());
    zip.file("index.html", currentHtml);
    
    // Create the zip file
    const content = await zip.generateAsync({type: "blob"});
    
    // Trigger download
    saveAs(content, "kisan-khata-portable.zip");
    
    // Dispatch an event to notify the application about the successful creation
    const event = new CustomEvent('backup-created', { 
      detail: { success: true } 
    });
    window.dispatchEvent(event);
    
    return true;
  } catch (error) {
    console.error("Error creating portable version:", error);
    
    // Dispatch an event to notify the application about the failed creation
    const event = new CustomEvent('backup-created', { 
      detail: { success: false } 
    });
    window.dispatchEvent(event);
    
    return false;
  }
}
