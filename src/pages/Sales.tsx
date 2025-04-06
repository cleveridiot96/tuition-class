
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
import { PlusCircle, Save, ArrowLeft, Edit, Trash2, RefreshCcw, X } from "lucide-react";
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

// Storage keys
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
  profit: number;
  purchasePricePerUnit: number;
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
  const [showNewBrokerDialog, setShowNewBrokerDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    outstandingBalance: 0
  });
  const [newBroker, setNewBroker] = useState({
    name: ""
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
    cashAmount: 0,
    profit: 0,
    purchasePricePerUnit: 0
  });
  
  // Load data from local storage
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
      const savedBrokers = localStorage.getItem(BROKERS_STORAGE_KEY);
      if (savedBrokers) {
        setBrokers(JSON.parse(savedBrokers));
      } else {
        // Initialize with empty array if no brokers exist
        setBrokers([]);
      }
    };
    
    loadSalesData();
    loadInventoryData();
    loadCustomersData();
    loadBrokersData();
  }, []);

  // Save data to local storage when it changes
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
  
  useEffect(() => {
    localStorage.setItem(BROKERS_STORAGE_KEY, JSON.stringify(brokers));
  }, [brokers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numFields = ["quantity", "amount", "paymentReceived", "billAmount", "cashAmount"];
    setFormData((prev) => ({
      ...prev,
      [name]: numFields.includes(name) ? Number(value) : value
    }));
    
    // Auto-update paymentReceived when amount changes and paymentType is "full" or "cash"
    if (name === "amount" && (formData.paymentType === "full" || formData.paymentType === "cash")) {
      setFormData((prev) => ({
        ...prev,
        paymentReceived: Number(value),
        billAmount: formData.paymentType === "cash" ? 0 : Number(value)
      }));
    }
    
    // Auto-update cashAmount and billAmount based on paymentReceived
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

    // Calculate profit when quantity or amount changes
    if (name === "quantity" || name === "amount") {
      calculateProfit(
        name === "quantity" ? Number(value) : formData.quantity,
        name === "amount" ? Number(value) : formData.amount,
        formData.purchasePricePerUnit
      );
    }
  };

  const calculateProfit = (quantity: number, totalAmount: number, purchasePricePerUnit: number) => {
    if (quantity && totalAmount && purchasePricePerUnit) {
      const totalPurchasePrice = purchasePricePerUnit * quantity;
      const profit = totalAmount - totalPurchasePrice;
      
      setFormData(prev => ({
        ...prev,
        profit
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "lotNumber") {
      // Find inventory item with this lot number
      const selectedItem = inventory.find(item => item.lotNumber === value);
      if (selectedItem) {
        setFormData((prev) => ({
          ...prev,
          lotNumber: value,
          quantity: 0, // Reset quantity when lot changes
          purchasePricePerUnit: selectedItem.pricePerUnit
        }));
      }
    } else if (name === "customer") {
      // Find customer details when customer is selected
      const selectedCustomer = customers.find(customer => customer.name === value);
      setFormData((prev) => ({
        ...prev,
        customer: value,
      }));
    } else if (name === "broker") {
      setFormData((prev) => ({
        ...prev,
        broker: value
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleClearBroker = () => {
    setFormData(prev => ({
      ...prev,
      broker: ""
    }));
  };

  const handleRadioChange = (value: "full" | "partial" | "cash") => {
    setFormData((prev) => {
      const newState = { ...prev, paymentType: value };
      
      // Adjust payment received and bill/cash amounts based on payment type
      if (value === "full") {
        newState.paymentReceived = newState.amount;
        newState.billAmount = newState.amount;
        newState.cashAmount = 0;
      } else if (value === "cash") {
        newState.paymentReceived = newState.amount;
        newState.billAmount = 0;
        newState.cashAmount = newState.amount;
      } else if (value === "partial") {
        // For partial, leave paymentReceived as is
        newState.billAmount = Math.max(0, newState.amount - newState.paymentReceived);
        newState.cashAmount = newState.paymentReceived;
      }
      
      return newState;
    });
  };

  const updateInventoryQuantity = (lotNumber: string, quantitySold: number, isAdding = false) => {
    // Update inventory quantity when a sale is made or updated
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
    
    // Check if the selected lot exists and has sufficient quantity
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
      // If editing, first restore the original quantity to inventory
      const originalSale = sales.find(sale => sale.id === editingId);
      if (originalSale) {
        // Add back the original quantity
        updateInventoryQuantity(originalSale.lotNumber, originalSale.quantity, true);
      }
    }
    
    // Now check if we have enough inventory for the new quantity
    const availableAfterUpdate = selectedLot.availableQuantity - formData.quantity;
    
    if (availableAfterUpdate < 0) {
      toast({
        title: "Insufficient Inventory",
        description: `Only ${selectedLot.availableQuantity} ${selectedLot.unit}s available in lot ${selectedLot.lotNumber}.`,
        variant: "destructive"
      });
      return;
    }
    
    // Update inventory quantity
    updateInventoryQuantity(formData.lotNumber, formData.quantity);
    
    if (editingId) {
      // Update existing sale
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
      // Add new sale
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
    
    // Reset form
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
      cashAmount: 0,
      profit: 0,
      purchasePricePerUnit: 0
    });
    
    setShowForm(false);
  };
  
  const handleEdit = (sale: SaleEntry) => {
    setFormData({
      date: sale.date,
      lotNumber: sale.lotNumber,
      quantity: sale.quantity,
      customer: sale.customer,
      broker: sale.broker || "",
      amount: sale.amount,
      paymentType: sale.paymentType,
      paymentReceived: sale.paymentReceived,
      notes: sale.notes,
      billNumber: sale.billNumber || "",
      billAmount: sale.billAmount || 0,
      cashAmount: sale.cashAmount || 0,
      profit: sale.profit || 0,
      purchasePricePerUnit: sale.purchasePricePerUnit || 0
    });
    
    setEditingId(sale.id);
    setShowForm(true);
  };
  
  const handleDelete = (id: string) => {
    const saleToDelete = sales.find(sale => sale.id === id);
    if (saleToDelete) {
      // Add to deleted sales
      setDeletedSales(prev => [saleToDelete, ...prev]);
      
      // Remove from sales
      setSales(prev => prev.filter(sale => sale.id !== id));
      
      // Add the quantity back to inventory
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
      // Check if we have enough inventory for restoring
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
      
      // Update inventory quantity
      updateInventoryQuantity(saleToRestore.lotNumber, saleToRestore.quantity);
      
      // Add back to sales
      setSales(prev => [saleToRestore, ...prev]);
      
      // Remove from deleted sales
      setDeletedSales(prev => prev.filter(sale => sale.id !== id));
      
      toast({
        title: "Sale Restored",
        description: `Sale from lot ${saleToRestore.lotNumber} has been restored.`
      });
    }
  };
  
  const handleAddNewCustomer = () => {
    // Check for similar names to prevent duplicates
    const similarCustomers = customers.filter(c => 
      isSimilarName(c.name, newCustomer.name)
    );
    
    if (similarCustomers.length > 0) {
      // Show alert about similar names
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
    
    // Set the new customer as selected
    setFormData(prev => ({
      ...prev,
      customer: newCustomer.name
    }));
    
    // Reset and close dialog
    setNewCustomer({
      name: "",
      phone: "",
      address: "",
      outstandingBalance: 0
    });
    setShowNewCustomerDialog(false);
  };

  const handleAddNewBroker = () => {
    // Check for similar names to prevent duplicates
    const similarBrokers = brokers.filter(b => 
      isSimilarName(b.name, newBroker.name)
    );
    
    if (similarBrokers.length > 0) {
      // Show alert about similar names
      if (window.confirm(`Similar broker "${similarBrokers[0].name}" already exists. Are you sure you want to add "${newBroker.name}"?`)) {
        addBroker();
      }
    } else {
      addBroker();
    }
  };
  
  const addBroker = () => {
    const broker: Broker = {
      id: Date.now().toString(),
      name: newBroker.name
    };
    
    setBrokers(prev => [...prev, broker]);
    
    toast({
      title: "Broker Added",
      description: `Broker ${newBroker.name} has been added.`
    });
    
    // Set the new broker as selected
    setFormData(prev => ({
      ...prev,
      broker: newBroker.name
    }));
    
    // Reset and close dialog
    setNewBroker({
      name: ""
    });
    setShowNewBrokerDialog(false);
  };
  
  // Helper function to check for similar names
  const isSimilarName = (name1: string, name2: string): boolean => {
    // Convert to lowercase and remove spaces
    const clean1 = name1.toLowerCase().replace(/\s+/g, "");
    const clean2 = name2.toLowerCase().replace(/\s+/g, "");
    
    // If names are short, require more similarity
    if (clean1.length < 5 || clean2.length < 5) {
      return clean1 === clean2;
    }
    
    // Check for significant overlap
    let matches = 0;
    const minLength = Math.min(clean1.length, clean2.length);
    
    for (let i = 0; i < minLength; i++) {
      if (clean1[i] === clean2[i]) {
        matches++;
      }
    }
    
    // If more than 70% characters match, consider them similar
    return matches / minLength > 0.7;
  };
  
  // Get customer outstanding balance
  const getCustomerOutstandingBalance = (customerName: string): number => {
    const customer = customers.find(c => c.name === customerName);
    return customer?.outstandingBalance || 0;
  };
  
  // Get available inventory quantity for a lot
  const getAvailableQuantity = (lotNumber: string): number => {
    const item = inventory.find(i => i.lotNumber === lotNumber);
    return item?.availableQuantity || 0;
  };
  
  // Filter inventory items that have available quantity
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
              // Deleted Sales List
              deletedSales.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-xl text-ag-brown">No deleted sales found.</p>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {deletedSales.map((sale) => (
                    <Card key={sale.id} className="p-4 border-dashed border-red-300">
                      <div className="flex justify-between items-center border-b pb-2 mb-2">
                        <h3 className="text-xl font-bold">Lot: {sale.lotNumber}</h3>
                        <p className="text-ag-brown">{new Date(sale.date).toLocaleDateString()}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="font-semibold">Quantity:</p>
                          <p>{sale.quantity} units</p>
                        </div>
                        <div>
                          <p className="font-semibold">Customer:</p>
                          <p>{sale.customer}</p>
                        </div>
                        {sale.broker && (
                          <div>
                            <p className="font-semibold">Broker:</p>
                            <p>{sale.broker}</p>
                          </div>
                        )}
                        {sale.billNumber && (
                          <div>
                            <p className="font-semibold">Bill Number:</p>
                            <p>{sale.billNumber}</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 p-2 bg-ag-beige-light rounded-md">
                        <div className="flex justify-between">
                          <p className="font-semibold">Total:</p>
                          <p className="font-bold">₹{sale.amount}</p>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="font-semibold">Received:</p>
                          <p className="font-bold">₹{sale.paymentReceived}</p>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="font-semibold">Balance:</p>
                          <p className={`font-bold ${sale.amount - sale.paymentReceived > 0 ? "text-red-500" : ""}`}>
                            ₹{sale.amount - sale.paymentReceived}
                          </p>
                        </div>
                        {sale.profit !== undefined && (
                          <div className="flex justify-between mt-1">
                            <p className="font-semibold">Profit:</p>
                            <p className={`font-bold ${sale.profit > 0 ? "text-green-600" : "text-red-500"}`}>
                              ₹{sale.profit}
                            </p>
                          </div>
                        )}
                      </div>
                      {sale.notes && (
                        <p className="mt-2 text-ag-brown text-sm">
                          <span className="font-semibold">Notes:</span> {sale.notes}
                        </p>
                      )}
                      <div className="flex justify-end mt-3">
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
                      </div>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              // Active Sales List
              sales.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-xl text-ag-brown">No sales found. Click the button above to add a new sale.</p>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {sales.map((sale) => (
                    <Card key={sale.id} className="p-4">
                      <div className="flex justify-between items-center border-b pb-2 mb-2">
                        <h3 className="text-xl font-bold">Lot: {sale.lotNumber}</h3>
                        <p className="text-ag-brown">{new Date(sale.date).toLocaleDateString()}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="font-semibold">Quantity:</p>
                          <p>{sale.quantity} units</p>
                        </div>
                        <div>
                          <p className="font-semibold">Customer:</p>
                          <p>{sale.customer}</p>
                        </div>
                        {sale.broker && (
                          <div>
                            <p className="font-semibold">Broker:</p>
                            <p>{sale.broker}</p>
                          </div>
                        )}
                        {sale.billNumber && (
                          <div>
                            <p className="font-semibold">Bill Number:</p>
                            <p>{sale.billNumber}</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 p-2 bg-ag-beige-light rounded-md">
                        <div className="flex justify-between">
                          <p className="font-semibold">Total:</p>
                          <p className="font-bold">₹{sale.amount}</p>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="font-semibold">Received:</p>
                          <p className="font-bold">₹{sale.paymentReceived}</p>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="font-semibold">Balance:</p>
                          <p className={`font-bold ${sale.amount - sale.paymentReceived > 0 ? "text-red-500" : ""}`}>
                            ₹{sale.amount - sale.paymentReceived}
                          </p>
                        </div>
                        {sale.billAmount > 0 && (
                          <div className="flex justify-between mt-1">
                            <p className="font-semibold">Bill Amount:</p>
                            <p className="font-bold">₹{sale.billAmount}</p>
                          </div>
                        )}
                        {sale.cashAmount > 0 && (
                          <div className="flex justify-between mt-1">
                            <p className="font-semibold">Cash Amount:</p>
                            <p className="font-bold">₹{sale.cashAmount}</p>
                          </div>
                        )}
                        {sale.profit !== undefined && (
                          <div className="flex justify-between mt-1">
                            <p className="font-semibold">Profit:</p>
                            <p className={`font-bold ${sale.profit > 0 ? "text-green-600" : "text-red-500"}`}>
                              ₹{sale.profit}
                            </p>
                          </div>
                        )}
                      </div>
                      {sale.notes && (
                        <p className="mt-2 text-ag-brown text-sm">
                          <span className="font-semibold">Notes:</span> {sale.notes}
                        </p>
                      )}
                      <div className="flex justify-end gap-2 mt-3">
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
                    </Card>
                  ))}
                </div>
              )
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
                    cashAmount: 0,
                    profit: 0,
                    purchasePricePerUnit: 0
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
                          <div className="grid gap-2">
                            <Label htmlFor="newCustomerOutstanding">Outstanding Balance</Label>
                            <Input
                              id="newCustomerOutstanding"
                              type="number"
                              value={newCustomer.outstandingBalance}
                              onChange={(e) => setNewCustomer({...newCustomer, outstandingBalance: Number(e.target.value)})}
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
                        <SelectItem value="none" disabled>No customers available</SelectItem>
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
                  <div className="flex justify-between">
                    <Label htmlFor="broker" className="form-label">Broker</Label>
                    <Dialog open={showNewBrokerDialog} onOpenChange={setShowNewBrokerDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex gap-1 items-center">
                          <PlusCircle size={16} />
                          New Broker
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Broker</DialogTitle>
                          <DialogDescription>
                            Enter broker name to add to your list.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="newBrokerName">Broker Name</Label>
                            <Input
                              id="newBrokerName"
                              value={newBroker.name}
                              onChange={(e) => setNewBroker({...newBroker, name: e.target.value})}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowNewBrokerDialog(false)}>Cancel</Button>
                          <Button onClick={handleAddNewBroker}>Add Broker</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div className="relative">
                    <Select
                      value={formData.broker}
                      onValueChange={(value) => handleSelectChange("broker", value)}
                    >
                      <SelectTrigger className="text-lg p-6">
                        <SelectValue placeholder="Select a broker (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {brokers.map((broker) => (
                          <SelectItem key={broker.id} value={broker.name}>
                            {broker.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.broker && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleClearBroker}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
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
                  <div className="bg-blue-50 p-4 rounded-md mb-4">
                    <h4 className="text-lg font-semibold mb-2">Profit Calculation</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Purchase Price Per Unit</p>
                        <p className="font-bold">₹{formData.purchasePricePerUnit}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Total Purchase Cost</p>
                        <p className="font-bold">₹{(formData.purchasePricePerUnit * formData.quantity).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Total Sale Amount</p>
                        <p className="font-bold">₹{formData.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Profit/Loss</p>
                        <p className={`font-bold ${formData.profit > 0 ? "text-green-600" : "text-red-500"}`}>
                          ₹{formData.profit.toFixed(2)} 
                          {formData.profit !== 0 && formData.quantity > 0 && (
                            <span className="text-xs text-gray-500 ml-2">
                              (₹{(formData.profit / formData.quantity).toFixed(2)}/unit)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
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
    </div>
  );
};

export default Sales;
