
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, PackageOpen } from "lucide-react";

interface InventoryItem {
  id: string;
  lotNumber: string;
  quantity: number;
  location: string;
  dateAdded: string;
}

const Inventory = () => {
  // Mock inventory data
  const [inventory] = useState<InventoryItem[]>([
    {
      id: "1",
      lotNumber: "AB/10",
      quantity: 7,
      location: "Chiplun",
      dateAdded: "2025-04-01"
    },
    {
      id: "2",
      lotNumber: "CD/5",
      quantity: 3,
      location: "Mumbai",
      dateAdded: "2025-04-02"
    },
    {
      id: "3",
      lotNumber: "EF/8",
      quantity: 5,
      location: "Chiplun",
      dateAdded: "2025-04-03"
    },
    {
      id: "4",
      lotNumber: "GH/12",
      quantity: 8,
      location: "Mumbai",
      dateAdded: "2025-04-05"
    }
  ]);

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="स्टॉक (Inventory)" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="all" className="text-lg py-3">सभी (All)</TabsTrigger>
            <TabsTrigger value="chiplun" className="text-lg py-3">Chiplun</TabsTrigger>
            <TabsTrigger value="mumbai" className="text-lg py-3">Mumbai</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2">
              {inventory.map((item) => (
                <InventoryCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="chiplun" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2">
              {inventory
                .filter(item => item.location === "Chiplun")
                .map((item) => (
                  <InventoryCard key={item.id} item={item} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="mumbai" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2">
              {inventory
                .filter(item => item.location === "Mumbai")
                .map((item) => (
                  <InventoryCard key={item.id} item={item} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-ag-brown-dark">कुल स्टॉक सारांश (Total Stock Summary)</h3>
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-4 flex items-center border-2 border-ag-green-light">
              <div className="mr-4 bg-ag-green-light p-3 rounded-full">
                <PackageOpen size={32} className="text-ag-green" />
              </div>
              <div>
                <p className="text-sm text-ag-brown">Chiplun में स्टॉक</p>
                <p className="text-2xl font-bold">12 बैग</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center border-2 border-ag-orange-light">
              <div className="mr-4 bg-ag-orange-light p-3 rounded-full">
                <Package size={32} className="text-ag-orange" />
              </div>
              <div>
                <p className="text-sm text-ag-brown">Mumbai में स्टॉक</p>
                <p className="text-2xl font-bold">11 बैग</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const InventoryCard = ({ item }: { item: InventoryItem }) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h3 className="text-xl font-bold">{item.lotNumber}</h3>
        <span className={`px-3 py-1 rounded-full text-white ${
          item.location === "Chiplun" ? "bg-ag-green" : "bg-ag-orange"
        }`}>
          {item.location}
        </span>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold">{item.quantity} बैग</p>
        <p className="text-ag-brown text-sm mt-1">
          Added on: {new Date(item.dateAdded).toLocaleDateString()}
        </p>
      </div>
      <div className="mt-4 flex space-x-2">
        <Button variant="outline" size="sm" className="flex-1">
          Transport
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          Edit
        </Button>
      </div>
    </Card>
  );
};

export default Inventory;
