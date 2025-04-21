import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInventory } from "@/services/storageService";
import InventoryTable from "@/components/InventoryTable";

const Inventory = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    const inventoryData = getInventory() || [];
    setInventory(inventoryData);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedInventory = React.useMemo(() => {
    let sortableItems = [...inventory];
    if (sortColumn !== null) {
      sortableItems.sort((a: any, b: any) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        return 0;
      });
    }
    return sortableItems;
  }, [inventory, sortColumn, sortDirection]);

  const filteredInventory = React.useMemo(() => {
    if (!searchTerm) return sortedInventory;

    const term = searchTerm.toLowerCase();
    return sortedInventory.filter((item: any) => {
      return (
        item.lotNumber?.toLowerCase().includes(term) ||
        item.location?.toLowerCase().includes(term)
      );
    });
  }, [searchTerm, sortedInventory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
      <Navigation title="Inventory" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-200 shadow">
          <CardHeader>
            <CardTitle className="text-yellow-800">Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <InventoryTable
              inventory={filteredInventory}
              searchTerm={searchTerm}
              onSearch={handleSearch}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Inventory;
