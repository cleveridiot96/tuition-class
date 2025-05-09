
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { MasterDialogProvider } from "@/contexts/MasterDialogContext";

// Import your pages
import Home from "@/pages/Home";
import Purchases from "@/pages/Purchases";
import Sales from "@/pages/Sales";
import Inventory from "@/pages/Inventory";
import Masters from "@/pages/Masters";
import Settings from "@/pages/Settings";
import Reports from "@/pages/Reports";
import Dashboard from "@/pages/Dashboard";

const App = () => {
  return (
    <MasterDialogProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/masters" element={<Masters />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </MasterDialogProvider>
  );
};

export default App;
