
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

import '@/App.css';

const App = () => {
  const [showOpeningBalanceSetup, setShowOpeningBalanceSetup] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Check online/offline status
  useEffect(() => {
    const handleOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      // Show toast notification when connection status changes
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
    
    // Set initial state
    setIsOnline(navigator.onLine);
    
    // Listen for online/offline events
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);
  
  useEffect(() => {
    // Initialize financial years
    initializeFinancialYears();
    
    // Check if opening balances need to be set up
    const activeYear = getActiveFinancialYear();
    if (activeYear && !activeYear.isSetup) {
      const openingBalances = getOpeningBalances(activeYear.id);
      if (!openingBalances) {
        // Opening balances not set for this year
        setShowOpeningBalanceSetup(true);
      }
    }
    
    // Auto-maintenance - run system checks periodically
    const autoMaintenanceInterval = setInterval(() => {
      try {
        // Check if local storage is available
        if (typeof localStorage === 'undefined') {
          console.error('LocalStorage not available');
          return;
        }
        
        // Verify essential data structures
        if (!localStorage.getItem('financialYears')) {
          initializeFinancialYears();
          console.log('Auto-maintenance: Re-initialized financial years');
        }
        
        // Check for and repair data consistency issues
        const checkDataConsistency = () => {
          try {
            // Add any data consistency checks here
            
            // Example: Verify the active year exists
            const activeYear = getActiveFinancialYear();
            if (!activeYear) {
              initializeFinancialYears();
              console.log('Auto-maintenance: Fixed missing active year');
            }
          } catch (error) {
            console.error('Error in data consistency check:', error);
          }
        };
        
        checkDataConsistency();
      } catch (error) {
        console.error('Error during auto-maintenance:', error);
      }
    }, 60000); // Run every minute
    
    return () => {
      clearInterval(autoMaintenanceInterval);
    };
  }, []);

  return (
    <ErrorBoundary>
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
          <div className="fixed bottom-4 right-4 bg-red-600 text-white px-3 py-2 rounded shadow-lg z-[1000]">
            You are offline
          </div>
        )}
      </Router>
    </ErrorBoundary>
  );
};

export default App;
