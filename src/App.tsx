
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Purchases from '@/pages/Purchases';
import Sales from '@/pages/Sales';
import Inventory from '@/pages/Inventory';
import Transport from '@/pages/Transport';
import Master from '@/pages/Master';
import Agents from '@/pages/Agents';
import Payments from '@/pages/Payments';
import Receipts from '@/pages/Receipts';
import NotFound from '@/pages/NotFound';
import CashBook from '@/pages/CashBook';
import Stock from '@/pages/Stock';
import Ledger from '@/pages/Ledger';

import '@/App.css';

function App() {
  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/master" element={<Master />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/cashbook" element={<CashBook />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/calculator" element={<Stock />} /> {/* Adding this to redirect calculator to the Stock page that has the calculator */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </React.Fragment>
  );
}

export default App;
