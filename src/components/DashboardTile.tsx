
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardTileProps {
  title: string;
  icon: LucideIcon;
  link: string;
  count?: number | string;
  color?: "blue" | "green" | "purple" | "amber" | "rose" | "pink" | "indigo";
  description?: string;
}

export const DashboardTile = ({
  title,
  icon: Icon,
  link,
  count,
  color = "blue",
  description
}: DashboardTileProps) => {
  const colorClasses = {
    blue: "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30",
    green: "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/30",
    purple: "bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/30",
    amber: "bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/30",
    rose: "bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/30",
    pink: "bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg shadow-pink-500/30",
    indigo: "bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/30",
  };

  return (
    <Link
      to={link}
      className={cn(
        "flex flex-col items-center justify-center p-8 rounded-xl hover:scale-105 transition-all duration-300",
        colorClasses[color]
      )}
    >
      <Icon className="h-12 w-12 mb-6" />
      <h3 className="text-xl font-bold">{title}</h3>
      {count !== undefined && (
        <div className="mt-4 text-3xl font-bold">{count}</div>
      )}
      {description && (
        <p className="mt-2 text-sm opacity-90 text-center">{description}</p>
      )}
    </Link>
  );
};
