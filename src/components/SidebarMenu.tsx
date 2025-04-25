
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  User, 
  Users, 
  ShoppingBag, 
  Truck, 
  CalendarDays, 
  Calendar, 
  CircleDot,
  Settings,
  Menu,
  ShoppingBasket
} from "lucide-react";
import { Sheet } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  iconColor?: string;
  closeMenu: () => void;
}

const NavItem = ({ to, icon, label, iconColor, closeMenu }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      onClick={closeMenu}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive 
          ? "bg-gray-100 text-gray-900" 
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      <span className={`${iconColor || "text-gray-500"}`}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export function SidebarMenu() {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[240px] sm:w-[300px] bg-white p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-2xl">Menu</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col gap-1 p-4">
            <NavItem 
              to="/" 
              icon={<Settings className="h-5 w-5" />} 
              label="Dashboard" 
              closeMenu={handleClose} 
            />
            
            <NavItem 
              to="/masters" 
              icon={<User className="h-5 w-5" />} 
              label="Master Data" 
              iconColor="text-blue-500"
              closeMenu={handleClose} 
            />
            
            <NavItem 
              to="/customers" 
              icon={<Users className="h-5 w-5" />} 
              label="Customers" 
              iconColor="text-green-500"
              closeMenu={handleClose} 
            />
            
            <NavItem 
              to="/purchases" 
              icon={<ShoppingBag className="h-5 w-5" />} 
              label="Purchases" 
              iconColor="text-purple-500"
              closeMenu={handleClose} 
            />
            
            <NavItem 
              to="/sales" 
              icon={<ShoppingBasket className="h-5 w-5" />} 
              label="Sales" 
              iconColor="text-amber-500"
              closeMenu={handleClose} 
            />
            
            <NavItem 
              to="/transport" 
              icon={<Truck className="h-5 w-5" />} 
              label="Transport" 
              iconColor="text-rose-500"
              closeMenu={handleClose} 
            />
            
            <NavItem 
              to="/inventory" 
              icon={<Calendar className="h-5 w-5" />} 
              label="Inventory" 
              iconColor="text-indigo-500"
              closeMenu={handleClose} 
            />
            
            <NavItem 
              to="/party-ledger" 
              icon={<CircleDot className="h-5 w-5" />} 
              label="Party Ledger" 
              iconColor="text-pink-500"
              closeMenu={handleClose} 
            />
            
            <NavItem 
              to="/daily-book" 
              icon={<CalendarDays className="h-5 w-5" />} 
              label="Daily Book" 
              iconColor="text-indigo-500"
              closeMenu={handleClose} 
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
