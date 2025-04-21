
import { useState, useRef } from "react";
import { toast } from "sonner";
import { getSales, addSale, updateSale, deleteSale, updateInventoryAfterSale, getInventory } from "@/services/storageService";
import { normalizeSale, normalizeSales } from "@/utils/typeNormalizers";
import { Sale } from "@/services/types";
import { useReactToPrint } from "react-to-print";
import { getSaleIdFromUrl } from "@/utils/helpers";

export function useSalesActionHandlers(setSales, setDeletedSales) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saleToPrint, setSaleToPrint] = useState<Sale | null>(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Sale Receipt ${saleToPrint?.billNumber || saleToPrint?.id || ""}`,
    onAfterPrint: () => {
      setIsPrintDialogOpen(false);
      setSaleToPrint(null);
    },
  });

  const loadData = () => {
    setIsRefreshing(true);
    try {
      const allSales = getSales() || [];
      const activeSales = normalizeSales(allSales.filter(s => !s.isDeleted));
      const deletedSalesData = normalizeSales(allSales.filter(s => s.isDeleted));

      setSales(activeSales);
      setDeletedSales(deletedSalesData);
      // Optionally log: console.log("Sales data refreshed:", activeSales);
    } catch (err) {
      toast.error("Failed to load sales data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAdd = (data: Sale) => {
    try {
      const normalizedSale = normalizeSale({
        ...data,
        amount: data.totalAmount,
        transportCost: data.transportCost || 0,
      });
      addSale(normalizedSale);
      updateInventoryAfterSale(data.lotNumber, data.quantity);
      loadData();
      toast.success("Sale added successfully");
      setIsAddDialogOpen(false);
    } catch {
      toast.error("Failed to add sale");
    }
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (updatedSale: Sale) => {
    if (!editingSale) return;
    try {
      const normalizedSale = normalizeSale({
        ...updatedSale,
        amount: updatedSale.totalAmount,
        transportCost: updatedSale.transportCost || 0,
      });

      if (updatedSale.quantity !== editingSale.quantity || updatedSale.lotNumber !== editingSale.lotNumber) {
        updateInventoryAfterSale(editingSale.lotNumber, -editingSale.quantity);
        updateInventoryAfterSale(updatedSale.lotNumber, updatedSale.quantity);
      }
      updateSale(normalizedSale);
      loadData();
      toast.success("Sale updated successfully");
      setIsEditDialogOpen(false);
      setEditingSale(null);
    } catch {
      toast.error("Failed to update sale");
    }
  };

  const confirmDeleteSale = (id: string) => {
    setSaleToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = (sales) => {
    if (!saleToDelete) return;
    try {
      const saleToRemove = sales.find(s => s.id === saleToDelete);
      if (saleToRemove) {
        updateInventoryAfterSale(saleToRemove.lotNumber, -saleToRemove.quantity);
        deleteSale(saleToDelete);
        loadData();
        toast.success("Sale deleted successfully");
      }
    } catch {
      toast.error("Failed to delete sale");
    } finally {
      setShowDeleteConfirm(false);
      setSaleToDelete(null);
    }
  };

  const handleRestoreSale = (id: string, deletedSales) => {
    try {
      const saleToRestore = deletedSales.find(s => s.id === id);
      if (!saleToRestore) return;

      const inventory = getInventory() || [];
      const lotItem = inventory.find(item => item.lotNumber === saleToRestore.lotNumber && !item.isDeleted);

      if (!lotItem) {
        toast.error(`Cannot restore sale: Lot ${saleToRestore.lotNumber} no longer exists in inventory.`);
        return;
      }
      if (lotItem.quantity < saleToRestore.quantity) {
        toast.error(`Cannot restore sale: Only ${lotItem.quantity} bags available in lot ${saleToRestore.lotNumber}.`);
        return;
      }
      const updatedSale = { 
        ...saleToRestore, 
        isDeleted: false,
        amount: saleToRestore.totalAmount,
        transportCost: saleToRestore.transportCost || 0,
      };

      updateSale(updatedSale);
      updateInventoryAfterSale(saleToRestore.lotNumber, saleToRestore.quantity);
      loadData();
      toast.success("Sale restored successfully");
    } catch {
      toast.error("Failed to restore sale");
    }
  };

  const handlePrintSale = (sale: Sale) => {
    setSaleToPrint(sale);
    setIsPrintDialogOpen(true);
    setTimeout(() => {
      if (printRef.current) {
        handlePrint();
      }
    }, 300);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  return {
    isRefreshing,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    showDeleteConfirm,
    setShowDeleteConfirm,
    saleToDelete,
    setSaleToDelete,
    editingSale,
    setEditingSale,
    saleToPrint,
    setSaleToPrint,
    isPrintDialogOpen,
    setIsPrintDialogOpen,
    printRef,
    handleEdit,
    handleAdd,
    handleUpdate,
    confirmDeleteSale,
    handleDelete,
    handleRestoreSale,
    handlePrintSale,
    loadData,
    handleCloseDialog,
    handlePrint
  };
}
