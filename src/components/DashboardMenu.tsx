
import React from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingBag,
  ShoppingCart, 
  PackageOpen, 
  Wallet,
  Receipt,
  BookOpen,
  Users,
  Settings,
  CreditCard
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  to: string;
  description: string;
  color: string;
}

const MenuItem = ({ icon, title, to, description, color }: MenuItemProps) => {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Link to={to} className="flex-1 min-w-[150px] group">
          <div className={`menu-card transition-all duration-300 bg-white hover:bg-${color}/10 border border-gray-200 hover:border-${color} rounded-lg p-4 shadow-sm hover:shadow-lg flex flex-col items-center gap-3 h-full`}>
            <div className={`menu-card-icon text-${color} transition-transform group-hover:scale-110 group-hover:-translate-y-1`}>
              {icon}
            </div>
            <span className={`menu-card-text font-medium text-lg text-gray-800 group-hover:text-${color}`}>{title}</span>
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const DashboardMenu = () => {
  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 mt-6">
        {/* First row - 4 buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <MenuItem 
            icon={<ShoppingCart size={56} />} 
            title="Sales" 
            to="/sales" 
            description="Manage your sales transactions"
            color="ag-orange"
          />
          <MenuItem 
            icon={<ShoppingBag size={56} />} 
            title="Purchase" 
            to="/purchases" 
            description="Record and track your purchases"
            color="ag-green"
          />
          <MenuItem 
            icon={<PackageOpen size={56} />} 
            title="Stock" 
            to="/inventory" 
            description="View and manage your inventory"
            color="ag-brown"
          />
          <MenuItem 
            icon={<Receipt size={56} />} 
            title="Receipts" 
            to="/receipts" 
            description="Manage payment receipts"
            color="ag-orange-dark"
          />
        </div>
        
        {/* Second row - 4 buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MenuItem 
            icon={<Wallet size={56} />} 
            title="Payments" 
            to="/payments" 
            description="Manage outgoing payments"
            color="ag-green-dark"
          />
          <MenuItem 
            icon={<BookOpen size={56} />} 
            title="Ledger" 
            to="/ledger" 
            description="View account records and balances"
            color="ag-brown-dark"
          />
          <MenuItem 
            icon={<CreditCard size={56} />} 
            title="Cash Book" 
            to="/cashbook" 
            description="Manage cash transactions"
            color="ag-green-light"
          />
          <MenuItem 
            icon={<Settings size={56} />} 
            title="Master" 
            to="/master" 
            description="Configure business settings"
            color="ag-brown-light"
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default DashboardMenu;
