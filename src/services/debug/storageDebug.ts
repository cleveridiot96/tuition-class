
export const debugStorage = (key: string = ''): void => {
  try {
    if (key) {
      const value = localStorage.getItem(key);
      console.log(`Storage Debug - Key: ${key}`, value ? JSON.parse(value) : null);
    } else {
      console.log('Storage Debug - All Keys:');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            console.log(`- ${key}:`, JSON.parse(localStorage.getItem(key) || "null"));
          } catch (e) {
            console.log(`- ${key} (raw):`, localStorage.getItem(key));
          }
        }
      }
    }
  } catch (error) {
    console.error("Error debugging storage:", error);
  }
};
