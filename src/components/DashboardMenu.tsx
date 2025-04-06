
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
  Settings
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
  gujaratiDescription: string;
}

const MenuItem = ({ icon, title, to, description, gujaratiDescription }: MenuItemProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={to} className="flex-1 min-w-[150px]">
          <div className="menu-card">
            <div className="menu-card-icon">
              {icon}
            </div>
            <span className="menu-card-text">{title}</span>
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>{description}</p>
        <p className="text-sm text-muted-foreground">{gujaratiDescription}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const DashboardMenu = () => {
  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 mt-6">
        {/* First row - 4 buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <MenuItem 
            icon={<ShoppingCart size={56} />} 
            title="Sales" 
            to="/sales" 
            description="Manage your sales transactions"
            gujaratiDescription="તમારા વેચાણ વ્યવહારોનું સંચાલન કરો"
          />
          <MenuItem 
            icon={<ShoppingBag size={56} />} 
            title="Purchase" 
            to="/purchases" 
            description="Record and track your purchases"
            gujaratiDescription="તમારી ખરીદીની નોંધ અને ટ્રૅક કરો"
          />
          <MenuItem 
            icon={<PackageOpen size={56} />} 
            title="Stock" 
            to="/inventory" 
            description="View and manage your inventory"
            gujaratiDescription="તમારા સ્ટોકનું નિરીક્ષણ અને સંચાલન કરો"
          />
          <MenuItem 
            icon={<Receipt size={56} />} 
            title="Receipts" 
            to="/receipts" 
            description="Manage payment receipts"
            gujaratiDescription="ચુકવણી રસીદોનું સંચાલન કરો"
          />
        </div>
        
        {/* Second row - 4 buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MenuItem 
            icon={<Wallet size={56} />} 
            title="Payments" 
            to="/payments" 
            description="Manage outgoing payments"
            gujaratiDescription="બહાર જતી ચુકવણીઓનું સંચાલન કરો"
          />
          <MenuItem 
            icon={<BookOpen size={56} />} 
            title="Ledger" 
            to="/ledger" 
            description="View account records and balances"
            gujaratiDescription="ખાતા રેકોર્ડ્સ અને બાકીઓ જુઓ"
          />
          <MenuItem 
            icon={<Users size={56} />} 
            title="Agents" 
            to="/agents" 
            description="Manage your business agents"
            gujaratiDescription="તમારા વ્યાપાર એજન્ટોનું સંચાલન કરો"
          />
          <MenuItem 
            icon={<Settings size={56} />} 
            title="Master" 
            to="/master" 
            description="Configure business settings"
            gujaratiDescription="વ્યાપાર સેટિંગ્સ કૉન્ફિગર કરો"
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default DashboardMenu;
