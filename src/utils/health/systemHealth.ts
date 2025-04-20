
export const checkDataIntegrity = (): boolean => {
  try {
    const essentialKeys = [
      'locations',
      'currentFinancialYear',
      'financialYears'
    ];
    
    const missingKeys = essentialKeys.filter(key => !localStorage.getItem(key));
    
    if (missingKeys.length > 0) {
      console.error(`Data integrity check failed: Missing keys - ${missingKeys.join(', ')}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking data integrity:", error);
    return false;
  }
};

export const performSystemHealthCheck = () => {
  try {
    const results = {
      storageAvailable: false,
      dataIntegrity: false,
      recoveryAvailable: false,
      storageUsage: 0,
      storageLimit: 0
    };
    
    results.storageAvailable = typeof localStorage !== 'undefined';
    results.dataIntegrity = checkDataIntegrity();
    results.recoveryAvailable = false;
    
    if (results.storageAvailable) {
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          totalSize += (localStorage.getItem(key) || '').length;
        }
      }
      
      results.storageUsage = totalSize;
      results.storageLimit = 5 * 1024 * 1024;
    }
    
    return results;
  } catch (error) {
    console.error("Error performing system health check:", error);
    return null;
  }
};
