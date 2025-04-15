
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
    
    // Create a simplified loader HTML file that automatically loads the data
    const loaderHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kisan Khata Sahayak</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background-color: #f8f3e9;
          color: #333;
          margin: 0;
          padding: 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <h1>Kisan Khata Sahayak</h1>
      <p>Loading your data...</p>
      
      <script>
        // Automatically restore data and redirect
        fetch('./data.json')
          .then(response => response.json())
          .then(data => {
            Object.keys(data).forEach(key => {
              localStorage.setItem(key, data[key]);
            });
            window.location.href = 'index.html';
          })
          .catch(error => {
            document.body.innerHTML += '<p style="color: red">Error loading data. Please refresh the page.</p>';
          });
      </script>
    </body>
    </html>
    `;
    
    zip.file("index.html", loaderHTML);
    
    // Get the current HTML content for the actual app
    const currentHtml = await fetch(window.location.origin + "/index.html").then(response => response.text());
    zip.file("app.html", currentHtml);
    
    // Create the zip file
    const content = await zip.generateAsync({type: "blob"});
    
    // Trigger download
    saveAs(content, "kisan-khata-portable.zip");
    
    // Dispatch success event
    const event = new CustomEvent('backup-created', { 
      detail: { success: true } 
    });
    window.dispatchEvent(event);
    
    return true;
  } catch (error) {
    console.error("Error creating portable version:", error);
    
    // Dispatch failure event
    const event = new CustomEvent('backup-created', { 
      detail: { success: false } 
    });
    window.dispatchEvent(event);
    
    return false;
  }
}
