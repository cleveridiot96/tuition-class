import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusCircle, Save, ArrowLeft, Edit, Trash2, RefreshCcw } from "lucide-react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getBrokers
} from "@/services/storageService";

const SALES_STORAGE_KEY = "app_sales_data";
const DELETED_SALES_STORAGE_KEY = "app_deleted_sales";
const INVENTORY_STORAGE_KEY = "app_inventory_data";
const CUSTOMERS_STORAGE_KEY = "app_customers_data";
const BROKERS_STORAGE_KEY = "app_brokers_data";

interface SaleEntry {
  id: string;
  date: string;
  lotNumber: string;
  quantity: number;
  customer: string;
  broker: string;
  amount: number;
  paymentType: "full" | "partial" | "cash";
  paymentReceived: number;
  notes: string;
  billNumber: string;
  billAmount: number;
  cashAmount: number;
}

interface InventoryItem {
  id: string;
  lotNumber: string;
  date: string;
  variety: string;
  quantity: number;
  availableQuantity: number;
  unit: "bag" | "box";
  supplier: string;
  pricePerUnit: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  outstandingBalance: number;
  broker?: string;
}

interface Broker {
  id: string;
  name: string;
}

const Sales = () => {
  const { toast } = useToast();
  const [sales, setSales] = useState<SaleEntry[]>([]);
  const [deletedSales, setDeletedSales] = useState<SaleEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    outstandingBalance: 0,
    broker: ""
  });
  
  const [formData, setFormData] = useState<Omit<SaleEntry, "id">>({
    date: new Date().toISOString().split('T')[0],
    lotNumber: "",
    quantity: 0,
    customer: "",
    broker: "",
    amount: 0,
    paymentType: "full",
    paymentReceived: 0,
    notes: "",
    billNumber: "",
    billAmount: 0,
    cashAmount: 0
  });
  
  useEffect(() => {
    const loadSalesData = () => {
      const savedSales = localStorage.getItem(SALES_STORAGE_KEY);
      if (savedSales) {
        setSales(JSON.parse(savedSales));
      }
      
      const savedDeletedSales = localStorage.getItem(DELETED_SALES_STORAGE_KEY);
      if (savedDeletedSales) {
        setDeletedSales(JSON.parse(savedDeletedSales));
      }
    };
    
    const loadInventoryData = () => {
      const savedInventory = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (savedInventory) {
        setInventory(JSON.parse(savedInventory));
      }
    };
    
    const loadCustomersData = () => {
      const savedCustomers = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
      if (savedCustomers) {
        setCustomers(JSON.parse(savedCustomers));
      }
    };

    const loadBrokersData = () => {
      setBrokers(getBrokers());
    };
    
    loadSalesData();
    loadInventoryData();
    loadCustomersData();
    loadBrokersData();
  }, []);

  useEffect(() => {
    localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(sales));
  }, [sales]);
  
  useEffect(() => {
    localStorage.setItem(DELETED_SALES_STORAGE_KEY, JSON.stringify(deletedSales));
  }, [deletedSales]);
  
  useEffect(() => {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
  }, [inventory]);
  
  useEffect(() => {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numFields = ["quantity", "amount", "paymentReceived", "billAmount", "cashAmount"];
    setFormData((prev) => ({
      ...prev,
      [name]: numFields.includes(name) ? Number(value) : value
    }));
    
    if (name === "amount" && (formData.paymentType === "full" || formData.paymentType === "cash")) {
      setFormData((prev) => ({
        ...prev,
        paymentReceived: Number(value),
        billAmount: formData.paymentType === "cash" ? 0 : Number(value)
      }));
    }
    
    if (name === "paymentReceived") {
      const paymentReceived = Number(value);
      if (formData.paymentType === "partial") {
        setFormData((prev) => ({
          ...prev,
          cashAmount: paymentReceived,
          billAmount: prev.amount - paymentReceived
        }));
      }
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "lotNumber") {
      const selectedItem = inventory.find(item => item.lotNumber === value);
      if (selectedItem) {
        setFormData((prev) => ({
          ...prev,
          lotNumber: value,
          quantity: 0
        }));
      }
    } else if (name === "customer") {
      const selectedCustomer = customers.find(customer => customer.name === value);
      setFormData((prev) => ({
        ...prev,
        customer: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRadioChange = (value: "full" | "partial" | "cash") => {
    setFormData((prev) => {
      const newState = { ...prev, paymentType: value };
      
      if (value === "full") {
        newState.paymentReceived = newState.amount;
        newState.billAmount = newState.amount;
        newState.cashAmount = 0;
      } else if (value === "cash") {
        newState.paymentReceived = newState.amount;
        newState.billAmount = 0;
        newState.cashAmount = newState.amount;
      } else if (value === "partial") {
        newState.billAmount = Math.max(0, newState.amount - newState.paymentReceived);
        newState.cashAmount = newState.paymentReceived;
      }
      
      return newState;
    });
  };

  const updateInventoryQuantity = (lotNumber: string, quantitySold: number, isAdding = false) => {
    setInventory(prev => 
      prev.map(item => {
        if (item.lotNumber === lotNumber) {
          const newAvailableQuantity = isAdding 
            ? item.availableQuantity + quantitySold 
            : item.availableQuantity - quantitySold;
          
          return {
            ...item,
            availableQuantity: newAvailableQuantity
          };
        }
        return item;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedLot = inventory.find(item => item.lotNumber === formData.lotNumber);
    
    if (!selectedLot) {
      toast({
        title: "Error",
        description: `Lot ${formData.lotNumber} not found in inventory.`,
        variant: "destructive"
      });
      return;
    }
    
    if (editingId) {
      const originalSale = sales.find(sale => sale.id === editingId);
      if (originalSale) {
        updateInventoryQuantity(originalSale.lotNumber, originalSale.quantity, true);
      }
    }
    
    const availableAfterUpdate = selectedLot.availableQuantity - formData.quantity;
    
    if (availableAfterUpdate < 0) {
      toast({
        title: "Insufficient Inventory",
        description: `Only ${selectedLot.availableQuantity} ${selectedLot.unit}s available in lot ${selectedLot.lotNumber}.`,
        variant: "destructive"
      });
      return;
    }
    
    updateInventoryQuantity(formData.lotNumber, formData.quantity);
    
    if (editingId) {
      setSales(prev => 
        prev.map(sale => 
          sale.id === editingId 
            ? { ...formData, id: editingId } 
            : sale
        )
      );
      
      toast({
        title: "Sale Updated",
        description: `Sale of ${formData.quantity} units from lot ${formData.lotNumber} updated successfully.`
      });
      
      setEditingId(null);
    } else {
      const newSale: SaleEntry = {
        id: Date.now().toString(),
        ...formData
      };
      
      setSales(prev => [newSale, ...prev]);
      
      toast({
        title: "Sale Added",
        description: `Sale of ${formData.quantity} units from lot ${formData.lotNumber} added successfully.`
      });
    }
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
      lotNumber: "",
      quantity: 0,
      customer: "",
      broker: "",
      amount: 0,
      paymentType: "full",
      paymentReceived: 0,
      notes: "",
      billNumber: "",
      billAmount: 0,
      cashAmount: 0
    });
    
    setShowForm(false);
  };
  
  const handleEdit = (sale: SaleEntry) => {
    setFormData({
      date: sale.date,
      lotNumber: sale.lotNumber,
      quantity: sale.quantity,
      customer: sale.customer,
      broker: sale.broker,
      amount: sale.amount,
      paymentType: sale.paymentType,
      paymentReceived: sale.paymentReceived,
      notes: sale.notes,
      billNumber: sale.billNumber || "",
      billAmount: sale.billAmount || 0,
      cashAmount: sale.cashAmount || 0
    });
    
    setEditingId(sale.id);
    setShowForm(true);
  };
  
  const handleDelete = (id: string) => {
    const saleToDelete = sales.find(sale => sale.id === id);
    if (saleToDelete) {
      setDeletedSales(prev => [saleToDelete, ...prev]);
      setSales(prev => prev.filter(sale => sale.id !== id));
      updateInventoryQuantity(saleToDelete.lotNumber, saleToDelete.quantity, true);
      
      toast({
        title: "Sale Deleted",
        description: `Sale from lot ${saleToDelete.lotNumber} has been deleted and moved to archive.`
      });
    }
  };
  
  const handleRestore = (id: string) => {
    const saleToRestore = deletedSales.find(sale => sale.id === id);
    if (saleToRestore) {
      const selectedLot = inventory.find(item => item.lotNumber === saleToRestore.lotNumber);
      
      if (!selectedLot) {
        toast({
          title: "Error",
          description: `Cannot restore sale: Lot ${saleToRestore.lotNumber} no longer exists in inventory.`,
          variant: "destructive"
        });
        return;
      }
      
      const availableAfterUpdate = selectedLot.availableQuantity - saleToRestore.quantity;
      
      if (availableAfterUpdate < 0) {
        toast({
          title: "Insufficient Inventory",
          description: `Cannot restore sale: Only ${selectedLot.availableQuantity} ${selectedLot.unit}s available in lot ${selectedLot.lotNumber}.`,
          variant: "destructive"
        });
        return;
      }
      
      updateInventoryQuantity(saleToRestore.lotNumber, saleToRestore.quantity);
      
      setSales(prev => [saleToRestore, ...prev]);
      setDeletedSales(prev => prev.filter(sale => sale.id !== id));
      
      toast({
        title: "Sale Restored",
        description: `Sale from lot ${saleToRestore.lotNumber} has been restored.`
      });
    }
  };
  
  const handleAddNewCustomer = () => {
    const similarCustomers = customers.filter(c => 
      isSimilarName(c.name, newCustomer.name)
    );
    
    if (similarCustomers.length > 0) {
      if (window.confirm(`Similar customer "${similarCustomers[0].name}" already exists. Are you sure you want to add "${newCustomer.name}"?`)) {
        addCustomer();
      }
    } else {
      addCustomer();
    }
  };
  
  const addCustomer = () => {
    const customer: Customer = {
      id: Date.now().toString(),
      ...newCustomer
    };
    
    setCustomers(prev => [...prev, customer]);
    
    toast({
      title: "Customer Added",
      description: `Customer ${newCustomer.name} has been added.`
    });
    
    setFormData(prev => ({
      ...prev,
      customer: newCustomer.name
    }));
    
    setNewCustomer({
      name: "",
      phone: "",
      address: "",
      outstandingBalance: 0,
      broker: ""
    });
    setShowNewCustomerDialog(false);
  };
  
  const isSimilarName = (name1: string, name2: string): boolean => {
    const clean1 = name1.toLowerCase().replace(/\s+/g, "");
    const clean2 = name2.toLowerCase().replace(/\s+/g, "");
    
    if (clean1.length < 5 || clean2.length < 5) {
      return clean1 === clean2;
    }
    
    let matches = 0;
    const minLength = Math.min(clean1.length, clean2.length);
    
    for (let i = 0; i < minLength; i++) {
      if (clean1[i] === clean2[i]) {
        matches++;
      }
    }
    
    return matches / minLength > 0.7;
  };
  
  const getCustomerOutstandingBalance = (customerName: string): number => {
    const customer = customers.find(c => c.name === customerName);
    return customer?.outstandingBalance || 0;
  };
  
  const getAvailableQuantity = (lotNumber: string): number => {
    const item = inventory.find(i => i.lotNumber === lotNumber);
    return item?.availableQuantity || 0;
  };
  
  const availableInventory = inventory.filter(item => item.availableQuantity > 0);

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Sales" showBackButton />
      <div className="container mx-auto px-4 py-6">
        {!showForm ? (
          <>
            <div className="flex justify-between mb-6">
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowDeleted(!showDeleted)}
                  variant={showDeleted ? "default" : "outline"}
                  className="flex gap-2 items-center"
                >
                  <RefreshCcw size={18} />
                  {showDeleted ? "Hide Deleted" : "Show Deleted"}
                </Button>
              </div>
              <Button
                onClick={() => setShowForm(true)}
                className="action-button flex gap-2 items-center"
              >
                <PlusCircle size={24} />
                New Sale
              </Button>
            </div>

            {showDeleted ? (
              <Card className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Lot</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Broker</TableHead>
                      <TableHead>Bill #</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deletedSales.map((sale) => (
                      <TableRow key={sale.id} className="border-dashed border-red-300">
                        <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                        <TableCell>{sale.lotNumber}</TableCell>
                        <TableCell>{sale.quantity}</TableCell>
                        <TableCell>{sale.customer}</TableCell>
                        <TableCell>{sale.broker || "-"}</TableCell>
                        <TableCell>{sale.billNumber || "-"}</TableCell>
                        <TableCell>₹{sale.amount}</TableCell>
                        <TableCell>₹{sale.paymentReceived}</TableCell>
                        <TableCell className={sale.amount - sale.paymentReceived > 0 ? "text-red-500 font-bold" : ""}>
                          ₹{sale.amount - sale.paymentReceived}
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex items-center gap-1">
                                <RefreshCcw size={16} />
                                Restore
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Restore Sale</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to restore this sale? This will update inventory quantities.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRestore(sale.id)}>
                                  Restore Sale
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            ) : (
              <Card className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Lot</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Broker</TableHead>
                      <TableHead>Bill #</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                        <TableCell>{sale.lotNumber}</TableCell>
                        <TableCell>{sale.quantity}</TableCell>
                        <TableCell>{sale.customer}</TableCell>
                        <TableCell>{sale.broker || "-"}</TableCell>
                        <TableCell>{sale.billNumber || "-"}</TableCell>
                        <TableCell>₹{sale.amount}</TableCell>
                        <TableCell>₹{sale.paymentReceived}</TableCell>
                        <TableCell className={sale.amount - sale.paymentReceived > 0 ? "text-red-500 font-bold" : ""}>
                          ₹{sale.amount - sale.paymentReceived}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => handleEdit(sale)}>
                              <Edit size={16} />
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" className="flex items-center gap-1">
                                  <Trash2 size={16} />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Sale</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this sale? This will update inventory quantities.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(sale.id)}>
                                    Delete Sale
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </>
        ) : (
          <Card className="form-section">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    date: new Date().toISOString().split('T')[0],
                    lotNumber: "",
                    quantity: 0,
                    customer: "",
                    broker: "",
                    amount: 0,
                    paymentType: "full",
                    paymentReceived: 0,
                    notes: "",
                    billNumber: "",
                    billAmount: 0,
                    cashAmount: 0
                  });
                }}
                className="mr-2"
              >
                <ArrowLeft size={24} />
              </Button>
              <h2 className="form-title">{editingId ? "Edit Sale" : "New Sale"}</h2>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <Label htmlFor="date" className="form-label">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="text-lg p-6"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <Label htmlFor="lotNumber" className="form-label">Lot Number</Label>
                  <Select
                    value={formData.lotNumber}
                    onValueChange={(value) => handleSelectChange("lotNumber", value)}
                    disabled={editingId !== null}
                  >
                    <SelectTrigger className="text-lg p-6">
                      <SelectValue placeholder="Select a lot" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableInventory.length === 0 ? (
                        <SelectItem value="none" disabled>No inventory available</SelectItem>
                      ) : (
                        availableInventory.map((item) => (
                          <SelectItem key={item.id} value={item.lotNumber}>
                            {item.lotNumber} - {item.variety} ({item.availableQuantity} {item.unit}s)
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {formData.lotNumber && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Available: {getAvailableQuantity(formData.lotNumber)} units
                    </p>
                  )}
                </div>
                
                <div className="form-group">
                  <Label htmlFor="quantity" className="form-label">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    placeholder="10"
                    value={formData.quantity || ""}
                    onChange={handleChange}
                    className="text-lg p-6"
                    required
                    max={
                      formData.lotNumber ? 
                      (editingId ? 
                        getAvailableQuantity(formData.lotNumber) + 
                        (sales.find(s => s.id === editingId)?.quantity || 0) :
                        getAvailableQuantity(formData.lotNumber)) : 
                      undefined
                    }
                  />
                </div>
                
                <div className="form-group">
                  <Label htmlFor="customer" className="form-label">Customer</Label>
                  <div className="flex justify-between">
                    <Label htmlFor="customer" className="form-label">Customer</Label>
                    <Dialog open={showNewCustomerDialog} onOpenChange={setShowNewCustomerDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex gap-1 items-center">
                          <PlusCircle size={16} />
                          New Customer
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Customer</DialogTitle>
                          <DialogDescription>
                            Enter customer details to add them to your list.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="newCustomerName">Customer Name</Label>
                            <Input
                              id="newCustomerName"
                              value={newCustomer.name}
                              onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="newCustomerBroker">Broker</Label>
                            <Select
                              value={newCustomer.broker}
                              onValueChange={(value) => setNewCustomer({...newCustomer, broker: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select broker (optional)" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="no-broker">No Broker</SelectItem>
                                {brokers.map((broker) => (
                                  <SelectItem key={broker.id} value={broker.name}>
                                    {broker.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="newCustomerPhone">Phone</Label>
                            <Input
                              id="newCustomerPhone"
                              value={newCustomer.phone}
                              onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="newCustomerAddress">Address</Label>
                            <Input
                              id="newCustomerAddress"
                              value={newCustomer.address}
                              onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowNewCustomerDialog(false)}>Cancel</Button>
                          <Button onClick={handleAddNewCustomer}>Add Customer</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Select
                    value={formData.customer}
                    onValueChange={(value) => handleSelectChange("customer", value)}
                  >
                    <SelectTrigger className="text-lg p-6">
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.length === 0 ? (
                        <SelectItem value="no-customers-available" disabled>No customers available</SelectItem>
                      ) : (
                        customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.name}>
                            {customer.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  
                  {formData.customer && (
                    <div className="mt-2 p-2 bg-gray-100 rounded-md">
                      <p className="text-sm font-semibold">
                        Outstanding Balance: 
                        <span className={getCustomerOutstandingBalance(formData.customer) > 0 ? "text-red-500 ml-2" : "ml-2"}>
                          ₹{getCustomerOutstandingBalance(formData.customer)}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <Label htmlFor="broker" className="form-label">Broker (Optional)</Label>
                  <Input
                    id="broker"
                    name="broker"
                    placeholder="Broker name (if applicable)"
                    value={formData.broker}
                    onChange={handleChange}
                    className="text-lg p-6"
                  />
                </div>
                
                <div className="form-group">
                  <Label htmlFor="billNumber" className="form-label">Bill Number</Label>
                  <Input
                    id="billNumber"
                    name="billNumber"
                    placeholder="Invoice/Bill Number"
                    value={formData.billNumber}
                    onChange={handleChange}
                    className="text-lg p-6"
                  />
                </div>
                
                <div className="form-group">
                  <Label htmlFor="amount" className="form-label">Total Amount</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="50000"
                    value={formData.amount || ""}
                    onChange={handleChange}
                    className="text-lg p-6"
                    required
                  />
                </div>
                
                <div className="form-group md:col-span-2">
                  <Label className="form-label">Payment Type</Label>
                  <RadioGroup 
                    value={formData.paymentType} 
                    onValueChange={(value: "full" | "partial" | "cash") => handleRadioChange(value)}
                    className="flex flex-col space-y-2 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full" id="full" />
                      <Label htmlFor="full" className="text-lg">Full Invoice (Bill)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="partial" id="partial" />
                      <Label htmlFor="partial" className="text-lg">Partial Payment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="text-lg">Cash Only</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {formData.paymentType === "partial" && (
                  <div className="form-group md:col-span-2">
                    <Label htmlFor="paymentReceived" className="form-label">Amount Received (Cash)</Label>
                    <Input
                      id="paymentReceived"
                      name="paymentReceived"
                      type="number"
                      placeholder="25000"
                      value={formData.paymentReceived || ""}
                      onChange={handleChange}
                      className="text-lg p-6"
                      required
                      max={formData.amount}
                    />
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label>Cash Amount</Label>
                        <p className="text-lg font-bold">₹{formData.cashAmount}</p>
                      </div>
                      <div>
                        <Label>Bill Amount</Label>
                        <p className="text-lg font-bold">₹{formData.billAmount}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="form-group md:col-span-2">
                  <Label htmlFor="notes" className="form-label">Notes</Label>
                  <Input
                    id="notes"
                    name="notes"
                    placeholder="Additional notes..."
                    value={formData.notes}
                    onChange={handleChange}
                    className="text-lg p-6"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  type="submit" 
                  className="action-button flex gap-2 items-center"
                >
                  <Save size={24} />
                  {editingId ? "Update Sale" : "Save Sale"}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
      <Dialog open={showNewCustomerDialog} onOpenChange={setShowNewCustomerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Enter customer details to add them to your list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="newCustomerName">Customer Name</Label>
              <Input
                id="newCustomerName"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newCustomerBroker">Broker</Label>
              <Select
                value={newCustomer.broker}
                onValueChange={(value) => setNewCustomer({...newCustomer, broker: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select broker (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-broker">No Broker</SelectItem>
                  {brokers.map((broker) => (
                    <SelectItem key={broker.id} value={broker.name}>
                      {broker.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newCustomerPhone">Phone</Label>
              <Input
                id="newCustomerPhone"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newCustomerAddress">Address</Label>
              <Input
                id="newCustomerAddress"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewCustomerDialog(false)}>Cancel</Button>
            <Button onClick={handleAddNewCustomer}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sales;
