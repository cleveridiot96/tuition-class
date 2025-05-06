
import React, { useState, useEffect } from "react";
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
import { Edit, Trash2, Receipt, Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getReceipts, addReceipt, updateReceipt, deleteReceipt } from "@/services/receiptService";
import { useEffect as useEffectOnce } from 'react';
import { getCustomers } from "@/services/storageService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Receipt as ReceiptType, Customer } from "@/services/types";
import { v4 as uuidv4 } from 'uuid';

const Receipts = () => {
  const [receipts, setReceipts] = useState<ReceiptType[]>([]);
  const [deletedReceipts, setDeletedReceipts] = useState<ReceiptType[]>([]);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [receiptToDelete, setReceiptToDelete] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<ReceiptType | null>(null);
  const [editForm, setEditForm] = useState({
    date: new Date().toISOString().split('T')[0],
    receiptNumber: '',
    customerName: '',
    customerId: '',
    amount: 0,
    notes: '',
    paymentMethod: 'cash',
    reference: ''
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  // Load receipts on component mount
  useEffect(() => {
    loadReceipts();
    loadCustomers();
  }, []);
  
  const loadReceipts = () => {
    const allReceipts = getReceipts();
    setReceipts(allReceipts.filter(r => !r.isDeleted));
    setDeletedReceipts(allReceipts.filter(r => r.isDeleted));
  };
  
  const loadCustomers = () => {
    const allCustomers = getCustomers();
    setCustomers(allCustomers);
  };
  
  const handleDeleteConfirm = (id: string) => {
    setReceiptToDelete(id);
    setShowDeleteConfirm(true);
  };
  
  const handleDelete = () => {
    if (!receiptToDelete) return;
    
    deleteReceipt(receiptToDelete);
    
    // Refresh receipt lists
    loadReceipts();
    
    toast.success("Receipt deleted successfully");
    
    setShowDeleteConfirm(false);
    setReceiptToDelete(null);
  };
  
  const handleEdit = (receipt: ReceiptType) => {
    setEditingReceipt(receipt);
    setEditForm({
      date: receipt.date || new Date().toISOString().split('T')[0],
      receiptNumber: receipt.receiptNumber || '',
      customerName: receipt.customerName || '',
      customerId: receipt.customerId || '',
      amount: receipt.amount || 0,
      notes: receipt.notes || '',
      paymentMethod: receipt.paymentMethod || 'cash',
      reference: receipt.reference || ''
    });
    setIsEditDialogOpen(true);
  };
  
  const handleNewReceipt = () => {
    const today = new Date().toISOString().split('T')[0];
    // Generate a new receipt number
    const receiptNumber = `R-${Date.now().toString().slice(-6)}`;
    
    setEditingReceipt(null);
    setEditForm({
      date: today,
      receiptNumber: receiptNumber,
      customerName: '',
      customerId: '',
      amount: 0,
      notes: '',
      paymentMethod: 'cash',
      reference: ''
    });
    setIsAddDialogOpen(true);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingReceipt) {
      // Update existing receipt
      const updatedReceipt = {
        ...editingReceipt,
        date: editForm.date,
        receiptNumber: editForm.receiptNumber,
        customerName: editForm.customerName,
        customerId: editForm.customerId,
        amount: editForm.amount,
        notes: editForm.notes,
        paymentMethod: editForm.paymentMethod,
        reference: editForm.reference
      };
      
      updateReceipt(updatedReceipt);
      
      toast.success("Receipt updated successfully");
      
      setIsEditDialogOpen(false);
      setEditingReceipt(null);
    } else {
      // Add new receipt
      const selectedCustomer = customers.find(c => c.id === editForm.customerId);
      
      const newReceipt: ReceiptType = {
        id: uuidv4(),
        date: editForm.date,
        receiptNumber: editForm.receiptNumber,
        customerName: selectedCustomer?.name || editForm.customerName,
        customerId: editForm.customerId,
        amount: editForm.amount,
        notes: editForm.notes,
        paymentMethod: editForm.paymentMethod as 'cash' | 'bank',
        reference: editForm.reference,
        mode: editForm.paymentMethod as 'cash' | 'bank'
      };
      
      addReceipt(newReceipt);
      toast.success("Receipt added successfully");
      setIsAddDialogOpen(false);
    }
    
    // Refresh receipts list
    loadReceipts();
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (name === 'customerId') {
      const selectedCustomer = customers.find(c => c.id === value);
      setEditForm(prev => ({
        ...prev,
        customerId: value,
        customerName: selectedCustomer?.name || prev.customerName
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleRestore = (receipt: ReceiptType) => {
    const updatedReceipt = { ...receipt, isDeleted: false };
    updateReceipt(updatedReceipt);
    
    // Refresh receipt lists
    loadReceipts();
    
    toast.success(`Receipt ${receipt.receiptNumber} has been restored.`);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-ag-beige pb-10">
      <Navigation title="Receipts" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold">Payment Receipts</h2>
          <div className="flex gap-2 flex-wrap">
            <Button 
              className="flex items-center gap-2"
              onClick={handleNewReceipt}
            >
              <Plus size={18} /> New Receipt
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
          <Card className="p-4 overflow-x-auto">
            <div className="min-w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-medium">{receipt.receiptNumber}</TableCell>
                      <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                      <TableCell>{receipt.customerName}</TableCell>
                      <TableCell className="text-right">{formatCurrency(receipt.amount)}</TableCell>
                      <TableCell>{receipt.paymentMethod || receipt.mode}</TableCell>
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
            </div>
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
      
      {/* Edit/Add Receipt Dialog */}
      <Dialog open={isEditDialogOpen || isAddDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setIsEditDialogOpen(false);
            setIsAddDialogOpen(false);
          }
        }}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingReceipt ? 'Edit Receipt' : 'Add New Receipt'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="customerId">Customer</Label>
                <Select 
                  value={editForm.customerId} 
                  onValueChange={(value) => handleSelectChange('customerId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select 
                  value={editForm.paymentMethod} 
                  onValueChange={(value) => handleSelectChange('paymentMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="reference">Reference / Cheque No.</Label>
                <Input 
                  type="text" 
                  id="reference" 
                  name="reference" 
                  value={editForm.reference} 
                  onChange={handleInputChange}
                />
              </div>
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
              <Button type="button" variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                setIsAddDialogOpen(false);
              }}>
                Cancel
              </Button>
              <Button type="submit">
                {editingReceipt ? 'Update Receipt' : 'Add Receipt'}
              </Button>
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
                      {receipt.customerName} - {formatCurrency(receipt.amount)}
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
