
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PartyLedger from './pages/PartyLedger';
import Ledger from './pages/Ledger';

const RouterComponent: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/party-ledger" element={<PartyLedger />} />
      <Route path="/ledger" element={<Ledger />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default RouterComponent;
