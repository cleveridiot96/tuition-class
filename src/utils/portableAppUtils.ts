
import { toast } from '@/hooks/use-toast';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Creates and downloads a portable version of the application
 * that can be run from a USB drive or local folder
 */
export const createPortableVersion = async () => {
  try {
    toast({
      title: "Creating portable version",
      description: "Please wait while we prepare your portable app...",
    });

    const zip = new JSZip();
    
    // Add essential files
    const essentialPaths = [
      '/index.html',
      '/favicon.ico',
      '/launcher.html',
      '/manifest.json',
      '/service-worker.js',
      '/placeholder.svg',
      '/logo192.png',
      '/logo512.png',
      '/assets/index.js',
      '/assets/index.css'
    ];

    // Fetch and add each file to the zip
    const fetchPromises = essentialPaths.map(async (path) => {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const blob = await response.blob();
          // Remove leading slash for zip paths
          const zipPath = path.startsWith('/') ? path.substring(1) : path;
          zip.file(zipPath, blob);
        }
      } catch (error) {
        console.error(`Failed to fetch ${path}:`, error);
      }
    });

    await Promise.all(fetchPromises);
    
    // Create and add a simplified launch file that automatically opens the app
    const launchHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kisan Khata Sahayak</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background-color: #f8f3e9;
      color: #333;
      text-align: center;
    }
    .container {
      padding: 2rem;
      max-width: 600px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 { color: #4d7c0f; }
    .loading {
      margin: 20px 0;
      font-size: 18px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>किसान खाता सहायक</h1>
    <p>कृषि व्यापार प्रबंधन प्रणाली</p>
    <div class="loading">Loading application...</div>
  </div>
  <script>
    // Automatically launch the app when the page loads
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() {
        window.location.href = 'index.html';
      }, 1000);
    });
  </script>
</body>
</html>`;

    zip.file('launch.html', launchHtml);

    // Generate the ZIP file
    const content = await zip.generateAsync({ type: 'blob' });
    
    // Save the ZIP file
    saveAs(content, 'kisan-khata-sahayak-portable.zip');
    
    toast({
      title: "Portable version created",
      description: "Your portable app has been downloaded successfully!",
    });
  } catch (error) {
    console.error('Error creating portable version:', error);
    toast({
      title: "Error",
      description: "Failed to create portable version. Please try again.",
      variant: "destructive"
    });
  }
};
