
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
    <Button
      variant="card"
      onClick={onClick}
      className={`group ${className}`}
    >
      <CardContent className="p-4 relative w-full">
        <h3 className="text-lg font-medium group-hover:text-[#9b87f5]">{title}</h3>
        <div className="mt-2">{children}</div>
      </CardContent>
    </Button>
  );
};

export default DashboardCard;
