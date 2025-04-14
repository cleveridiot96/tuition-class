
import React from "react";
import { Navigate } from "react-router-dom";

// This is just a redirect component to the existing Ledger page
const LedgerPage = () => {
  return <Navigate to="/ledger" replace />;
};

export default LedgerPage;
