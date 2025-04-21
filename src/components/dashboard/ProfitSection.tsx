
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getPurchases, getSales, getInventory } from '@/services/storageService';
import { format } from 'date-fns';

interface ProfitSectionProps {
  selectedMonth: number;
  selectedYear: number;
}

const ProfitSection: React.FC<ProfitSectionProps> = ({ selectedMonth, selectedYear }) => {
  const [profitData, setProfitData] = useState<any[]>([]);
  const [monthlyProfit, setMonthlyProfit] = useState<number>(0);
  const [prevMonthProfit, setPrevMonthProfit] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    calculateProfit(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const calculateProfit = (month: number, year: number) => {
    try {
      // Get all purchases and sales
      const allPurchases = getPurchases() || [];
      const allSales = getSales() || [];
      const inventory = getInventory() || [];
      
      // Filter by month and year
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      
      // Previous month
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const prevStartDate = new Date(prevYear, prevMonth, 1);
      const prevEndDate = new Date(prevYear, prevMonth + 1, 0);

      // Filter transactions
      const monthSales = allSales.filter(sale => {
        if (sale.isDeleted) return false;
        const saleDate = new Date(sale.date);
        return saleDate >= startDate && saleDate <= endDate;
      });
      
      const prevMonthSales = allSales.filter(sale => {
        if (sale.isDeleted) return false;
        const saleDate = new Date(sale.date);
        return saleDate >= prevStartDate && saleDate <= prevEndDate;
      });

      // Calculate profit by day
      const dailyProfitMap = new Map();
      let totalMonthProfit = 0;
      let totalPrevMonthProfit = 0;

      // Calculate profit for current month sales
      for (const sale of monthSales) {
        // Find related inventory item to get purchase cost
        const inventoryItem = inventory.find(item => 
          item.lotNumber === sale.lotNumber && !item.isDeleted
        );
        
        if (!inventoryItem) continue;
        
        const purchaseRate = inventoryItem.rate || 0;
        const saleRate = sale.rate || 0;
        const quantity = sale.quantity;
        const profitPerUnit = saleRate - purchaseRate;
        const totalProfit = profitPerUnit * quantity;
        
        totalMonthProfit += totalProfit;
        
        // Add to daily profit
        const dateStr = format(new Date(sale.date), 'yyyy-MM-dd');
        const currentDayProfit = dailyProfitMap.get(dateStr) || 0;
        dailyProfitMap.set(dateStr, currentDayProfit + totalProfit);
      }
      
      // Calculate profit for previous month
      for (const sale of prevMonthSales) {
        const inventoryItem = inventory.find(item => 
          item.lotNumber === sale.lotNumber && !item.isDeleted
        );
        
        if (!inventoryItem) continue;
        
        const purchaseRate = inventoryItem.rate || 0;
        const saleRate = sale.rate || 0;
        const quantity = sale.quantity;
        const profitPerUnit = saleRate - purchaseRate;
        const totalProfit = profitPerUnit * quantity;
        
        totalPrevMonthProfit += totalProfit;
      }
      
      // Convert Map to array for chart
      const chartData = Array.from(dailyProfitMap).map(([date, profit]) => {
        const day = format(new Date(date), 'd');
        return {
          date: day,
          profit: profit
        };
      }).sort((a, b) => parseInt(a.date) - parseInt(b.date));
      
      setProfitData(chartData);
      setMonthlyProfit(totalMonthProfit);
      setPrevMonthProfit(totalPrevMonthProfit);
      setIsLoading(false);
    } catch (error) {
      console.error("Error calculating profit:", error);
      setProfitData([]);
      setMonthlyProfit(0);
      setPrevMonthProfit(0);
      setIsLoading(false);
    }
  };

  const profitChange = prevMonthProfit !== 0 
    ? ((monthlyProfit - prevMonthProfit) / prevMonthProfit) * 100
    : 0;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const prevMonthName = monthNames[(selectedMonth === 0 ? 11 : selectedMonth - 1)];

  return (
    <Card className="w-full shadow-md bg-gradient-to-br from-green-50 to-emerald-100">
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-2xl text-emerald-800">Profit Analysis</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-emerald-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium mb-4 text-emerald-700">Daily Profit Chart</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profitData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0f2f1" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#2e7d32"
                      label={{ value: 'Day of Month', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      stroke="#2e7d32"
                      label={{ value: 'Profit (₹)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Profit']}
                      labelFormatter={(label) => `Day ${label}`}
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '6px' }}
                    />
                    <Bar dataKey="profit" fill="#2e7d32" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4">
              <Card className="bg-white shadow p-4 border">
                <div className="text-sm text-gray-500">Monthly Profit</div>
                <div className="text-3xl font-bold text-emerald-600">₹{monthlyProfit.toLocaleString()}</div>
                <div className="text-sm text-gray-500 mt-2">
                  {monthNames[selectedMonth]} {selectedYear}
                </div>
              </Card>
              
              <Card className="bg-white shadow p-4 border">
                <div className="text-sm text-gray-500">Previous Month</div>
                <div className="text-2xl font-bold text-blue-600">₹{prevMonthProfit.toLocaleString()}</div>
                <div className="text-sm text-gray-500 mt-2">{prevMonthName}</div>
              </Card>
              
              <Card className={`bg-white shadow p-4 border ${profitChange >= 0 ? 'border-green-200' : 'border-red-200'}`}>
                <div className="text-sm text-gray-500">Month-to-Month Change</div>
                <div className={`text-2xl font-bold ${profitChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profitChange >= 0 ? '+' : ''}{profitChange.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Compared to {prevMonthName}
                </div>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfitSection;
