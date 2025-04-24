import { toast } from "sonner";
import { deleteSale, savePurchases, updateSale } from "@/services/storageService";
import { InventoryItem, Sale } from "@/services/types";

export const handlePrintSale = (sale: Sale) => {
  window.print();
};

export const handleEditSale = (
  sale: Sale,
  setIsAdding: (value: boolean) => void,
  setEditingSale: (sale: Sale | null) => void
) => {
  setIsAdding(true);
  setEditingSale(sale);
};

export const handleDeleteSale = (
  saleId: string,
  sales: Sale[],
  setSales: (sales: Sale[]) => void
) => {
  deleteSale(saleId);
  const updatedSales = sales.filter((s) => s.id !== saleId);
  setSales(updatedSales);
  toast.success("Sale deleted successfully!");
};

export const handleUpdateInventoryAfterSale = (
  sale: Sale,
  inventory: InventoryItem[],
  setInventory: (inventory: InventoryItem[]) => void
) => {
  if (!sale || !sale.items) {
    toast.error("Sale or Sale Items are undefined");
    return;
  }

  const updatedInventory = inventory.map((item) => {
    const saleItem = sale.items?.find((si) => si.inventoryItemId === item.id);
    if (saleItem) {
      const soldQuantity = saleItem.quantity;
      if (item.remainingQuantity !== undefined) {
        item.remainingQuantity -= soldQuantity;
      } else {
        console.warn("remainingQuantity is undefined on inventory item", item);
      }
      if (item.remainingQuantity <= 0) {
        item.isSoldOut = true;
      }
    }
    return item;
  });

  setInventory(updatedInventory);
  savePurchases([sale]);
  toast.success("Inventory updated after sale!");
};

export const handleSaleSubmit = (
  sale: Sale,
  sales: Sale[],
  setSales: (sales: Sale[]) => void,
  setIsAdding: (value: boolean) => void,
  setEditingSale: (sale: Sale | null) => void,
  inventory: InventoryItem[],
  setInventory: (inventory: InventoryItem[]) => void
) => {
  if (!sale.customer) {
    toast.error("Customer name is required");
    return;
  }

  if (!sale.items || sale.items.length === 0) {
    toast.error("Sale must have at least one item");
    return;
  }

  // Check if there is enough quantity in inventory
  for (const item of sale.items) {
    const inventoryItem = inventory.find((i) => i.id === item.inventoryItemId);
    if (!inventoryItem) {
      toast.error(`Inventory item not found: ${item.inventoryItemId}`);
      return;
    }
    if (inventoryItem.remainingQuantity < item.quantity) {
      toast.error(
        `Not enough quantity in inventory for item ${inventoryItem.lotNumber}`
      );
      return;
    }
  }

  const isEditing = !!sale.id;

  if (isEditing) {
    updateSale(sale.id, sale);
    const updatedSales = sales.map((s) => (s.id === sale.id ? sale : s));
    setSales(updatedSales);
    toast.success("Sale updated successfully!");
  } else {
    const newSale = { ...sale, id: Date.now().toString() };
    updateSale(sale.id, sale);
    setSales([...sales, newSale]);
    toast.success("Sale added successfully!");
  }

  setIsAdding(false);
  setEditingSale(null);
  handleUpdateInventoryAfterSale(sale, inventory, setInventory);
};
