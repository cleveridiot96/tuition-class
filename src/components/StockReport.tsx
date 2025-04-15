import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Printer, FileSpreadsheet } from "lucide-react";

import { getInventory } from '@/services/inventoryService';
import { getSales } from '@/services/salesService';
import { getAgents } from '@/services/agentService';
import { getLocations } from '@/services/storageUtils';
import { formatCurrency } from '@/utils/helpers';
import { EnhancedInventoryItem } from '@/services/types';

const StockReport = () => {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<EnhancedInventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<EnhancedInventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [agents, setAgents] = useState<{id: string, name: string}[]>([]);
  const [totalStockValue, setTotalStockValue] = useState(0);
  const [filteredStockValue, setFilteredStockValue] = useState(0);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inventory = getInventory() || [];
    const sales = getSales() || [];
    const agents = getAgents() || [];
    const locations = getLocations() || ["Mumbai", "Chiplun", "Sawantwadi"];
    
    const calculatedInventory = inventory
      .filter(item => !item.isDeleted)
      .map(item => {
        const lotSales = sales.filter(
          sale => sale.lotNumber === item.lotNumber && !sale.isDeleted
        );
        const soldQuantity = lotSales.reduce(
          (total, sale) => total + sale.quantity,
          0
        );
        const soldWeight = lotSales.reduce(
          (total, sale) => total + sale.netWeight,
          0
        );
        const remainingWeight = item.netWeight - soldWeight;
        const agentName = 
          agents.find(a => a.id === item.agentId)?.name || 'Unknown';
        
        const totalValue = remainingWeight * item.purchaseRate;

        return {
          ...item,
          agentName,
          soldQuantity,
          soldWeight,
          remainingWeight,
          totalValue,
          agentId: item.agentId || '',
          remainingQuantity: item.remainingQuantity || 0,
          purchaseRate: item.purchaseRate || 0,
          finalCost: item.finalCost || 0,
          date: item.date || '',
        } as EnhancedInventoryItem;
      });
    
    setInventory(calculatedInventory);
    setFilteredInventory(calculatedInventory);
    setAgents(agents);
    setLocations(locations);
    
    const totalValue = calculatedInventory.reduce((sum, item) => sum + item.totalValue, 0);
    setTotalStockValue(totalValue);
    setFilteredStockValue(totalValue);
  }, [toast]);

  useEffect(() => {
    if (!inventory || inventory.length === 0) {
      setFilteredInventory([]);
      setFilteredStockValue(0);
      return;
    }
    
    let filtered = [...inventory];
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.agentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedLocation) {
      filtered = filtered.filter(item => item.location === selectedLocation);
    }
    
    if (selectedAgent) {
      filtered = filtered.filter(item => item.agentId === selectedAgent);
    }
    
    setFilteredInventory(filtered);
    const filteredValue = filtered.reduce((sum, item) => sum + item.totalValue, 0);
    setFilteredStockValue(filteredValue);
  }, [searchTerm, selectedLocation, selectedAgent, inventory]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Stock Report",
    onAfterPrint: () => {
      toast({
        title: "Print successful",
        description: "Stock report has been sent to printer",
      });
    },
  });

  const handleExportToExcel = () => {
    try {
      if (!filteredInventory || filteredInventory.length === 0) {
        toast({
          title: "Export failed",
          description: "No data available to export",
          variant: "destructive"
        });
        return;
      }
      
      const excelData = filteredInventory.map(item => ({
        'Lot Number': item.lotNumber,
        'Location': item.location,
        'Agent': item.agentName,
        'Purchase Date': format(new Date(item.date), 'dd/MM/yyyy'),
        'Total Quantity': item.quantity,
        'Remaining Quantity': item.remainingQuantity,
        'Sold Quantity': item.soldQuantity,
        'Total Weight (kg)': item.netWeight,
        'Remaining Weight (kg)': item.remainingWeight.toFixed(2),
        'Purchase Rate (₹/kg)': item.purchaseRate,
        'Final Cost (₹/kg)': item.finalCost,
        'Stock Value (₹)': item.totalValue.toFixed(2),
      }));
      
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);
      
      XLSX.utils.book_append_sheet(wb, ws, "Stock Report");
      
      const fileName = `Stock_Report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      
      XLSX.writeFile(wb, fileName);
      
      toast({
        title: "Export completed",
        description: "Stock report has been exported to Excel",
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting to Excel",
        variant: "destructive"
      });
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedAgent('');
  };

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <CardTitle>Stock Report</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer size={16} className="mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportToExcel}>
              <FileSpreadsheet size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Input
                placeholder="Search by lot number or agent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  {(locations || []).map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Agents</SelectItem>
                  {(agents || []).map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-end">
              <Button variant="outline" onClick={handleResetFilters}>
                Reset Filters
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Total Stock Value</div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(filteredStockValue)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {(filteredInventory || []).length} lot{(filteredInventory || []).length !== 1 ? 's' : ''} in stock
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Total Remaining Quantity</div>
                <div className="text-2xl font-bold text-green-600">
                  {(filteredInventory || []).reduce((sum, item) => sum + item.remainingQuantity, 0)} bags
                </div>
              </CardContent>
            </Card>
            <Card className="bg-amber-50">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Total Remaining Weight</div>
                <div className="text-2xl font-bold text-amber-600">
                  {(filteredInventory || []).reduce((sum, item) => sum + item.remainingWeight, 0).toFixed(2)} kg
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div ref={printRef}>
          <div className="print-header text-center mb-4 hidden">
            <h2 className="text-2xl font-bold">Stock Report</h2>
            <p className="text-gray-600">As of {format(new Date(), 'dd/MM/yyyy')}</p>
          </div>
          
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lot Number</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead className="text-right">Qty (Bags)</TableHead>
                    <TableHead className="text-right">Weight (KG)</TableHead>
                    <TableHead className="text-right">Rate (₹/KG)</TableHead>
                    <TableHead className="text-right">Final Cost (₹/KG)</TableHead>
                    <TableHead className="text-right">Value (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(!filteredInventory || filteredInventory.length === 0) ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No stock found matching the criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (filteredInventory || []).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.lotNumber}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.agentName}</TableCell>
                        <TableCell className="text-right">
                          {item.remainingQuantity}
                          <span className="text-xs text-muted-foreground ml-1">
                            / {item.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.remainingWeight.toFixed(2)}
                          <span className="text-xs text-muted-foreground ml-1">
                            / {item.netWeight.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(item.purchaseRate)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.finalCost)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(item.totalValue)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-md border">
            <div className="flex justify-between">
              <strong>Total Stock Value:</strong> 
              <span>{formatCurrency(filteredStockValue)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-header {
            display: block !important;
          }
          #printRef, #printRef * {
            visibility: visible;
          }
          #printRef {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </Card>
  );
};

export default StockReport;
