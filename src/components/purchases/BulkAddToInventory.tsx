
import React, { useState, useEffect } from "react";
import { PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Purchase } from "@/services/types";

interface BulkAddToInventoryProps {
  purchases: Purchase[];
  onAddToInventory: (selectedPurchases: Purchase[]) => void;
  disabled: boolean;
}

const BulkAddToInventory: React.FC<BulkAddToInventoryProps> = ({
  purchases,
  onAddToInventory,
  disabled
}) => {
  const [selectedPurchases, setSelectedPurchases] = useState<Purchase[]>([]);
  const [isBulkAddDialogOpen, setIsBulkAddDialogOpen] = useState(false);

  useEffect(() => {
    if (isBulkAddDialogOpen) {
      setSelectedPurchases(purchases);
    } else {
      setSelectedPurchases([]);
    }
  }, [isBulkAddDialogOpen, purchases]);

  const handleCheckboxChange = (purchase: Purchase) => {
    setSelectedPurchases((prevSelected) => {
      if (prevSelected.find((p) => p.id === purchase.id)) {
        return prevSelected.filter((p) => p.id !== purchase.id);
      } else {
        return [...prevSelected, purchase];
      }
    });
  };

  const isPurchaseSelected = (purchase: Purchase): boolean => {
    return !!selectedPurchases.find((p) => p.id === purchase.id);
  };

  const handleBulkAdd = () => {
    onAddToInventory(selectedPurchases);
    setIsBulkAddDialogOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsBulkAddDialogOpen(true)} disabled={disabled}>
        <PackagePlus size={18} className="mr-2" />
        Add Selected to Inventory
      </Button>

      <Dialog open={isBulkAddDialogOpen} onOpenChange={setIsBulkAddDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add Purchases to Inventory</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] mb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Select</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Lot Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Net Weight</TableHead>
                  <TableHead>Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="w-[100px]">
                      <Input
                        type="checkbox"
                        checked={isPurchaseSelected(purchase)}
                        onChange={() => handleCheckboxChange(purchase)}
                      />
                    </TableCell>
                    <TableCell>{purchase.date}</TableCell>
                    <TableCell>{purchase.lotNumber}</TableCell>
                    <TableCell>{purchase.party}</TableCell>
                    <TableCell>{purchase.quantity}</TableCell>
                    <TableCell>{purchase.netWeight}</TableCell>
                    <TableCell>{purchase.rate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsBulkAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleBulkAdd} disabled={selectedPurchases.length === 0}>
              Add {selectedPurchases.length} to Inventory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BulkAddToInventory;
