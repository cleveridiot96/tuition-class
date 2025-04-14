
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Purchases from '@/pages/Purchases';
import Sales from '@/pages/Sales';
import Inventory from '@/pages/Inventory';
import Agents from '@/pages/Agents';
import Customers from '@/pages/Customers';
import Suppliers from '@/pages/Suppliers';
import Brokers from '@/pages/Brokers';
import Transporters from '@/pages/Transporters';
import Settings from '@/pages/Settings';
import Reports from '@/pages/Reports';
import Payments from '@/pages/Payments';
import Receipts from '@/pages/Receipts';
import PurchaseDetail from '@/pages/PurchaseDetail';
import SaleDetail from '@/pages/SaleDetail';
import LedgerPage from '@/pages/LedgerPage';
import CashBook from '@/pages/CashBook';
import ExpensesPage from '@/pages/ExpensesPage';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { initBackgroundCompression, logStorageStats } from '@/utils/compressionUtils';

function App() {
  useEffect(() => {
    // Initialize compression system
    initBackgroundCompression();
    
    // Log storage stats on startup
    logStorageStats();
    
    // Log stats periodically
    const interval = setInterval(() => {
      logStorageStats();
    }, 30 * 60 * 1000); // every 30 minutes
    
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="kisan-khata-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/brokers" element={<Brokers />} />
          <Route path="/transporters" element={<Transporters />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/purchase/:id" element={<PurchaseDetail />} />
          <Route path="/sale/:id" element={<SaleDetail />} />
          <Route path="/ledger" element={<LedgerPage />} />
          <Route path="/cashbook" element={<CashBook />} />
          <Route path="/expenses" element={<ExpensesPage />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
