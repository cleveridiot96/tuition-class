
import React from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingCart, 
  PackageOpen, 
  Truck, 
  ShoppingBag,
  Wallet,
  Users,
  BookOpen,
  Settings
} from "lucide-react";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  to: string;
}

const MenuItem = ({ icon, title, to }: MenuItemProps) => {
  return (
    <Link to={to} className="w-full sm:w-1/2 md:w-1/3 p-4">
      <div className="menu-card">
        <div className="menu-card-icon">
          {icon}
        </div>
        <span className="menu-card-text">{title}</span>
      </div>
    </Link>
  );
};

const DashboardMenu = () => {
  return (
    <div className="flex flex-wrap justify-center mt-6">
      <div className="w-full flex justify-center mb-4">
        <div className="grid grid-cols-2 w-full max-w-2xl gap-4">
          <MenuItem 
            icon={<ShoppingCart size={56} />} 
            title="खरीदी (Purchase)" 
            to="/purchases" 
          />
          <MenuItem 
            icon={<ShoppingBag size={56} />} 
            title="बिक्री (Sales)" 
            to="/sales" 
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-center w-full">
        <MenuItem 
          icon={<PackageOpen size={56} />} 
          title="स्टॉक (Inventory)" 
          to="/inventory" 
        />
        <MenuItem 
          icon={<Truck size={56} />} 
          title="ट्रांसपोर्ट (Transport)" 
          to="/transport" 
        />
        <MenuItem 
          icon={<Wallet size={56} />} 
          title="भुगतान (Payments)" 
          to="/payments" 
        />
        <MenuItem 
          icon={<Users size={56} />} 
          title="एजेंट्स (Agents)" 
          to="/agents" 
        />
        <MenuItem 
          icon={<BookOpen size={56} />} 
          title="लेजर (Ledger)" 
          to="/ledger" 
        />
        <MenuItem 
          icon={<Settings size={56} />} 
          title="मास्टर (Master)" 
          to="/master" 
        />
      </div>
    </div>
  );
};

export default DashboardMenu;
