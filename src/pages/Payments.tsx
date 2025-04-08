
import React, { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowLeft, Printer, FileSpreadsheet, Search, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPayments, addPayment, updatePayment, deletePayment, getAgents, getSuppliers, getBrokers, getCustomers, getTransporters } from "@/services/storageService";
import PaymentForm from "@/components/PaymentForm";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useReactToPrint } from "react-to-print";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PaymentEntry {
  id: string;
  date: string;
  partyName: string;
  partyType: string;
  amount: number;
  paymentMode: string;
  billNumber?: string;
  billAmount?: number;
  referenceNumber?: string;
  notes?: string;
}

interface Party {
  id: string;
  name: string;
  type: string;
}

const Payments = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPartyId, setSelectedPartyId] = useState("");
  const [parties, setParties] = useState<Party[]>([]);
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const printRef = useRef<HTMLDivElement>(null);

  // Load payments from storage service
  useEffect(() => {
    loadPayments();
    loadAllParties();
  }, []);

  // Filter payments when search term or selected party changes
  useEffect(() => {
    filterPayments();
  }, [searchTerm, selectedPartyId, payments]);

  const loadPayments = () => {
    const storedPayments = getPayments() || [];
    setPayments(storedPayments);
  };

  const loadAllParties = () => {
    // Get all parties from different categories
    const agents = getAgents().map(a => ({ id: a.id, name: a.name, type: "agent" }));
    const suppliers = getSuppliers().map(s => ({ id: s.id, name: s.name, type: "supplier" }));
    const customers = getCustomers().map(c => ({ id: c.id, name: c.name, type: "customer" }));
    const brokers = getBrokers().map(b => ({ id: b.id, name: b.name, type: "broker" }));
    const transporters = getTransporters().map(t => ({ id: t.id, name: t.name, type: "transporter" }));
    
    // Combine all parties
    const allParties = [...agents, ...suppliers, ...customers, ...brokers, ...transporters];
    setParties(allParties);
  };

  const filterPayments = () => {
    let filtered = [...payments];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(payment => 
        payment.partyName.toLowerCase().includes(term) ||
        payment.notes?.toLowerCase().includes(term) ||
        payment.billNumber?.toLowerCase().includes(term) ||
        payment.referenceNumber?.toLowerCase().includes(term)
      );
    }
    
    // Filter by selected party
    if (selectedPartyId) {
      const selectedParty = parties.find(p => p.id === selectedPartyId);
      if (selectedParty) {
        filtered = filtered.filter(payment => 
          payment.partyName === selectedParty.name &&
          payment.partyType === selectedParty.type
        );
      }
    }
    
    setFilteredPayments(filtered);
  };

  const handleSubmit = (paymentData: any) => {
    if (editingPayment) {
      updatePayment(paymentData);
      toast({
        title: "Payment Updated",
        description: `Payment of ₹${paymentData.amount} to ${paymentData.partyName} updated successfully.`
      });
    } else {
      addPayment(paymentData);
      toast({
        title: "Payment Added",
        description: `Payment of ₹${paymentData.amount} to ${paymentData.partyName} added successfully.`
      });
    }
    
    loadPayments();
    setShowForm(false);
    setEditingPayment(null);
  };

  const handleAddNewClick = () => {
    setEditingPayment(null);
    setShowForm(true);
  };

  const handleEditPayment = (payment: PaymentEntry) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleDeletePayment = (id: string) => {
    deletePayment(id);
    toast({
      title: "Payment Deleted",
      description: "Payment was deleted successfully."
    });
    loadPayments();
  };

  // Format payment mode text with proper capitalization
  const formatPaymentMode = (mode: string | undefined): string => {
    if (!mode || typeof mode !== 'string') return 'Unknown';
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  };

  // Get CSS class for payment mode badge
  const getPaymentModeClass = (mode: string | undefined): string => {
    return `px-3 py-1 rounded-full ${
      mode === "cash" ? "bg-ag-orange text-white" : "bg-ag-green text-white"
    }`;
  };

  // Handle printing
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Payments_Report",
    onAfterPrint: () => {
      toast({
        title: "Print Complete",
        description: "Payment report has been sent to printer."
      });
    },
  });

  // Handle exporting to Excel
  const handleExportExcel = () => {
    // Create CSV content
    let csvContent = "ID,Date,Party Name,Party Type,Amount,Payment Mode,Bill Number,Bill Amount,Reference,Notes\n";
    
    filteredPayments.forEach(payment => {
      csvContent += `${payment.id},${payment.date},${payment.partyName},${payment.partyType},${payment.amount},${payment.paymentMode},"${payment.billNumber || ''}",${payment.billAmount || 0},"${payment.referenceNumber || ''}","${payment.notes || ''}"\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `payments_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Payments data has been exported to CSV format."
    });
  };

  // Calculate totals for summary
  const calculateTotals = () => {
    const total = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    return {
      totalAmount: total.toLocaleString('en-IN'),
      count: filteredPayments.length
    };
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Payments" showBackButton />
      <div className="container mx-auto px-4 py-6">
        {!showForm ? (
          <>
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="flex gap-2 items-center"
                >
                  <Printer size={18} />
                  Print
                </Button>
                <Button
                  onClick={handleExportExcel}
                  variant="outline" 
                  className="flex gap-2 items-center"
                >
                  <FileSpreadsheet size={18} />
                  Export CSV
                </Button>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setViewMode("cards")} 
                    variant={viewMode === "cards" ? "default" : "outline"}
                  >
                    Cards
                  </Button>
                  <Button 
                    onClick={() => setViewMode("table")} 
                    variant={viewMode === "table" ? "default" : "outline"}
                  >
                    Table
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 max-w-xs">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search payments..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <Select value={selectedPartyId} onValueChange={setSelectedPartyId}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by party" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Parties</SelectItem>
                    {parties.map((party) => (
                      <SelectItem key={party.id + party.type} value={party.id}>
                        {party.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  onClick={handleAddNewClick}
                  className="action-button flex gap-2 items-center"
                >
                  <PlusCircle size={18} />
                  New Payment
                </Button>
              </div>
            </div>

            <div className="mb-4 flex justify-between items-center p-3 bg-white rounded-lg shadow">
              <p className="text-ag-brown">
                Showing <span className="font-semibold">{filteredPayments.length}</span> of {payments.length} payments
              </p>
              <p className="text-ag-brown">
                Total: <span className="font-semibold text-ag-green">₹ {totals.totalAmount}</span>
              </p>
            </div>

            {payments.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-xl text-ag-brown">
                  No payments found. Click the button above to add a new payment.
                </p>
              </Card>
            ) : filteredPayments.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-xl text-ag-brown">
                  No payments match your search criteria.
                </p>
              </Card>
            ) : viewMode === "table" ? (
              <div className="bg-white rounded-lg shadow overflow-hidden" ref={printRef}>
                <div className="p-4 print:block hidden">
                  <h1 className="text-2xl font-bold text-center">Payments Report</h1>
                  <p className="text-center text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Party</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="print:hidden">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.partyName}</p>
                            <p className="text-xs text-gray-500">{payment.partyType}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-ag-green">₹ {payment.amount}</TableCell>
                        <TableCell>
                          <span className={getPaymentModeClass(payment.paymentMode)}>
                            {formatPaymentMode(payment.paymentMode)}
                          </span>
                        </TableCell>
                        <TableCell>{payment.referenceNumber || '-'}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {payment.notes || '-'}
                        </TableCell>
                        <TableCell className="print:hidden">
                          <div className="flex gap-2">
                            <Button 
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEditPayment(payment)}
                            >
                              <Edit size={16} />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <Trash2 size={16} className="text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Payment</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this payment of ₹{payment.amount} to {payment.partyName}? 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeletePayment(payment.id)}
                                    className="bg-red-500 text-white hover:bg-red-600"
                                  >
                                    Delete
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
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredPayments.map((payment) => (
                  <Card 
                    key={payment.id} 
                    className="p-4 relative"
                  >
                    <div className="absolute top-2 right-2 print:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditPayment(payment)}>
                            <Edit className="mr-2" size={14} /> Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2" size={14} /> Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Payment</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this payment of ₹{payment.amount} to {payment.partyName}? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeletePayment(payment.id)}
                                  className="bg-red-500 text-white hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2 mb-2" onClick={() => handleEditPayment(payment)}>
                      <h3 className="text-xl font-bold">{payment.partyName}</h3>
                      <p className="text-ag-brown">{new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-2" onClick={() => handleEditPayment(payment)}>
                      <p className="text-2xl font-bold text-ag-green">₹ {payment.amount}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={getPaymentModeClass(payment.paymentMode)}>
                          {formatPaymentMode(payment.paymentMode)}
                        </span>
                        {payment.referenceNumber && (
                          <span className="text-ag-brown">Ref: {payment.referenceNumber}</span>
                        )}
                      </div>
                    </div>
                    {payment.notes && (
                      <p className="mt-2 text-ag-brown">
                        <span className="font-semibold">Notes:</span> {payment.notes}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <div>
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setShowForm(false);
                  setEditingPayment(null);
                }}
                className="mr-2"
              >
                <ArrowLeft size={24} />
              </Button>
              <h2 className="text-2xl font-bold">{editingPayment ? "Edit Payment" : "Add New Payment"}</h2>
            </div>
            
            <PaymentForm 
              onSubmit={handleSubmit} 
              initialData={editingPayment} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
