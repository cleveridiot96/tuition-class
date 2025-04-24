
import React, { useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { exportDataBackup, importDataBackup } from '@/services/storageService';
import { useStorageDebug } from '@/hooks/useStorageDebug';
import { BackupConfirmDialog } from './BackupConfirmDialog';
import { StorageDataView } from './StorageDataView';

export function StorageDebugger() {
  const {
    storageData,
    importData,
    setImportData,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    showBackupConfirm,
    setShowBackupConfirm,
    storageStats,
    handleDebugClick,
    getTotalEntries
  } = useStorageDebug();

  const handleExport = () => {
    try {
      toast.info("Preparing data backup...");
      const backup = exportDataBackup();
      if (backup) {
        const blob = new Blob([backup], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success("Data backup exported successfully", {
          description: "Your backup file has been downloaded."
        });
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error("Error creating data backup", {
        description: "Please try again or check console for details."
      });
    }
  };

  const handleImport = () => {
    try {
      if (!importData.trim()) {
        toast.error("Please paste backup data first", {
          description: "The import data field cannot be empty."
        });
        return;
      }
      
      toast.info("Importing data...");
      
      if (window.confirm('Importing data will replace all existing data. Continue?')) {
        const success = importDataBackup(importData);
        
        if (success) {
          toast.success("Data imported successfully", {
            description: "Your data has been restored from the backup."
          });
          handleDebugClick();
        } else {
          toast.error("Error importing data: Invalid format", {
            description: "The imported data does not match the expected format."
          });
        }
      }
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error("Error importing data: Invalid JSON", {
        description: "Please check the data format and try again."
      });
    }
  };

  const proceedWithDataClear = (shouldBackup: boolean) => {
    if (shouldBackup) {
      handleExport();
    }
    localStorage.clear();
    handleDebugClick();
    toast.success("All data cleared", {
      description: "Your application data has been deleted."
    });
    setShowBackupConfirm(false);
  };

  const filteredStorageData = useMemo(() => {
    try {
      if ((!searchTerm.trim() && filterType === 'all') || !storageData) {
        return JSON.stringify(storageData, null, 2);
      }

      const data = storageData;
      const filteredData: Record<string, any> = {};
      
      Object.keys(data).forEach(key => {
        if (filterType !== 'all') {
          if (filterType === 'master' && !isMasterData(key)) return;
          if (filterType === 'transaction' && !isTransactionData(key)) return;
          if (filterType === 'settings' && !isSettingsData(key)) return;
        }
        
        if (searchTerm.trim() && !key.toLowerCase().includes(searchTerm.toLowerCase())) {
          return;
        }
        
        filteredData[key] = data[key];
      });
      
      return JSON.stringify(filteredData, null, 2);
    } catch (e) {
      return JSON.stringify(storageData, null, 2);
    }
  }, [storageData, searchTerm, filterType]);

  // Helper functions to categorize data
  const isMasterData = (key: string): boolean => {
    return ['agents', 'customers', 'suppliers', 'brokers', 'transporters', 'locations'].includes(key);
  };
  
  const isTransactionData = (key: string): boolean => {
    return ['purchases', 'sales', 'payments', 'receipts', 'inventory'].some(prefix => 
      key === prefix || key.startsWith(`${prefix}_`)
    );
  };
  
  const isSettingsData = (key: string): boolean => {
    return ['currentFinancialYear', 'settings', 'user'].some(prefix => key.startsWith(prefix));
  };

  return (
    <>
      <Dialog onOpenChange={(open) => { 
        if (open) {
          handleDebugClick();
          toast.info("Storage Manager opened", {
            description: "Manage your application data"
          });
        }
      }}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="flex gap-2 items-center"
          >
            <Database className="h-4 w-4" />
            Storage Manager
            {getTotalEntries() > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {getTotalEntries()} entries
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Storage Manager</DialogTitle>
            <DialogDescription>
              View, export, import and manage application data
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="view">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="view">View Data</TabsTrigger>
              <TabsTrigger value="export">Export Data</TabsTrigger>
              <TabsTrigger value="import">Import Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="view">
              <StorageDataView
                searchTerm={searchTerm}
                onSearchChange={(val) => {
                  setSearchTerm(val);
                  if (val) {
                    toast.info(`Filtering storage by "${val}"`);
                  }
                }}
                filterType={filterType}
                onFilterChange={(val) => {
                  setFilterType(val);
                  toast.info(`Showing ${val} data`);
                }}
                onClearData={() => {
                  setShowBackupConfirm(true);
                  toast.warning("You're about to clear all data", {
                    description: "Consider making a backup first"
                  });
                }}
                storageData={filteredStorageData}
                storageStats={storageStats}
                onKeySelect={(key) => {
                  setSearchTerm(key);
                  setFilterType('all');
                  toast.info(`Selected "${key}" from storage`);
                }}
              />
            </TabsContent>
            
            <TabsContent value="export" className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-md">
                <h3 className="font-medium text-lg mb-2">Export Your Data</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Create a backup of all your application data. This file can be used to restore your data later.
                </p>
                <Button onClick={handleExport} className="w-full">
                  Download Backup File
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="import" className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-md">
                <h3 className="font-medium text-lg mb-2">Import Data from Backup</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Paste the contents of a previously exported backup file below to restore your data.
                </p>
                <textarea
                  className="w-full h-48 p-2 border rounded-md font-mono text-sm"
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste your backup data here..."
                />
                <div className="flex justify-end mt-2">
                  <Button onClick={handleImport} variant="destructive" className="mt-2">
                    Import & Restore
                  </Button>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md text-sm text-yellow-800">
                <span className="font-semibold">Warning:</span> Importing will override all existing data in the application.
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      <BackupConfirmDialog
        open={showBackupConfirm}
        onOpenChange={setShowBackupConfirm}
        onConfirm={proceedWithDataClear}
      />
    </>
  );
}
