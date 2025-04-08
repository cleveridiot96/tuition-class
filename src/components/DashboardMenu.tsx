
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart3, 
  BookText, 
  Briefcase, 
  Calculator, 
  CircleDollarSign, 
  ClipboardList, 
  FileSpreadsheet, 
  Package,
  ReceiptText, 
  ShoppingBag, 
  Truck, 
  Users2, 
  Warehouse
} from "lucide-react";

const DashboardMenu = () => {
  const menuItems = [
    {
      title: "Purchases",
      icon: <ShoppingBag className="w-6 h-6 mb-2 text-blue-600" />,
      link: "/purchases",
      description: "Record and manage purchases",
    },
    {
      title: "Sales",
      icon: <BarChart3 className="w-6 h-6 mb-2 text-green-600" />,
      link: "/sales",
      description: "Create and manage sales",
    },
    {
      title: "Inventory",
      icon: <Warehouse className="w-6 h-6 mb-2 text-amber-600" />,
      link: "/inventory",
      description: "View and manage stock",
    },
    {
      title: "Stock Report",
      icon: <Package className="w-6 h-6 mb-2 text-orange-600" />,
      link: "/stock",
      description: "Real-time stock analysis",
    },
    {
      title: "Payments",
      icon: <CircleDollarSign className="w-6 h-6 mb-2 text-red-600" />,
      link: "/payments",
      description: "Record outgoing payments",
    },
    {
      title: "Receipts",
      icon: <ReceiptText className="w-6 h-6 mb-2 text-green-600" />,
      link: "/receipts",
      description: "Manage incoming payments",
    },
    {
      title: "Transport",
      icon: <Truck className="w-6 h-6 mb-2 text-blue-600" />,
      link: "/transport",
      description: "Manage transporters & routes",
    },
    {
      title: "Contacts",
      icon: <Users2 className="w-6 h-6 mb-2 text-indigo-600" />,
      link: "/master",
      description: "Manage people & companies",
    },
    {
      title: "Cash Book",
      icon: <BookText className="w-6 h-6 mb-2 text-purple-600" />,
      link: "/cashbook",
      description: "Track cash transactions",
    },
    {
      title: "Ledger",
      icon: <ClipboardList className="w-6 h-6 mb-2 text-gray-600" />,
      link: "/ledger",
      description: "View party balances",
    },
    {
      title: "Calculator",
      icon: <Calculator className="w-6 h-6 mb-2 text-gray-600" />,
      link: "/stock", // Changed from /calculator to /stock since the calculator is now in the Stock page
      description: "Business calculations",
    },
    {
      title: "Backup",
      icon: <FileSpreadsheet className="w-6 h-6 mb-2 text-cyan-600" />,
      link: "#",
      description: "Backup or export data",
      onClick: () => {
        // Placeholder for future functionality
      },
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-ag-brown-dark">Quick Access</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {menuItems && menuItems.map((item) => (
          <Card 
            key={item.title}
            className="hover:border-primary hover:shadow-md transition-all duration-200"
          >
            {item.onClick ? (
              <CardContent 
                className="p-4 flex flex-col items-center text-center cursor-pointer" 
                onClick={item.onClick}
              >
                {item.icon}
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </CardContent>
            ) : (
              <Link to={item.link}>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  {item.icon}
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                </CardContent>
              </Link>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardMenu;
