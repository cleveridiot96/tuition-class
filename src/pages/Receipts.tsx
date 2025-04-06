
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReceiptItem {
  id: string;
  date: string;
  receiptNumber: string;
  partyName: string;
  amount: number;
  notes: string;
}

const Receipts = () => {
  const { toast } = useToast();
  const [receipts, setReceipts] = useState<ReceiptItem[]>([
    {
      id: "1",
      date: "2025-04-01",
      receiptNumber: "REC-001",
      partyName: "Arvind",
      amount: 25000,
      notes: "Payment received for invoice INV-2023-001"
    },
    {
      id: "2",
      date: "2025-04-02",
      receiptNumber: "REC-002",
      partyName: "ABC Trading",
      amount: 15000,
      notes: "Partial payment"
    },
    {
      id: "3",
      date: "2025-04-03",
      receiptNumber: "REC-003",
      partyName: "XYZ Enterprises",
      amount: 30000,
      notes: "Full payment for lot CD/5"
    }
  ]);
  const [deletedReceipts, setDeletedReceipts] = useState<ReceiptItem[]>([]);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [receiptToDelete, setReceiptToDelete] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<ReceiptItem | null>(null);
  const [editForm, setEditForm] = useState({
    date: "",
    receiptNumber: "",
    partyName: "",
    amount: 0,
    notes: ""
  });
  
  const handleDeleteConfirm = (id: string) => {
    setReceiptToDelete(id);
    setShowDeleteConfirm(true);
  };
  
  const handleDelete = () => {
    if (!receiptToDelete) return;
    
    const receiptToRemove = receipts.find(r => r.id === receiptToDelete);
    if (receiptToRemove) {
      setDeletedReceipts(prev => [...prev, receiptToRemove]);
      setReceipts(prev => prev.filter(r => r.id !== receiptToDelete));
      toast({
        title: "Receipt Deleted",
        description: `Receipt ${receiptToRemove.receiptNumber} has been deleted.`
      });
    }
    
    setShowDeleteConfirm(false);
    setReceiptToDelete(null);
  };
  
  const handleEdit = (receipt: ReceiptItem) => {
    setEditingReceipt(receipt);
    setEditForm({
      date: receipt.date,
      receiptNumber: receipt.receiptNumber,
      partyName: receipt.partyName,
      amount: receipt.amount,
      notes: receipt.notes
    });
    setIsEditDialogOpen(true);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingReceipt) return;
    
    const updatedReceipt: ReceiptItem = {
      ...editingReceipt,
      date: editForm.date,
      receiptNumber: editForm.receiptNumber,
      partyName: editForm.partyName,
      amount: editForm.amount,
      notes: editForm.notes
    };
    
    setReceipts(prev => prev.map(r => r.id === updatedReceipt.id ? updatedReceipt : r));
    
    toast({
      title: "Receipt Updated",
      description: `Receipt ${updatedReceipt.receiptNumber} has been updated.`
    });
    
    setIsEditDialogOpen(false);
    setEditingReceipt(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };
  
  const handleRestore = (receipt: ReceiptItem) => {
    setReceipts(prev => [...prev, receipt]);
    setDeletedReceipts(prev => prev.filter(r => r.id !== receipt.id));
    toast({
      title: "Receipt Restored",
      description: `Receipt ${receipt.receiptNumber} has been restored.`
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Receipts" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Payment Receipts</h2>
          <div className="flex gap-2">
            <Button 
              className="flex items-center gap-2"
            >
              <Receipt size={18} /> New Receipt
            </Button>
            <Button 
              onClick={() => setShowRestoreDialog(true)}
              variant="outline"
              className="flex items-center gap-2"
              disabled={deletedReceipts.length === 0}
            >
              Restore Deleted ({deletedReceipts.length})
            </Button>
          </div>
        </div>
        
        {receipts.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-xl text-ag-brown">No receipts found.</p>
            <p className="text-lg text-ag-brown-light mt-2">
              Create a new receipt to get started.
            </p>
          </Card>
        ) : (
          <Card className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-medium">{receipt.receiptNumber}</TableCell>
                    <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                    <TableCell>{receipt.partyName}</TableCell>
                    <TableCell className="text-right">{formatCurrency(receipt.amount)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{receipt.notes}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(receipt)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteConfirm(receipt.id)}
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this receipt? This action can be undone by using the Restore function.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteConfirm(false);
              setReceiptToDelete(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Edit Receipt Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Receipt</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input 
                type="date" 
                id="date" 
                name="date" 
                value={editForm.date} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="receiptNumber">Receipt Number</Label>
              <Input 
                type="text" 
                id="receiptNumber" 
                name="receiptNumber" 
                value={editForm.receiptNumber} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="partyName">Party Name</Label>
              <Input 
                type="text" 
                id="partyName" 
                name="partyName" 
                value={editForm.partyName} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input 
                type="number" 
                id="amount" 
                name="amount" 
                value={editForm.amount} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <textarea 
                id="notes" 
                name="notes" 
                className="w-full h-20 p-2 border rounded" 
                value={editForm.notes} 
                onChange={handleInputChange}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Receipt</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Restore Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Restore Deleted Receipts</DialogTitle>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto">
            {deletedReceipts.length > 0 ? (
              deletedReceipts.map(receipt => (
                <div key={receipt.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{receipt.receiptNumber}</p>
                    <p className="text-sm text-gray-500">
                      {receipt.partyName} - {formatCurrency(receipt.amount)}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleRestore(receipt)}
                  >
                    Restore
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center py-4">No deleted receipts to restore</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Receipts;
