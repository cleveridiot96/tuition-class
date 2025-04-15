
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/helpers';
import { getInventory } from '@/services/storageService';
import { InventoryItem } from '@/services/types';

interface StockReportProps {
  filterLocation?: string;
}

interface EnhancedInventoryItem extends InventoryItem {
  totalValue: number;
  averageRate: number;
  locationInfo: string;
}

const StockReport = ({ filterLocation }: StockReportProps) => {
  const [stock, setStock] = useState<EnhancedInventoryItem[]>([]);
  const [totals, setTotals] = useState({
    bags: 0,
    weight: 0,
    value: 0,
  });

  useEffect(() => {
    loadData();
    // Add event listener for storage changes
    window.addEventListener('storage', loadData);
    
    return () => {
      window.removeEventListener('storage', loadData);
    };
  }, [filterLocation]);

  const loadData = () => {
    try {
      const inventory = getInventory() || [];
      
      // Filter out deleted items and by location if specified
      const activeItems = inventory.filter(item => 
        !item.isDeleted && 
        (!filterLocation || item.location === filterLocation)
      );
      
      // Enhance inventory with calculated fields
      const enhancedItems = activeItems.map(item => {
        const totalValue = item.quantity * item.rate;
        const averageRate = item.quantity > 0 ? totalValue / item.quantity : 0;
        
        return {
          ...item,
          totalValue,
          averageRate,
          locationInfo: item.location || 'Unknown',
        };
      });
      
      // Calculate totals
      const totalBags = enhancedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalWeight = enhancedItems.reduce((sum, item) => sum + (item.netWeight || 0), 0);
      const totalValue = enhancedItems.reduce((sum, item) => sum + item.totalValue, 0);
      
      setStock(enhancedItems);
      setTotals({
        bags: totalBags,
        weight: totalWeight,
        value: totalValue,
      });
    } catch (error) {
      console.error("Error loading inventory data:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <CardTitle>
          Stock Summary {filterLocation ? `(${filterLocation})` : ''}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {stock.length === 0 ? (
          <div className="flex justify-center items-center p-6 text-muted-foreground">
            No stock items found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lot No.</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Net Weight</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stock.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.lotNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.locationInfo}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {item.netWeight?.toFixed(2)} kg
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.rate)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.totalValue)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-medium">
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-right">{totals.bags}</TableCell>
                <TableCell className="text-right">
                  {totals.weight.toFixed(2)} kg
                </TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">
                  {formatCurrency(totals.value)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default StockReport;
