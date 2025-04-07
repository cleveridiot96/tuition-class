
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
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
import { 
  addPurchase, 
  addSale, 
  addPayment, 
  addReceipt,
  addAgent, 
  addBroker, 
  addCustomer, 
  addTransporter,
  addInventoryItem,
  getPurchases,
  getInventory,
  getSales,
  clearAllData
} from "@/services/storageService";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    initializeDemoData();
    setIsLoading(false);
  }, []);

  const initializeDemoData = () => {
    const purchases = getPurchases();
    const existingSales = getSales();
    if (purchases.length > 0 && existingSales.length > 0) return;

    clearAllData();

    const arAgentId = "agent-001";
    const sudhaTransporterId = "transporter-001";
    const kanayaCustomerId = "customer-001";
    const anilBrokerId = "broker-001";
    const rbSonsCustomerId = "customer-002";
    const lbBrokerId = "broker-002";

    addAgent({
      id: arAgentId,
      name: "AR Agent",
      contactNumber: "9876543210",
      address: "Mumbai",
      balance: 0
    });

    addTransporter({
      id: sudhaTransporterId,
      name: "SUDHA",
      contactNumber: "8765432109",
      address: "Mumbai",
      balance: 0
    });

    addCustomer({
      id: kanayaCustomerId,
      name: "Kanaiya",
      contactNumber: "7654321098",
      address: "Mumbai",
      balance: 0
    });

    addBroker({
      id: anilBrokerId,
      name: "Anil",
      contactNumber: "6543210987",
      address: "Mumbai",
      commissionRate: 1,
      balance: 0
    });

    addCustomer({
      id: rbSonsCustomerId,
      name: "RB Sons",
      contactNumber: "5432109876",
      address: "Mumbai",
      balance: 0
    });

    addBroker({
      id: lbBrokerId,
      name: "LB",
      contactNumber: "4321098765",
      address: "Mumbai",
      commissionRate: 1,
      balance: 0
    });

    const purchaseDate = new Date().toISOString().split('T')[0];
    const purchaseId = "purchase-001";
    const lotNumber = "VK/33";

    const bagsQuantity = 33;
    const weightPerBag = 50;
    const ratePerKg = 300;
    const transportRatePerKg = 17;
    const totalWeight = bagsQuantity * weightPerBag;
    const totalAmountBeforeTransport = totalWeight * ratePerKg;
    const transportCost = totalWeight * transportRatePerKg;
    const totalPurchaseAmount = totalAmountBeforeTransport + transportCost;

    const purchase = {
      id: purchaseId,
      date: purchaseDate,
      lotNumber: lotNumber,
      quantity: bagsQuantity,
      agent: "AR Agent",
      agentId: arAgentId, 
      party: "AR Agent",
      partyId: arAgentId,
      location: "Mumbai",
      netWeight: totalWeight,
      rate: ratePerKg,
      transporter: "SUDHA",
      transporterId: sudhaTransporterId,
      transportRate: transportRatePerKg,
      transportCost: transportCost,
      totalAmount: totalAmountBeforeTransport,
      expenses: 0,
      totalAfterExpenses: totalPurchaseAmount,
      ratePerKgAfterExpenses: totalPurchaseAmount / totalWeight,
      notes: "Demo purchase of 33 bags from AR Agent"
    };
    
    addPurchase(purchase);
    
    addInventoryItem({
      id: `inv-${purchaseId}`,
      lotNumber: lotNumber,
      quantity: bagsQuantity,
      location: "Mumbai",
      dateAdded: purchaseDate,
      netWeight: totalWeight
    });

    const saleDate = purchaseDate;
    const saleId1 = "sale-001";
    const saleBagsQuantity1 = 3;
    const saleWeightPerBag = 50;
    const saleRatePerKg1 = 415;
    const saleTotalWeight1 = saleBagsQuantity1 * saleWeightPerBag;
    const saleTotalAmount1 = saleTotalWeight1 * saleRatePerKg1;
    
    const sale1 = {
      id: saleId1,
      date: saleDate,
      lotNumber: lotNumber,
      billNumber: "KA001",
      billAmount: saleTotalAmount1,
      customer: "Kanaiya",
      customerId: kanayaCustomerId,
      broker: "Anil",
      brokerId: anilBrokerId,
      quantity: saleBagsQuantity1,
      netWeight: saleTotalWeight1,
      rate: saleRatePerKg1,
      transporter: "Self",
      transporterId: "",
      transportRate: 0,
      transportCost: 0,
      totalAmount: saleTotalAmount1,
      netAmount: saleTotalAmount1,
      amount: saleTotalAmount1,
      location: "Mumbai", // Add the missing location property
      notes: "Demo sale of 3 bags to Kanaiya through broker Anil"
    };
    
    addSale(sale1);
    
    const receiptDate = purchaseDate;
    const brokerageRate = 0.01;
    const cashDiscountRate = 0.01;
    const brokerageAmount = saleTotalAmount1 * brokerageRate;
    const cashDiscountAmount = saleTotalAmount1 * cashDiscountRate;
    const receiptAmount = saleTotalAmount1 - brokerageAmount - cashDiscountAmount;
    
    addReceipt({
      id: `receipt-${saleId1}`,
      date: receiptDate,
      customer: "Anil (for Kanaiya)",
      customerId: anilBrokerId, 
      amount: receiptAmount,
      paymentMethod: "Cash",
      reference: `Sale ${saleId1}`,
      notes: `Receipt from Anil for Kanaiya sale. Deducted: ₹${brokerageAmount} (1% brokerage) and ₹${cashDiscountAmount} (1% cash discount)`
    });
    
    const paymentDate = purchaseDate;
    const paymentAmount = 50000;
    
    addPayment({
      id: `payment-${purchaseId}`,
      date: paymentDate,
      party: "AR Agent",
      partyId: arAgentId,
      amount: paymentAmount,
      paymentMethod: "Cash",
      reference: `Purchase ${purchaseId}`,
      notes: "Payment to AR Agent for lot VK/33"
    });
    
    const saleDate2 = purchaseDate;
    const saleId2 = "sale-002";
    const saleBagsQuantity2 = 2;
    const saleRatePerKg2 = 421;
    const saleTotalWeight2 = saleBagsQuantity2 * saleWeightPerBag;
    const saleTotalAmount2 = saleTotalWeight2 * saleRatePerKg2;
    const billAmount2 = 42100;
    
    const sale2 = {
      id: saleId2,
      date: saleDate2,
      lotNumber: lotNumber,
      billNumber: "YI/006/25-26",
      billAmount: billAmount2,
      customer: "RB Sons",
      customerId: rbSonsCustomerId,
      broker: "LB",
      brokerId: lbBrokerId,
      quantity: saleBagsQuantity2,
      netWeight: saleTotalWeight2,
      rate: saleRatePerKg2,
      transporter: "Self",
      transporterId: "",
      transportRate: 0,
      transportCost: 0,
      totalAmount: saleTotalAmount2,
      netAmount: billAmount2,
      amount: billAmount2,
      location: "Mumbai", // Add the missing location property
      notes: "Demo sale of 2 bags to RB Sons through broker LB"
    };
    
    addSale(sale2);
    
    console.log("Demo sales added:", getSales());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ag-beige">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-ag-green border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-lg font-medium text-ag-brown">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
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
};

export default App;
