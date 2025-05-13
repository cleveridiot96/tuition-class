
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";
import Index from '@/pages/Index';
import Home from '@/pages/Home';
import Agents from '@/pages/Agents';
import Calculator from '@/pages/Calculator';
import CashBook from '@/pages/CashBook';
import Inventory from '@/pages/Inventory';
import Ledger from '@/pages/Ledger';
import Master from '@/pages/Master';
import Masters from '@/pages/Masters'; // Redirects to Master
import Payments from '@/pages/Payments';
import Purchases from '@/pages/Purchases';
import Receipts from '@/pages/Receipts';
import Reports from '@/pages/Reports';
import Sales from '@/pages/Sales';
import Settings from '@/pages/Settings';
import Stock from '@/pages/Stock';
import Transport from '@/pages/Transport';
import NotFound from '@/pages/NotFound';
import LocationTransferPage from '@/pages/location-transfer/LocationTransferPage';
import Dashboard from '@/pages/Dashboard';
import RippleProvider from '@/components/RippleProvider';
import { optimizedStorage } from '@/services/core/storage-core';
import { usePortableApp } from '@/hooks/usePortableApp';
import './App.css';

const App = () => {
  const { isPortableMode } = usePortableApp();
  
  // Initialize storage on app load
  useEffect(() => {
    optimizedStorage.get('locations');
    optimizedStorage.get('customers');
    optimizedStorage.get('suppliers');
    optimizedStorage.get('brokers');
    optimizedStorage.get('agents');
    optimizedStorage.get('transporters');
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <RippleProvider>
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/cash-book" element={<CashBook />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/location-transfer" element={<LocationTransferPage />} />
            <Route path="/ledger" element={<Ledger />} />
            <Route path="/master" element={<Master />} />
            <Route path="/masters" element={<Masters />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/receipts" element={<Receipts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </RippleProvider>
      <Toaster />
    </div>
  );
};

export default App;
