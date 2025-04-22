
// Only adding the required portion that adds 'bags' to InventoryItem
export interface InventoryItem {
  id: string;
  lotNumber: string;
  quantity: number;
  bags?: number;
  remainingQuantity?: number;
  location: string;
  dateAdded: string;
  purchaseId?: string;
  saleId?: string;
  netWeight?: number;
  rate?: number;
  isDeleted?: boolean;
}
