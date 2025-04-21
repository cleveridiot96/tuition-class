
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import DashboardSummary from '@/components/DashboardSummary';
import DashboardMenu from '@/components/DashboardMenu';
import { FormatDataHandler } from '@/components/dashboard/FormatDataHandler';
import { Menu, Package, TrendingUp, Truck, Navigation as LocationIcon, Repeat } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

const menuItems = [
  {
    category: "Master Data",
    icon: <Menu className="h-5 w-5" />,
    items: [
      { id: "master", label: "Master", description: "Manage suppliers, customers", route: "/master" }
    ]
  },
  {
    category: "Transactions",
    icon: <TrendingUp className="h-5 w-5" />,
    items: [
      { id: "purchases", label: "Purchases", description: "Record and manage purchases", route: "/purchases" },
      { id: "sales", label: "Sales", description: "Record and manage sales", route: "/sales" },
      { id: "payments", label: "Payments", description: "Record payments made", route: "/payments" },
      { id: "receipts", label: "Receipts", description: "Record receipts received", route: "/receipts" },
      { id: "cashbook", label: "Cash Book", description: "View cash transactions", route: "/cash-book" }
    ]
  },
  {
    category: "Inventory",
    icon: <Package className="h-5 w-5" />,
    items: [
      { id: "inventory", label: "Inventory", description: "Manage your inventory", route: "/inventory" },
      { id: "stock", label: "Stock Report", description: "Generate stock reports", route: "/stock" },
      { id: "locationTransfer", label: "Location Transfer", description: "Transfer inventory between locations", route: "/location-transfer" }
    ]
  },
  {
    category: "Transport",
    icon: <Truck className="h-5 w-5" />,
    items: [
      { id: "transport", label: "Transport", description: "Manage transportation", route: "/transport" }
    ]
  },
  {
    category: "Other",
    icon: <LocationIcon className="h-5 w-5" />,
    items: [
      { id: "ledger", label: "Ledger", description: "View account ledgers", route: "/ledger" },
      { id: "agents", label: "Agents", description: "Manage agents", route: "/agents" },
      { id: "calculator", label: "Calculator", description: "Simple calculator", route: "/calculator" }
    ]
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [showFormatter, setShowFormatter] = useState(false);
  // Fetch dashboard data
  const { summaryData } = useDashboardData();

  const handleFormatClick = () => {
    setShowFormatter(true);
    return true; // Indicate that we're handling the format click
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="KKS - Kisan Khata Sahayak" showFormatButton onFormatClick={handleFormatClick} />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Kisan Khata Sahayak</h1>
        
        <DashboardSummary summaryData={summaryData} />
        
        <div className="mt-8">
          <DashboardMenu 
            items={menuItems} 
            onItemClick={(route) => navigate(route)} 
          />
        </div>
        
        {showFormatter && (
          <FormatDataHandler onClose={() => setShowFormatter(false)} />
        )}
      </div>
    </div>
  );
};

export default Index;
