
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, FileText, FileBarChart, Package, RefreshCcw, ArrowLeftRight, Users, DollarSign, BookText } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const menuItems = [
  {
    title: 'Purchases',
    path: '/purchases',
    icon: Box,
    description: 'Record and manage purchases',
    color: 'from-blue-400 to-blue-500',
  },
  {
    title: 'Sales',
    path: '/sales',
    icon: FileBarChart,
    description: 'Create and manage sales',
    color: 'from-green-400 to-green-500',
  },
  {
    title: 'Inventory',
    path: '/inventory',
    icon: Package,
    description: 'View and manage stock',
    color: 'from-yellow-400 to-yellow-500',
  },
  {
    title: 'Stock Report',
    path: '/stock',
    icon: Box,
    description: 'Real-time stock analysis',
    color: 'from-orange-400 to-orange-500',
  },
  {
    title: 'Location Transfer',
    path: '/location-transfer',
    icon: RefreshCcw,
    description: 'Transfer stock between locations',
    color: 'from-purple-400 to-purple-500',
  },
  {
    title: 'Payments',
    path: '/payments',
    icon: ArrowLeftRight,
    description: 'Record outgoing payments',
    color: 'from-red-400 to-red-500',
  },
  {
    title: 'Receipts',
    path: '/receipts',
    icon: FileText,
    description: 'Manage incoming payments',
    color: 'from-lime-400 to-lime-500',
  },
  {
    title: 'Master Data',
    path: '/master',
    icon: Users,
    description: 'Manage people & companies',
    color: 'from-indigo-400 to-indigo-500',
  },
  {
    title: 'Cash Book',
    path: '/cash-book',
    icon: DollarSign,
    description: 'Track cash transactions',
    color: 'from-pink-400 to-pink-500',
  },
  {
    title: 'Party Ledger',
    path: '/ledger',
    icon: BookText,
    description: 'View party balances',
    color: 'from-gray-400 to-gray-500',
  },
];

const DashboardMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {menuItems.map((item) => (
        <Button
          key={item.title}
          variant="card"
          className={`md-ripple card-hover flex flex-col justify-center items-center h-28 bg-gradient-to-br ${item.color} hover:shadow-lg text-white`}
          onClick={() => navigate(item.path)}
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
