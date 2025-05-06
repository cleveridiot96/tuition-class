
import React from "react";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Agent } from "@/services/types";

interface PurchaseFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterLocation: string;
  onLocationChange: (value: string) => void;
  filterAgent: string;
  onAgentChange: (value: string) => void;
  dateRange: any;
  onDateRangeChange: (range: any) => void;
  agents: Agent[];
}

const PurchaseFilters: React.FC<PurchaseFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterLocation,
  onLocationChange,
  filterAgent,
  onAgentChange,
  dateRange,
  onDateRangeChange,
  agents
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search purchases..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div>
            <Label>Filter by Location</Label>
            <Input
              placeholder="Enter location"
              value={filterLocation}
              onChange={(e) => onLocationChange(e.target.value)}
            />
          </div>
          
          <div>
            <Label>Filter by Agent</Label>
            <Select onValueChange={onAgentChange} value={filterAgent}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-3">
            <Label>Filter by Date Range</Label>
            <DateRangePicker date={dateRange} onDateChange={onDateRangeChange} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseFilters;
