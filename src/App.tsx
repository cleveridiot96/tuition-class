import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Purchases from '@/pages/Purchases';
import Sales from '@/pages/Sales';
import Inventory from '@/pages/Inventory';
import Master from '@/pages/Master';
import Agents from '@/pages/Agents';
import Payments from '@/pages/Payments';
import Receipts from '@/pages/Receipts';
import NotFound from '@/pages/NotFound';
import CashBook from '@/pages/CashBook';
import Stock from '@/pages/Stock';
import Ledger from '@/pages/Ledger';
import OpeningBalanceSetup from '@/components/OpeningBalanceSetup';
import { initializeFinancialYears, getActiveFinancialYear, getOpeningBalances } from '@/services/financialYearService';
import ErrorBoundary from '@/components/ErrorBoundary';
import { toast } from '@/hooks/use-toast';
import { performAutoSave, checkAndRestoreAutoSave } from '@/services/storageService';
import { checkDataIntegrity, performSystemHealthCheck } from '@/utils/health/systemHealth';

import '@/App.css';

const App = () => {
  const [showOpeningBalanceSetup, setShowOpeningBalanceSetup] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showRecoveryPrompt, setShowRecoveryPrompt] = useState(false);
  const [recoveryTimestamp, setRecoveryTimestamp] = useState<Date | null>(null);

  useEffect(() => {
    const autoSaveData = checkAndRestoreAutoSave();
    if (autoSaveData.available) {
      setShowRecoveryPrompt(true);
      setRecoveryTimestamp(autoSaveData.timestamp);
    }
  }, []);

  useEffect(() => {
    const handleOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (online) {
        toast({
          title: "You're back online",
          description: "Internet connection has been restored",
        });
      } else {
        toast({
          title: "You're offline",
          description: "Check your internet connection",
          variant: "destructive",
        });
      }
    };
    
    setIsOnline(navigator.onLine);
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        performAutoSave();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const autoSaveInterval = setInterval(() => {
      performAutoSave();
    }, 5 * 60 * 1000);
    
    const setupUsbEvent = () => {
      if ('usb' in navigator) {
        const usbNavigator = navigator as unknown as { 
          usb: { 
            addEventListener: (event: string, callback: () => void) => void 
          } 
        };
        
        usbNavigator.usb.addEventListener('disconnect', () => {
          console.log("USB device disconnected - running auto-save");
          performAutoSave();
          toast({
            title: "USB Device Disconnected",
            description: "Your data has been automatically backed up",
          });
        });
      }
    };
    
    try {
      setupUsbEvent();
    } catch (e) {
      console.log("USB event setup not supported");
    }
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(autoSaveInterval);
    };
  }, []);
  
  useEffect(() => {
    initializeFinancialYears();
    
    const activeYear = getActiveFinancialYear();
    if (activeYear && !activeYear.isSetup) {
      const openingBalances = getOpeningBalances(activeYear.id);
      if (!openingBalances) {
        setShowOpeningBalanceSetup(true);
      }
    }
    
    const autoMaintenanceInterval = setInterval(() => {
      try {
        if (typeof localStorage === 'undefined') {
          console.error('LocalStorage not available');
          return;
        }
        
        if (!localStorage.getItem('financialYears')) {
          initializeFinancialYears();
          console.log('Auto-maintenance: Re-initialized financial years');
        }
        
        const checkDataConsistency = () => {
          try {
            if (!localStorage.getItem('financialYears')) {
              initializeFinancialYears();
              console.log('Auto-maintenance: Re-initialized financial years');
            }
            
            const activeYear = getActiveFinancialYear();
            if (!activeYear) {
              initializeFinancialYears();
              console.log('Auto-maintenance: Fixed missing active year');
            }
            
            const healthCheck = performSystemHealthCheck();
            if (healthCheck && !healthCheck.dataIntegrity) {
              console.warn('Data integrity issues detected, creating backup');
              performAutoSave();
            }
            
            if (healthCheck && healthCheck.storageUsage > 0.8 * healthCheck.storageLimit) {
              toast({
                title: "Storage Warning",
                description: "App data is reaching storage limits. Consider exporting old data.",
                variant: "destructive",
              });
            }
          } catch (error) {
            console.error('Error in data consistency check:', error);
          }
        };
        
        checkDataConsistency();
      } catch (error) {
        console.error('Error during auto-maintenance:', error);
      }
    }, 60000);
    
    return () => {
      clearInterval(autoMaintenanceInterval);
    };
  }, []);

  function handleRecoveryRestore() {
    const autoSaveData = checkAndRestoreAutoSave();
    if (autoSaveData.available && autoSaveData.restore) {
      const success = autoSaveData.restore();
      if (success) {
        toast({
          title: "Data Restored Successfully",
          description: "Your data has been restored from auto-save backup",
        });
        
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast({
          title: "Restore Failed",
          description: "Failed to restore data from auto-save",
          variant: "destructive",
        });
      }
    }
    setShowRecoveryPrompt(false);
  }

  return (
    <ErrorBoundary>
      {showRecoveryPrompt && recoveryTimestamp && (
        <div className="fixed top-0 left-0 w-full bg-yellow-50 border-b border-yellow-200 p-4 z-50 flex justify-between items-center">
          <div>
            <h3 className="font-medium">Unsaved Data Detected</h3>
            <p className="text-sm text-gray-600">
              Would you like to restore data from {recoveryTimestamp.toLocaleString()}?
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setShowRecoveryPrompt(false)}
            >
              Dismiss
            </button>
            <button 
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={handleRecoveryRestore}
            >
              Restore
            </button>
          </div>
        </div>
      )}
      
      <Router>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={
              <ErrorBoundary>
                <Index />
              </ErrorBoundary>
            } />
            <Route path="/purchases" element={
              <ErrorBoundary>
                <Purchases />
              </ErrorBoundary>
            } />
            <Route path="/sales" element={
              <ErrorBoundary>
                <Sales />
              </ErrorBoundary>
            } />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/master" element={<Master />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/receipts" element={<Receipts />} />
            <Route path="/cashbook" element={<CashBook />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/ledger" element={<Ledger />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<div className="p-4 bg-red-100 text-red-800 rounded-md">
          Toast system encountered an error. Please refresh the page.
        </div>}>
          <Toaster />
        </ErrorBoundary>
        
        <OpeningBalanceSetup 
          isOpen={showOpeningBalanceSetup} 
          onClose={() => setShowOpeningBalanceSetup(false)} 
        />

        {!isOnline && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white px-3 py-2 rounded shadow-lg z-[1000] ripple">
            You are offline
          </div>
        )}
      </Router>
    </ErrorBoundary>
  );
};

export default App;
