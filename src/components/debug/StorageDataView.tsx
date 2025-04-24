
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { StorageStats } from '@/hooks/useStorageDebug';

interface StorageDataViewProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: 'all' | 'master' | 'transaction' | 'settings';
  onFilterChange: (value: 'all' | 'master' | 'transaction' | 'settings') => void;
  onClearData: () => void;
  storageData: string;
  storageStats: StorageStats;
  onKeySelect?: (key: string) => void;
}

export function StorageDataView({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  onClearData,
  storageData,
  storageStats,
  onKeySelect
}: StorageDataViewProps) {
  // Render JSON data with syntax highlighting
  const renderStorageData = () => {
    try {
      // If we have storageData, parse and display it
      if (storageData) {
        const parsedData = JSON.parse(storageData);
        return (
          <div className="relative">
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{Object.keys(parsedData).length} items</Badge>
                <Badge variant="outline">
                  {(storageStats.totalSize / 1024).toFixed(2)} KB
                </Badge>
              </div>
              {onClearData && (
                <Button variant="destructive" size="sm" onClick={onClearData}>
                  Clear All Data
                </Button>
              )}
            </div>
            
            {/* Largest items section */}
            {storageStats.largestItems.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Largest Items:</h4>
                <div className="flex flex-wrap gap-2">
                  {storageStats.largestItems.map(item => (
                    <Badge 
                      key={item.key}
                      variant="secondary" 
                      className="cursor-pointer hover:bg-slate-200"
                      onClick={() => onKeySelect && onKeySelect(item.key)}
                    >
                      {item.key}: {(item.size / 1024).toFixed(2)} KB
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {Object.keys(parsedData).length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-md text-center text-gray-500">
                No data in storage
              </div>
            ) : (
              <pre className="p-4 bg-gray-50 rounded-md overflow-auto max-h-96 text-xs">
                {JSON.stringify(parsedData, null, 2)}
              </pre>
            )}
          </div>
        );
      }
      
      return (
        <div className="p-4 bg-gray-50 rounded-md text-center text-gray-500">
          No data to display
        </div>
      );
    } catch (error) {
      return (
        <div className="p-4 bg-red-50 rounded-md text-center text-red-500">
          Error displaying data: {String(error)}
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-grow">
          <Input
            placeholder="Search storage keys..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filterType} onValueChange={(val: any) => onFilterChange(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Data</SelectItem>
            <SelectItem value="master">Master Data</SelectItem>
            <SelectItem value="transaction">Transactions</SelectItem>
            <SelectItem value="settings">Settings</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className="p-4">
        {renderStorageData()}
      </Card>
    </div>
  );
}
