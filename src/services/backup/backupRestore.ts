
export const exportDataBackup = (silent: boolean = false): string | null => {
  try {
    const data: Record<string, any> = {};
    
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
    if (!silent) console.log("Data backup created successfully");
    return jsonData;
  } catch (error) {
    console.error("Error creating data backup:", error);
    return null;
  }
};

export const importDataBackup = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    if (typeof data !== 'object' || data === null) {
      console.error("Invalid backup format: Data is not an object");
      return false;
    }

    const requiredKeys = ['locations', 'currentFinancialYear'];
    const missingKeys = requiredKeys.filter(key => !(key in data));
    
    if (missingKeys.length > 0) {
      console.error(`Backup is missing required keys: ${missingKeys.join(', ')}`);
      return false;
    }
    
    localStorage.clear();
    
    let importedKeyCount = 0;
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        try {
          localStorage.setItem(key, JSON.stringify(data[key]));
          importedKeyCount++;
        } catch (e) {
          console.error(`Error importing key ${key}:`, e);
        }
      }
    }
    
    console.log(`Data imported successfully: ${importedKeyCount} keys restored`);
    window.dispatchEvent(new Event('storage'));
    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
};
