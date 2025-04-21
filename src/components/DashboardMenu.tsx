
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart3, 
  BookText, 
  CircleDollarSign, 
  ClipboardList, 
  FileSpreadsheet, 
  Package,
  ReceiptText, 
  ShoppingBag, 
  Users2, 
  Warehouse,
  ArrowLeftRight
} from "lucide-react";
import { exportDataBackup } from "@/services/storageService";
import { toast } from "@/hooks/use-toast";

const DashboardMenu = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    {
      title: "Purchases",
      icon: <ShoppingBag className="w-6 h-6 mb-2 text-white" />,
      link: "/purchases",
      description: "Record and manage purchases",
      bgGradient: "from-blue-400 to-blue-600",
    },
    {
      title: "Sales",
      icon: <BarChart3 className="w-6 h-6 mb-2 text-white" />,
      link: "/sales",
      description: "Create and manage sales",
      bgGradient: "from-green-400 to-green-600",
    },
    {
      title: "Inventory",
      icon: <Warehouse className="w-6 h-6 mb-2 text-white" />,
      link: "/inventory",
      description: "View and manage stock",
      bgGradient: "from-amber-400 to-amber-600",
    },
    {
      title: "Stock Report",
      icon: <Package className="w-6 h-6 mb-2 text-white" />,
      link: "/stock",
      description: "Real-time stock analysis",
      bgGradient: "from-orange-400 to-orange-600",
    },
    {
      title: "Location Transfer",
      icon: <ArrowLeftRight className="w-6 h-6 mb-2 text-white" />,
      link: "/location-transfer",
      description: "Transfer stock between locations",
      bgGradient: "from-purple-400 to-purple-600",
    },
    {
      title: "Payments",
      icon: <CircleDollarSign className="w-6 h-6 mb-2 text-white" />,
      link: "/payments",
      description: "Record outgoing payments",
      bgGradient: "from-red-400 to-red-600",
    },
    {
      title: "Receipts",
      icon: <ReceiptText className="w-6 h-6 mb-2 text-white" />,
      link: "/receipts",
      description: "Manage incoming payments",
      bgGradient: "from-lime-400 to-lime-600",
    },
    {
      title: "Master Data",
      icon: <Users2 className="w-6 h-6 mb-2 text-white" />,
      link: "/master",
      description: "Manage people & companies",
      bgGradient: "from-indigo-400 to-indigo-600",
    },
    {
      title: "Cash Book",
      icon: <BookText className="w-6 h-6 mb-2 text-white" />,
      link: "/cashbook",
      description: "Track cash transactions",
      bgGradient: "from-pink-400 to-pink-600",
    },
    {
      title: "Party Ledger",
      icon: <ClipboardList className="w-6 h-6 mb-2 text-white" />,
      link: "/ledger",
      description: "View party balances",
      bgGradient: "from-gray-400 to-gray-600",
    },
    {
      title: "Backup",
      icon: <FileSpreadsheet className="w-6 h-6 mb-2 text-white" />,
      link: "#",
      description: "Backup or export data",
      bgGradient: "from-cyan-400 to-cyan-600",
      onClick: () => {
        try {
          const jsonData = exportDataBackup();
          if (jsonData) {
            const blob = new Blob([jsonData], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `kisan-khata-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            toast({
              title: "Backup Created",
              description: "Data backup successfully downloaded",
            });
            
            const customEvent = new CustomEvent('backup-created', {
              detail: { success: true }
            });
            window.dispatchEvent(customEvent);
          } else {
            toast({
              title: "Backup Failed",
              description: "There was a problem creating the backup",
              variant: "destructive",
            });
            
            const customEvent = new CustomEvent('backup-created', {
              detail: { success: false }
            });
            window.dispatchEvent(customEvent);
          }
        } catch (error) {
          console.error("Backup error:", error);
          toast({
            title: "Backup Failed",
            description: "An unexpected error occurred",
            variant: "destructive",
          });
        }
      },
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-ag-brown-dark">Quick Access</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {menuItems && menuItems.map((item) => (
          <Card 
            key={item.title + item.link}
            className={`hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 overflow-hidden border-none`}
            onClick={() => item.onClick ? item.onClick() : navigate(item.link)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-90`}></div>
            <CardContent className="p-4 flex flex-col items-center text-center relative z-10">
              {item.icon}
              <h3 className="font-bold text-white">{item.title}</h3>
              <p className="text-xs text-white/80 mt-1">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardMenu;
