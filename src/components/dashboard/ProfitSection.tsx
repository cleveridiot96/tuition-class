
import React, { useState, useEffect } from "react";
import ProfitLossStatement from "@/components/ProfitLossStatement";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getSales, getPurchases } from "@/services/storageService";
import { format, parse, isValid } from "date-fns";

interface ProfitSectionProps {
  selectedMonth: number;
  selectedYear: number;
}

interface ProfitData {
  purchase: number;
  sale: number;
  profit: number;
  date: string;
  quantity: number;
  netWeight: number;
  id?: string;
}

interface MonthlyProfitData {
  month: string;
  profit: number;
}

const ProfitSection: React.FC<ProfitSectionProps> = ({ selectedMonth, selectedYear }) => {
  const [profitByTransaction, setProfitByTransaction] = useState<ProfitData[]>([]);
  const [profitByMonth, setProfitByMonth] = useState<MonthlyProfitData[]>([]);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  
  useEffect(() => {
    calculateProfit(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);
  
  const calculateProfit = (month: number, year: number) => {
    try {
      const sales = getSales() || [];
      const purchases = getPurchases() || [];
      
      // Filter sales by selected month and year
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0); // Last day of month
      
      const filteredSales = sales.filter(sale => {
        if (sale.isDeleted) return false;
        
        // Check if the date is valid
        const saleDate = new Date(sale.date);
        return isValid(saleDate) && saleDate >= startDate && saleDate <= endDate;
      });
      
      // Calculate profit for each sale
      const profitData = filteredSales.map(sale => {
        // Find corresponding purchase
        const purchase = purchases.find(p => p.lotNumber === sale.lotNumber && !p.isDeleted);
        
        if (!purchase) return null;
        
        // Calculate cost and profit
        const purchaseCost = purchase.netWeight > 0 ? 
          (purchase.totalAfterExpenses / purchase.netWeight) * sale.netWeight : 0;
          
        const saleRevenue = sale.rate * sale.netWeight;
        const profit = saleRevenue - purchaseCost;
        
        return {
          id: sale.id,
          date: sale.date,
          purchase: purchaseCost,
          sale: saleRevenue,
          profit: profit,
          quantity: sale.quantity,
          netWeight: sale.netWeight
        };
      }).filter(Boolean) as ProfitData[];
      
      // Group profit by month for multiple months
      const monthlyProfitMap = new Map<string, number>();
      const allSalesAndPurchases = [...sales, ...purchases].filter(item => !item.isDeleted);
      
      allSalesAndPurchases.forEach(item => {
        const itemDate = new Date(item.date);
        if (!isValid(itemDate)) return;
        
        const monthYear = format(itemDate, 'MMMM yyyy');
        
        if (item.hasOwnProperty('totalAmount') && 'totalAmount' in item) {
          // It's a sale
          const sale = item as any;
          const currentProfit = monthlyProfitMap.get(monthYear) || 0;
          monthlyProfitMap.set(monthYear, currentProfit + (sale.totalAmount || 0));
        } else if (item.hasOwnProperty('totalAfterExpenses') && 'totalAfterExpenses' in item) {
          // It's a purchase
          const purchase = item as any;
          const currentProfit = monthlyProfitMap.get(monthYear) || 0;
          monthlyProfitMap.set(monthYear, currentProfit - (purchase.totalAfterExpenses || 0));
        }
      });
      
      // Convert map to array for display
      const monthlyProfitData: MonthlyProfitData[] = Array.from(monthlyProfitMap.entries())
        .map(([month, profit]) => ({
          month,
          profit
        }))
        .sort((a, b) => {
          // Sort by date, most recent first
          const dateA = parse(a.month, 'MMMM yyyy', new Date());
          const dateB = parse(b.month, 'MMMM yyyy', new Date());
          return dateB.getTime() - dateA.getTime();
        });
      
      // Calculate total profit
      const calculatedTotalProfit = profitData.reduce((sum, item) => sum + item.profit, 0);
      
      setProfitByTransaction(profitData);
      setProfitByMonth(monthlyProfitData);
      setTotalProfit(calculatedTotalProfit);
      
    } catch (error) {
      console.error("Error calculating profit:", error);
      setProfitByTransaction([]);
      setProfitByMonth([]);
      setTotalProfit(0);
    }
  };
  
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-center text-blue-800">Profit Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ProfitLossStatement 
          profitByTransaction={profitByTransaction}
          profitByMonth={profitByMonth}
          totalProfit={totalProfit}
        />
      </CardContent>
    </Card>
  );
};

export default ProfitSection;
