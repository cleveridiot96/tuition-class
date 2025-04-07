
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  ArrowRight, 
  Edit, 
  Trash2,
  Save,
  X
} from "lucide-react";
import Navigation from "@/components/Navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

import { getReceipts, getPayments, updateReceipt, updatePayment, deleteReceipt, deletePayment } from "@/services/storageService";

const CashBook = () => {
  const { toast } = useToast();
  const [cashEntries, setCashEntries] = useState<any[]>([]);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [activeTab, setActiveTab] = useState("all");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadCashEntries();
  }, [currentMonth, currentYear]);

  const loadCashEntries = () => {
    const allReceipts = getReceipts().map(receipt => ({
      ...receipt,
      type: 'receipt'
    }));
    
    const allPayments = getPayments().map(payment => ({
      ...payment,
      type: 'payment'
    }));
    
    // Combine and sort by date (newest first)
    let combined = [...allReceipts, ...allPayments];
    
    // Filter by month/year
    combined = combined.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === currentMonth && 
             entryDate.getFullYear() === currentYear;
    });
    
    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setCashEntries(combined);
    
    console.log("Loaded cash entries:", combined);
  };

  const handleEdit = (entry: any) => {
    setEditingEntryId(entry.id);
    setEditFormData({
      date: entry.date,
      amount: entry.amount,
      paymentMethod: entry.paymentMethod,
      notes: entry.notes || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingEntryId(null);
    setEditFormData({});
  };

  const handleSaveEdit = (entry: any) => {
    const updatedEntry = {
      ...entry,
      ...editFormData
    };
    
    if (entry.type === 'receipt') {
      updateReceipt(updatedEntry);
      toast({
        title: "Receipt Updated",
        description: `Receipt for ${updatedEntry.amount} has been updated.`
      });
    } else {
      updatePayment(updatedEntry);
      toast({
        title: "Payment Updated",
        description: `Payment of ${updatedEntry.amount} has been updated.`
      });
    }
    
    setEditingEntryId(null);
    loadCashEntries();
  };

  const handleDelete = (entry: any) => {
    if (entry.type === 'receipt') {
      deleteReceipt(entry.id);
      toast({
        title: "Receipt Deleted",
        description: `Receipt has been deleted.`
      });
    } else {
      deletePayment(entry.id);
      toast({
        title: "Payment Deleted",
        description: `Payment has been deleted.`
      });
    }
    
    loadCashEntries();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const navigateMonth = (direction: number) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const getMonthName = (month: number) => {
    return new Date(2000, month, 1).toLocaleString('default', { month: 'long' });
  };

  // Calculate summary
  const totalReceipts = cashEntries
    .filter(entry => entry.type === 'receipt')
    .reduce((sum, entry) => sum + entry.amount, 0);
    
  const totalPayments = cashEntries
    .filter(entry => entry.type === 'payment')
    .reduce((sum, entry) => sum + entry.amount, 0);
    
  const balance = totalReceipts - totalPayments;

  const filteredEntries = activeTab === 'all' 
    ? cashEntries 
    : cashEntries.filter(entry => entry.type === activeTab);

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Cash Book" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 grid gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2 items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigateMonth(-1)}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowLeft size={16} />
                  </Button>
                  
                  <h2 className="text-xl font-bold">
                    {getMonthName(currentMonth)} {currentYear}
                  </h2>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigateMonth(1)}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowRight size={16} />
                  </Button>
                </div>
                
                <div className="text-right">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Receipts</p>
                      <p className="font-bold text-green-600">₹{totalReceipts.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Payments</p>
                      <p className="font-bold text-red-600">₹{totalPayments.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Balance</p>
                      <p className={`font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{balance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="all" className="data-[state=active]:bg-F2FCE2">All</TabsTrigger>
                  <TabsTrigger value="receipt" className="data-[state=active]:bg-F2FCE2">Receipts</TabsTrigger>
                  <TabsTrigger value="payment" className="data-[state=active]:bg-F2FCE2">Payments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-4">
                  <div className="space-y-4">
                    {filteredEntries.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No cash entries found for this month.</p>
                      </div>
                    ) : (
                      filteredEntries.map((entry) => (
                        <div 
                          key={`${entry.type}-${entry.id}`} 
                          className={`p-4 rounded-lg border ${
                            entry.type === 'receipt' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                          }`}
                        >
                          {editingEntryId === entry.id ? (
                            <div className="grid grid-cols-1 gap-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="date">Date</Label>
                                  <Input 
                                    id="date" 
                                    name="date" 
                                    type="date" 
                                    value={editFormData.date} 
                                    onChange={handleInputChange} 
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="amount">Amount</Label>
                                  <Input 
                                    id="amount" 
                                    name="amount" 
                                    type="number" 
                                    value={editFormData.amount} 
                                    onChange={handleInputChange} 
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label htmlFor="paymentMethod">Payment Method</Label>
                                <Select 
                                  value={editFormData.paymentMethod} 
                                  onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="UPI">UPI</SelectItem>
                                    <SelectItem value="Check">Check</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Input 
                                  id="notes" 
                                  name="notes" 
                                  value={editFormData.notes} 
                                  onChange={handleInputChange} 
                                />
                              </div>
                              
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={handleCancelEdit}
                                >
                                  <X size={16} className="mr-1" /> Cancel
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleSaveEdit(entry)}
                                >
                                  <Save size={16} className="mr-1" /> Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-semibold">
                                    {entry.type === 'receipt' 
                                      ? `Receipt from ${entry.customer}` 
                                      : `Payment to ${entry.party}`}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {format(new Date(entry.date), 'dd MMM yyyy')} &bull; {entry.paymentMethod}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className={`font-bold text-lg ${entry.type === 'receipt' ? 'text-green-600' : 'text-red-600'}`}>
                                    {entry.type === 'receipt' ? '+' : '-'}₹{entry.amount.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-gray-500">{entry.reference || ''}</p>
                                </div>
                              </div>
                              {entry.notes && (
                                <div className="mt-2">
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Notes:</span> {entry.notes}
                                  </p>
                                </div>
                              )}
                              <div className="flex justify-end gap-2 mt-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEdit(entry)}
                                >
                                  <Edit size={16} />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete {entry.type === 'receipt' ? 'Receipt' : 'Payment'}
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this {entry.type}? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDelete(entry)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="receipt" className="mt-4">
                  <div className="space-y-4">
                    {filteredEntries.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No receipts found for this month.</p>
                      </div>
                    ) : (
                      filteredEntries.map((entry) => (
                        <div 
                          key={`receipt-${entry.id}`} 
                          className="p-4 rounded-lg border bg-green-50 border-green-200"
                        >
                          {editingEntryId === entry.id ? (
                            // Edit form - Same as above
                            <div className="grid grid-cols-1 gap-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="date">Date</Label>
                                  <Input 
                                    id="date" 
                                    name="date" 
                                    type="date" 
                                    value={editFormData.date} 
                                    onChange={handleInputChange} 
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="amount">Amount</Label>
                                  <Input 
                                    id="amount" 
                                    name="amount" 
                                    type="number" 
                                    value={editFormData.amount} 
                                    onChange={handleInputChange} 
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label htmlFor="paymentMethod">Payment Method</Label>
                                <Select 
                                  value={editFormData.paymentMethod} 
                                  onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="UPI">UPI</SelectItem>
                                    <SelectItem value="Check">Check</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Input 
                                  id="notes" 
                                  name="notes" 
                                  value={editFormData.notes} 
                                  onChange={handleInputChange} 
                                />
                              </div>
                              
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={handleCancelEdit}
                                >
                                  <X size={16} className="mr-1" /> Cancel
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleSaveEdit(entry)}
                                >
                                  <Save size={16} className="mr-1" /> Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // Display view - Same as above
                            <>
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-semibold">
                                    Receipt from {entry.customer}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {format(new Date(entry.date), 'dd MMM yyyy')} &bull; {entry.paymentMethod}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg text-green-600">
                                    +₹{entry.amount.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-gray-500">{entry.reference || ''}</p>
                                </div>
                              </div>
                              {entry.notes && (
                                <div className="mt-2">
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Notes:</span> {entry.notes}
                                  </p>
                                </div>
                              )}
                              <div className="flex justify-end gap-2 mt-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEdit(entry)}
                                >
                                  <Edit size={16} />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Receipt</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this receipt? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDelete(entry)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="payment" className="mt-4">
                  <div className="space-y-4">
                    {filteredEntries.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No payments found for this month.</p>
                      </div>
                    ) : (
                      filteredEntries.map((entry) => (
                        <div 
                          key={`payment-${entry.id}`} 
                          className="p-4 rounded-lg border bg-red-50 border-red-200"
                        >
                          {editingEntryId === entry.id ? (
                            // Edit form - Same as above
                            <div className="grid grid-cols-1 gap-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="date">Date</Label>
                                  <Input 
                                    id="date" 
                                    name="date" 
                                    type="date" 
                                    value={editFormData.date} 
                                    onChange={handleInputChange} 
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="amount">Amount</Label>
                                  <Input 
                                    id="amount" 
                                    name="amount" 
                                    type="number" 
                                    value={editFormData.amount} 
                                    onChange={handleInputChange} 
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label htmlFor="paymentMethod">Payment Method</Label>
                                <Select 
                                  value={editFormData.paymentMethod} 
                                  onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="UPI">UPI</SelectItem>
                                    <SelectItem value="Check">Check</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Input 
                                  id="notes" 
                                  name="notes" 
                                  value={editFormData.notes} 
                                  onChange={handleInputChange} 
                                />
                              </div>
                              
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={handleCancelEdit}
                                >
                                  <X size={16} className="mr-1" /> Cancel
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleSaveEdit(entry)}
                                >
                                  <Save size={16} className="mr-1" /> Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // Display view - Same as above
                            <>
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-semibold">
                                    Payment to {entry.party}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {format(new Date(entry.date), 'dd MMM yyyy')} &bull; {entry.paymentMethod}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg text-red-600">
                                    -₹{entry.amount.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-gray-500">{entry.reference || ''}</p>
                                </div>
                              </div>
                              {entry.notes && (
                                <div className="mt-2">
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Notes:</span> {entry.notes}
                                  </p>
                                </div>
                              )}
                              <div className="flex justify-end gap-2 mt-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEdit(entry)}
                                >
                                  <Edit size={16} />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Payment</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this payment? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDelete(entry)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CashBook;
