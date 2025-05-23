
// Re-export core storage functionality
export * from './core/storageCore';
export * from './core/yearSpecificStorage';

// Re-export data management functions from backupRestore
export {
  exportDataBackup,
  importDataBackup,
  completeFormatAllData,
  exportToExcel
} from './backup/backupRestore';

// Re-export debug functionality
export * from './debug/storageDebug';

// Re-export backup functionality
export { exportDataBackup as exportDataBackupAlternate } from './backup/exportBackup';
export { importDataBackup as importDataBackupAlternate } from './backup/importBackup';
