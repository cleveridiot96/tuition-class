
import Navigation from "@/components/Navigation";
import DashboardSummary from "@/components/DashboardSummary";
import { DashboardTile } from "@/components/DashboardTile";
import FormatDataHandler from "@/components/dashboard/FormatDataHandler";
import { useEffect, useState } from "react";
import { getSuppliers, getCustomers, getPurchases, getSales, getInventory } from "@/services/storageService";
import { User, Users, ShoppingBag, Truck, CalendarDays, Calendar, CircleDot, ShoppingBasket } from "lucide-react";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    suppliers: 0,
    customers: 0,
    purchases: 0,
    sales: 0,
    inventory: 0,
  });

  const loadDashboardData = () => {
    setDashboardData({
      suppliers: (getSuppliers() || []).filter(s => !s.isDeleted).length,
      customers: (getCustomers() || []).filter(c => !c.isDeleted).length,
      purchases: (getPurchases() || []).filter(p => !p.isDeleted).length,
      sales: (getSales() || []).filter(s => !s.isDeleted).length,
      inventory: (getInventory() || []).filter(i => i.remainingQuantity > 0 && !i.isDeleted).length,
    });
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <Navigation title="Dashboard" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <DashboardSummary />
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quick Access</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <DashboardTile
              title="Suppliers"
              icon={User}
              link="/masters?tab=supplier"
              count={dashboardData.suppliers}
              color="blue"
            />
            
            <DashboardTile
              title="Customers"
              icon={Users}
              link="/masters?tab=customer"
              count={dashboardData.customers}
              color="green"
            />
            
            <DashboardTile
              title="Purchases"
              icon={ShoppingBag}
              link="/purchases"
              count={dashboardData.purchases}
              color="purple"
            />
            
            <DashboardTile
              title="Sales"
              icon={ShoppingBasket}
              link="/sales"
              count={dashboardData.sales}
              color="amber"
            />
            
            <DashboardTile
              title="Transport"
              icon={Truck}
              link="/masters?tab=transporter"
              color="rose"
            />
            
            <DashboardTile
              title="Inventory"
              icon={Calendar}
              link="/inventory"
              count={dashboardData.inventory}
              color="indigo"
            />
            
            <DashboardTile
              title="Party Ledger"
              icon={CircleDot}
              link="/party-ledger"
              color="pink"
              description="View party transactions"
            />
            
            <DashboardTile
              title="Daily Book"
              icon={CalendarDays}
              link="/daily-book"
              color="indigo"
            />
          </div>
        </div>
        
        <div className="mt-8">
          <FormatDataHandler onFormatComplete={loadDashboardData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
