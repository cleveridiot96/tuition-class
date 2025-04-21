
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner"; // Use the sonner Toaster
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from '@/pages/Index';
import Agents from '@/pages/Agents';
import Calculator from '@/pages/Calculator';
import CashBook from '@/pages/CashBook';
import Inventory from '@/pages/Inventory';
import Ledger from '@/pages/Ledger';
import Master from '@/pages/Master';
import Payments from '@/pages/Payments';
import Purchases from '@/pages/Purchases';
import Receipts from '@/pages/Receipts';
import Sales from '@/pages/Sales';
import Stock from '@/pages/Stock';
import Transport from '@/pages/Transport';
import NotFound from '@/pages/NotFound';
import LocationTransferPage from '@/pages/location-transfer/LocationTransferPage';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/cash-book" element={<CashBook />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/location-transfer" element={<LocationTransferPage />} />
            <Route path="/ledger" element={<Ledger />} />
            <Route path="/master" element={<Master />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/receipts" element={<Receipts />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
