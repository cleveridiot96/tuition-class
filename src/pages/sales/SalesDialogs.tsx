
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import SimpleSalesForm from "@/components/sales/SimpleSalesForm";
import SalesReceipt from "@/components/SalesReceipt";
import { Sale } from "@/services/types";

export default function SalesDialogs({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  editingSale,
  handleAdd,
  handleUpdate,
  handleCloseDialog,
  handlePrintSale,
  isPrintDialogOpen,
  setIsPrintDialogOpen,
  saleToPrint,
  printRef,
  showDeleteConfirm,
  setShowDeleteConfirm,
  saleToDelete,
  handleDelete
}: any) {
  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            Add Sale
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90vw] max-w-[900px] max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Add New Sale</DialogTitle>
            <DialogDescription>Fill in the details to record a new sale</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-130px)] px-6 py-4">
            <SimpleSalesForm onSubmit={handleAdd} onCancel={handleCloseDialog} />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={(open: boolean) => {
        setIsEditDialogOpen(open);
        if (!open) handleCloseDialog();
      }}>
        <DialogContent className="w-[90vw] max-w-[900px] max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Edit Sale</DialogTitle>
            <DialogDescription>Modify the sale details</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-130px)] px-6 py-4">
            {editingSale && (
              <SimpleSalesForm
                onSubmit={handleUpdate}
                onCancel={handleCloseDialog}
                initialData={editingSale}
                onPrint={() => {
                  setIsEditDialogOpen(false);
                  setTimeout(() => handlePrintSale(editingSale), 300);
                }}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this sale? This action will restore the quantity to inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteConfirm(false);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="w-[90vw] max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Print Sale Receipt</DialogTitle>
            <DialogDescription>Preview the sales receipt before printing</DialogDescription>
          </DialogHeader>
          <div ref={printRef} className="p-4 bg-white">
            {saleToPrint && <SalesReceipt sale={saleToPrint} />}
          </div>
          <DialogFooter>
            <Button onClick={handlePrintSale}>Print Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
