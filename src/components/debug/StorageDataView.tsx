
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, Filter, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StorageStats } from '@/hooks/useStorageDebug';

interface StorageDataViewProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterChange: (value: string) => void;
  onClearData: () => void;
  storageData: string;
  storageStats: StorageStats;
  onKeySelect: (key: string) => void;
}

export const StorageDataView: React.FC<StorageDataViewProps> = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  onClearData,
  storageData,
  storageStats,
  onKeySelect,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search keys..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 pr-8"
            />
            {searchTerm && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <select 
              value={filterType} 
              onChange={(e) => onFilterChange(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="all">All</option>
              <option value="master">Master Data</option>
              <option value="transaction">Transactions</option>
              <option value="settings">Settings</option>
            </select>
          </div>
        </div>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onClearData}
          className="flex gap-2 items-center"
        >
          <Trash2 className="h-4 w-4" />
          Clear All Data
        </Button>
      </div>
      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
        <pre className="text-sm">{storageData}</pre>
      </ScrollArea>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {Object.keys(storageStats).sort().map(key => (
          <div 
            key={key} 
            className="p-2 border rounded flex items-center justify-between gap-1 text-sm"
            onClick={() => onKeySelect(key)}
            title={`View only ${key} data`}
            style={{ cursor: 'pointer' }}
          >
            <span className="truncate flex-1">{key}</span>
            <Badge variant="secondary">{storageStats[key]}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
