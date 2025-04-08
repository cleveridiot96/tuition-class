
import React, { useEffect, useState } from 'react';
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
import Calculator from '@/pages/Calculator';
import OpeningBalanceSetup from '@/components/OpeningBalanceSetup';
import { initializeFinancialYears, getActiveFinancialYear, getOpeningBalances } from '@/services/financialYearService';

import '@/App.css';

function App() {
  const [showOpeningBalanceSetup, setShowOpeningBalanceSetup] = useState(false);

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
  }, []);

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
          <Route path="/calculator" element={<Calculator />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
      
      {/* Opening Balance Setup Dialog */}
      <OpeningBalanceSetup 
        isOpen={showOpeningBalanceSetup} 
        onClose={() => setShowOpeningBalanceSetup(false)} 
      />
    </React.Fragment>
  );
}

export default App;
