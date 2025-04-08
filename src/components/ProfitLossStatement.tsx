
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronRight, ExternalLink } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ProfitData {
  purchase: number;
  sale: number;
  profit: number;
  date: string;
  quantity: number;
  netWeight: number;
  id?: string; // Sale ID
}

interface MonthlyProfitData {
  month: string;
  profit: number;
}

interface ProfitLossStatementProps {
  profitByTransaction: ProfitData[];
  profitByMonth: MonthlyProfitData[];
  totalProfit: number;
}

const ProfitLossStatement = ({ 
  profitByTransaction, 
  profitByMonth, 
  totalProfit 
}: ProfitLossStatementProps) => {
  const [expandedProfitSection, setExpandedProfitSection] = useState(true);
  const navigate = useNavigate();

  const toggleProfitSection = () => {
    setExpandedProfitSection(!expandedProfitSection);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleTransactionClick = (saleId: string | undefined) => {
    if (saleId) {
      navigate('/sales', { state: { highlightSaleId: saleId } });
    }
  };

  return (
    <Card className="mt-6 p-4 shadow-md">
      <div 
        className="flex justify-between items-center mb-4 border-b pb-1 cursor-pointer" 
        onClick={toggleProfitSection}
      >
        <h3 className="text-lg font-semibold">Profit & Loss Statement</h3>
        <ChevronRight 
          size={20} 
          className={`transition-transform ${expandedProfitSection ? 'rotate-90' : ''}`} 
        />
      </div>
      
      {expandedProfitSection && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Transaction-wise profit */}
          <div>
            <h4 className="font-medium text-ag-brown mb-2">Transaction-wise</h4>
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 grid grid-cols-5 font-medium">
                <div className="p-2">Date</div>
                <div className="p-2">Purchase</div>
                <div className="p-2">Sale</div>
                <div className="p-2">Qty (kg)</div>
                <div className="p-2">Profit</div>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {profitByTransaction.length === 0 ? (
                  <div className="p-2 text-center text-gray-500">No transaction data available</div>
                ) : (
                  profitByTransaction.map((item, idx) => (
                    <TooltipProvider key={idx}>
                      <Tooltip>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <TooltipTrigger asChild>
                              <div 
                                className="grid grid-cols-5 border-t hover:bg-gray-100 cursor-pointer" 
                                onClick={() => handleTransactionClick(item.id)}
                              >
                                <div className="p-2">{format(parseISO(item.date), 'dd/MM/yy')}</div>
                                <div className="p-2">{formatCurrency(item.purchase)}</div>
                                <div className="p-2">{formatCurrency(item.sale)}</div>
                                <div className="p-2">{item.netWeight}</div>
                                <div className={`p-2 ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(item.profit)}
                                </div>
                              </div>
                            </TooltipTrigger>
                          </HoverCardTrigger>
                          <TooltipContent>
                            <span>Click to view transaction details</span>
                          </TooltipContent>
                          <HoverCardContent className="w-80">
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold">Transaction Details</h4>
                              <div className="text-sm">
                                <div className="grid grid-cols-2 gap-1">
                                  <span className="font-medium">Date:</span>
                                  <span>{format(parseISO(item.date), 'dd MMM yyyy')}</span>
                                  
                                  <span className="font-medium">Purchase Cost:</span>
                                  <span>{formatCurrency(item.purchase)}</span>
                                  
                                  <span className="font-medium">Sale Revenue:</span>
                                  <span>{formatCurrency(item.sale)}</span>
                                  
                                  <span className="font-medium">Quantity:</span>
                                  <span>{item.netWeight} kg</span>
                                  
                                  <span className="font-medium">Profit/Loss:</span>
                                  <span className={item.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    {formatCurrency(item.profit)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center pt-2">
                                <ExternalLink size={14} className="mr-1" /> 
                                <span className="text-xs text-blue-600">Click to view full details</span>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </Tooltip>
                    </TooltipProvider>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Monthly profit */}
          <div>
            <h4 className="font-medium text-ag-brown mb-2">Month-wise</h4>
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 grid grid-cols-2 font-medium">
                <div className="p-2">Month</div>
                <div className="p-2">Profit</div>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {profitByMonth.length === 0 ? (
                  <div className="p-2 text-center text-gray-500">No monthly data available</div>
                ) : (
                  profitByMonth.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-2 border-t">
                      <div className="p-2">{item.month}</div>
                      <div className={`p-2 ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(item.profit)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Total profit */}
      <div className="mt-4 bg-gray-50 p-3 rounded-md flex justify-between items-center">
        <span className="font-medium">Total Profit/Loss:</span>
        <span className={`font-bold text-xl ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(totalProfit)}
        </span>
      </div>
    </Card>
  );
};

export default ProfitLossStatement;
