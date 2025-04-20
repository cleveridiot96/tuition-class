
// Function to debug storage content
export const debugStorage = () => {
  console.log("DEBUG: Storage content");
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const value = localStorage.getItem(key);
          console.log(`${key}: ${value?.substring(0, 100)}${value && value.length > 100 ? '...' : ''}`);
        } catch (e) {
          console.log(`${key}: [Error reading value]`);
        }
      }
    }
    
    console.log("DEBUG: End of storage content");
  } catch (error) {
    console.error("Error debugging storage:", error);
  }
};
