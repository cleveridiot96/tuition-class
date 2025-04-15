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
import { getAgents, getLocations } from '@/services/storageService';
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

  // Load inventory data
  useEffect(() => {
    try {
      const rawInventory = getInventory() || [];
      const inventoryItems = rawInventory.filter(item => item && !item.isDeleted && item.remainingQuantity > 0);
      const agentsData = getAgents() || [];
      const locationsData = getLocations() || [];
      
      // Enhance inventory with calculated fields
      const enhancedInventory: EnhancedInventoryItem[] = inventoryItems.map(item => {
        const agent = agentsData.find(a => a && a.id === item.agentId);
        
        // Calculate values
        const soldQuantity = item.quantity - (item.remainingQuantity || item.quantity);
        const soldWeight = item.netWeight - (item.netWeight * ((item.remainingQuantity || item.quantity) / item.quantity));
        const remainingWeight = item.netWeight * ((item.remainingQuantity || item.quantity) / item.quantity);
        const totalValue = (item.finalCost || 0) * remainingWeight;
        
        return {
          ...item,
          agentName: agent?.name || 'Unknown',
          remainingQuantity: item.remainingQuantity || item.quantity,
          purchaseRate: item.purchaseRate || 0,
          finalCost: item.finalCost || 0,
          soldQuantity,
          soldWeight,
          remainingWeight,
          totalValue
        };
      });
      
      // Set state
      setInventory(enhancedInventory);
      setFilteredInventory(enhancedInventory);
      setAgents(agentsData);
      setLocations(locationsData || ['Mumbai', 'Chiplun', 'Sawantwadi']);
      
      // Calculate total stock value
      const totalValue = enhancedInventory.reduce((sum, item) => sum + item.totalValue, 0);
      setTotalStockValue(totalValue);
      setFilteredStockValue(totalValue);
    } catch (error) {
      console.error("Error loading inventory data:", error);
      toast({
        title: "Error",
        description: "Failed to load inventory data",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Filter inventory when search term or filters change
  useEffect(() => {
    if (!inventory || inventory.length === 0) {
      setFilteredInventory([]);
      setFilteredStockValue(0);
      return;
    }
    
    let filtered = [...inventory];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.agentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter(item => item.location === selectedLocation);
    }
    
    // Filter by agent
    if (selectedAgent) {
      filtered = filtered.filter(item => item.agentId === selectedAgent);
    }
    
    // Update filtered data and value
    setFilteredInventory(filtered);
    const filteredValue = filtered.reduce((sum, item) => sum + item.totalValue, 0);
    setFilteredStockValue(filteredValue);
  }, [searchTerm, selectedLocation, selectedAgent, inventory]);

  // Handle printing
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

  // Handle export to Excel
  const handleExportToExcel = () => {
    try {
      // Check if there is data to export
      if (!filteredInventory || filteredInventory.length === 0) {
        toast({
          title: "Export failed",
          description: "No data available to export",
          variant: "destructive"
        });
        return;
      }
      
      // Prepare data for Excel export
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
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Stock Report");
      
      // Generate file name with date
      const fileName = `Stock_Report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      
      // Save workbook
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

  // Reset filters
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
      
      {/* Print Styles */}
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
