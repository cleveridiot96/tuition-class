
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, FileText, FileBarChart, Package, RefreshCcw, ArrowLeftRight, Users, DollarSign, BookText } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Define consistent colors for the tiles
const TILE_COLORS = {
  purchases: 'from-purple-600 to-purple-700',
  sales: 'from-indigo-600 to-indigo-700',
  inventory: 'from-cyan-600 to-cyan-700',
  stock: 'from-orange-600 to-orange-700',
  locationTransfer: 'from-violet-600 to-violet-700',
  payments: 'from-red-600 to-red-700',
  receipts: 'from-lime-600 to-lime-700',
  master: 'from-blue-600 to-blue-700',
  cashBook: 'from-pink-600 to-pink-700',
  ledger: 'from-gray-600 to-gray-700',
};

export const menuItems = [
  {
    title: 'Purchases',
    path: '/purchases',
    icon: Box,
    description: 'Record and manage purchases',
    color: TILE_COLORS.purchases,
    type: 'purchases'
  },
  {
    title: 'Sales',
    path: '/sales',
    icon: FileBarChart,
    description: 'Create and manage sales',
    color: TILE_COLORS.sales,
    type: 'sales'
  },
  {
    title: 'Inventory',
    path: '/inventory',
    icon: Package,
    description: 'View and manage stock',
    color: TILE_COLORS.inventory,
    type: 'inventory'
  },
  {
    title: 'Stock Report',
    path: '/stock',
    icon: Box,
    description: 'Real-time stock analysis',
    color: TILE_COLORS.stock,
    type: 'stock'
  },
  {
    title: 'Location Transfer',
    path: '/location-transfer',
    icon: RefreshCcw,
    description: 'Transfer stock between locations',
    color: TILE_COLORS.locationTransfer,
    type: 'locationTransfer'
  },
  {
    title: 'Payments',
    path: '/payments',
    icon: ArrowLeftRight,
    description: 'Record outgoing payments',
    color: TILE_COLORS.payments,
    type: 'payments'
  },
  {
    title: 'Receipts',
    path: '/receipts',
    icon: FileText,
    description: 'Manage incoming payments',
    color: TILE_COLORS.receipts,
    type: 'receipts'
  },
  {
    title: 'Master Data',
    path: '/master',
    icon: Users,
    description: 'Manage people & companies',
    color: TILE_COLORS.master,
    type: 'master'
  },
  {
    title: 'Cash Book',
    path: '/cash-book',
    icon: DollarSign,
    description: 'Track cash transactions',
    color: TILE_COLORS.cashBook,
    type: 'cashBook'
  },
  {
    title: 'Party Ledger',
    path: '/ledger',
    icon: BookText,
    description: 'View party balances',
    color: TILE_COLORS.ledger,
    type: 'ledger'
  },
];

const DashboardMenu = () => {
  const navigate = useNavigate();

  // Store the page type when navigating for consistent colors
  const handleNavigation = (path: string, type: string) => {
    // Store in localStorage for persistence across page loads
    localStorage.setItem('currentPageType', type);
    navigate(path);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {menuItems.map((item) => (
        <Button
          key={item.title}
          variant="card"
          className={`md-ripple card-hover flex flex-col justify-center items-center h-28 bg-gradient-to-br ${item.color} hover:shadow-lg text-white`}
          onClick={() => handleNavigation(item.path, item.type)}
          data-type={item.type}
        >
          <item.icon size={24} className="mb-2" />
          <div className="text-base font-medium">{item.title}</div>
          <div className="text-xs opacity-80 text-center">{item.description}</div>
        </Button>
      ))}
    </div>
  );
};

export default DashboardMenu;
