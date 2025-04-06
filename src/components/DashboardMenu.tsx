
import React from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingCart, 
  PackageOpen, 
  Truck, 
  ShoppingBag,
  Wallet,
  Users
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
      <MenuItem 
        icon={<ShoppingCart size={56} />} 
        title="खरीदी (Purchase)" 
        to="/purchases" 
      />
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
        icon={<ShoppingBag size={56} />} 
        title="बिक्री (Sales)" 
        to="/sales" 
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
    </div>
  );
};

export default DashboardMenu;
