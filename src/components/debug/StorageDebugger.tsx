
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
    getTotalEntries,
  } = useStorageDebug();

  const handleExport = () => {
    try {
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
        
        toast.success("Data backup exported successfully");
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error("Error creating data backup");
    }
  };

  const handleImport = () => {
    try {
      if (!importData.trim()) {
        toast.error("Please paste backup data first");
        return;
      }
      
      if (window.confirm('Importing data will replace all existing data. Continue?')) {
        const success = importDataBackup(importData);
        
        if (success) {
          toast.success("Data imported successfully");
          handleDebugClick();
        } else {
          toast.error("Error importing data: Invalid format");
        }
      }
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error("Error importing data: Invalid JSON");
    }
  };

  const proceedWithDataClear = (shouldBackup: boolean) => {
    if (shouldBackup) {
      handleExport();
    }
    localStorage.clear();
    handleDebugClick();
    toast.success("All data cleared");
    setShowBackupConfirm(false);
  };

  const filteredStorageData = useMemo(() => {
    try {
      if ((!searchTerm.trim() && filterType === 'all') || !storageData) {
        return storageData;
      }

      const data = JSON.parse(storageData);
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
      return storageData;
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
      <Dialog onOpenChange={(open) => { if (open) handleDebugClick(); }}>
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
                onSearchChange={setSearchTerm}
                filterType={filterType}
                onFilterChange={setFilterType}
                onClearData={() => setShowBackupConfirm(true)}
                storageData={filteredStorageData}
                storageStats={storageStats}
                onKeySelect={(key) => {
                  setSearchTerm(key);
                  setFilterType('all');
                }}
              />
            </TabsContent>
            
            <TabsContent value="export" className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                Export a backup of all application data. This file can be used to restore your data later.
              </div>
              <Button onClick={handleExport} className="flex gap-2 items-center">
                <Database className="h-4 w-4" />
                Download Backup
              </Button>
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="text-sm font-medium">Backup includes:</p>
                <ul className="text-sm mt-2 list-disc pl-5 space-y-1">
                  <li>Master data (Agents, Suppliers, Customers, etc.)</li>
                  <li>Transactions (Purchases, Sales, etc.)</li>
                  <li>Configuration settings</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="import" className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                Paste a previously exported backup to restore your data. This will replace all existing data.
              </div>
              <textarea
                className="w-full h-[300px] p-4 border rounded-md resize-none focus:outline-none"
                placeholder="Paste your backup JSON data here..."
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
              />
              <Button 
                onClick={handleImport}
                className="flex gap-2 items-center"
                disabled={!importData.trim()}
              >
                <Database className="h-4 w-4" />
                Import Data
              </Button>
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
