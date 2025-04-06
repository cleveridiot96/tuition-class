
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Purchases from "./pages/Purchases";
import Inventory from "./pages/Inventory";
import Transport from "./pages/Transport";
import Sales from "./pages/Sales";
import Payments from "./pages/Payments";
import CashBook from "./pages/CashBook";
import Ledger from "./pages/Ledger";
import Master from "./pages/Master";
import Receipts from "./pages/Receipts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/cashbook" element={<CashBook />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/master" element={<Master />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
