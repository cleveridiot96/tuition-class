
import React from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const DashboardCard = ({ title, onClick, className = "", children }: DashboardCardProps) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <CardContent className="p-5 relative w-full h-full">
        <h3 className="text-lg font-medium mb-3 text-gray-800">{title}</h3>
        <div>{children}</div>
      </CardContent>
    </div>
  );
};

export default DashboardCard;
