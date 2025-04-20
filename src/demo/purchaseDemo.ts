import { addPurchase } from "@/services/purchaseService";
import { addInventoryItem } from "@/services/inventoryService";
import { Purchase, InventoryItem } from "@/services/types";
import { v4 as uuidv4 } from 'uuid';

// Function to generate a unique ID
const generateId = (): string => {
  return uuidv4();
};

// Function to generate a unique lot number
const generateLotNumber = (): string => {
  return `LOT-${Date.now()}`;
};

export const createDemoPurchase = () => {
  // Update the purchase object to include totalAfterExpenses
  const purchase = {
    id: generateId(),
    date: new Date().toISOString().split('T')[0],
    lotNumber: generateLotNumber(),
    quantity: 100,
    party: "Demo Supplier",
    partyId: generateId(),
    netWeight: 1000,
    rate: 50,
    totalAmount: 50000,
    transporterId: generateId(),
    transporter: "Demo Transporter",
    transportRate: 2,
    transportAmount: 2000,
    location: "Mumbai",
    notes: "Demo purchase entry",
    totalAfterExpenses: 52000 // Add this required field
  };

  addPurchase(purchase);
  return purchase;
};

export const createDemoInventoryItem = (purchase: Purchase) => {
  const inventoryItem: InventoryItem = {
    id: uuidv4(),
    lotNumber: purchase.lotNumber,
    quantity: purchase.quantity,
    location: purchase.location,
    dateAdded: new Date().toISOString(),
    netWeight: purchase.netWeight,
    remainingQuantity: purchase.quantity,
    purchaseRate: purchase.rate,
    finalCost: purchase.totalAfterExpenses,
    agentId: purchase.agentId || '',
    agentName: purchase.agent || '',
    date: purchase.date,
    rate: purchase.rate, // Add this required field
  };

  addInventoryItem(inventoryItem);
};
