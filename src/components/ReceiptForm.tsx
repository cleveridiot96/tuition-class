import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Printer } from "lucide-react";
import {
  getAgents,
  getSuppliers,
  getBrokers,
  getCustomers,
  getTransporters
} from "@/services/storageService";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/helpers";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  receiptNumber: z.string().min(1, "Receipt number is required"),
  amount: z.coerce.number().positive("Amount is required"),
  partyType: z.string().min(1, "Party type is required"),
  partyId: z.string().min(1, "Party is required"),
  receiptMode: z.string().min(1, "Receipt mode is required"),
  billNumber: z.string().optional(),
  billAmount: z.coerce.number().min(0, "Bill amount must be valid"),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ReceiptFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const ReceiptForm = ({ onSubmit, initialData }: ReceiptFormProps) => {
  const [parties, setParties] = useState<any[]>([]);
  const [partyType, setPartyType] = useState<string>(initialData?.partyType || "agent");
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<any>(null);
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      partyType: initialData.partyType || "agent",
      partyId: initialData.partyId || "",
      date: initialData.date || format(new Date(), 'yyyy-MM-dd'),
      billAmount: initialData.billAmount || 0,
    } : {
      date: format(new Date(), 'yyyy-MM-dd'),
      receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
      amount: 0,
      partyType: "agent",
      partyId: "",
      receiptMode: "cash",
      billNumber: "",
      billAmount: 0,
      referenceNumber: "",
      notes: "",
    }
  });

  useEffect(() => {
    loadParties(partyType);
  }, [partyType]);

  const loadParties = (type: string) => {
    let partyList: any[] = [];
    
    switch (type) {
      case 'agent':
        partyList = getAgents();
        break;
      case 'supplier':
        partyList = getSuppliers();
        break;
      case 'customer':
        partyList = getCustomers();
        break;
      case 'broker':
        partyList = getBrokers();
        break;
      case 'transporter':
        partyList = getTransporters();
        break;
      default:
        partyList = [];
    }
    
    setParties(partyList);
    form.setValue("partyId", "");
  };

  const handlePartyTypeChange = (value: string) => {
    setPartyType(value);
    form.setValue("partyType", value);
  };

  const handleFormSubmit = (data: FormData) => {
    const selectedParty = parties.find(p => p.id === data.partyId);
    
    const submitData = {
      ...data,
      partyName: selectedParty?.name || "",
      id: initialData?.id || Date.now().toString()
    };
    
    setCurrentReceipt(submitData);
    
    onSubmit(submitData);
    
    if (!initialData) {
      setIsReceiptDialogOpen(true);
      toast({
        title: "Receipt Created",
        description: "Receipt successfully created and ready to print",
      });
    }
  };

  const handlePrintReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const receiptDate = new Date(currentReceipt?.date);
      const formattedDate = format(receiptDate, 'dd/MM/yy');
      
      const receiptHtml = `
        <html>
          <head>
            <title>Receipt #${currentReceipt?.receiptNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; border-bottom: 1px solid #000; padding-bottom: 10px; }
              .receipt-details { margin-top: 20px; }
              .row { display: flex; margin-bottom: 10px; }
              .label { width: 150px; font-weight: bold; }
              .value { flex: 1; }
              .footer { margin-top: 50px; display: flex; justify-content: space-between; }
              .signature { width: 40%; text-align: center; border-top: 1px solid #000; padding-top: 10px; }
              @media print {
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>RECEIPT</h2>
              <p>Agricultural Business Management System</p>
            </div>
            
            <div class="receipt-details">
              <div class="row">
                <div class="label">Receipt No:</div>
                <div class="value">${currentReceipt?.receiptNumber}</div>
              </div>
              <div class="row">
                <div class="label">Date:</div>
                <div class="value">${formattedDate}</div>
              </div>
              <div class="row">
                <div class="label">Received From:</div>
                <div class="value">${currentReceipt?.partyName}</div>
              </div>
              <div class="row">
                <div class="label">Amount:</div>
                <div class="value">₹${parseFloat(currentReceipt?.amount).toFixed(2)}</div>
              </div>
              <div class="row">
                <div class="label">Mode:</div>
                <div class="value">${currentReceipt?.receiptMode}</div>
              </div>
              ${currentReceipt?.referenceNumber ? `
                <div class="row">
                  <div class="label">Reference No:</div>
                  <div class="value">${currentReceipt?.referenceNumber}</div>
                </div>
              ` : ''}
              ${currentReceipt?.billNumber ? `
                <div class="row">
                  <div class="label">Bill No:</div>
                  <div class="value">${currentReceipt?.billNumber}</div>
                </div>
              ` : ''}
              ${currentReceipt?.billAmount ? `
                <div class="row">
                  <div class="label">Bill Amount:</div>
                  <div class="value">₹${parseFloat(currentReceipt?.billAmount).toFixed(2)}</div>
                </div>
              ` : ''}
              ${currentReceipt?.notes ? `
                <div class="row">
                  <div class="label">Notes:</div>
                  <div class="value">${currentReceipt?.notes}</div>
                </div>
              ` : ''}
            </div>
            
            <div class="footer">
              <div class="signature">Received By</div>
              <div class="signature">Authorized Signature</div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <button onclick="window.print()">Print Receipt</button>
            </div>
          </body>
        </html>
      `;
      
      printWindow.document.open();
      printWindow.document.write(receiptHtml);
      printWindow.document.close();
    } else {
      toast({
        title: "Print Error",
        description: "Could not open print window. Check your browser settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="receiptNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receipt Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter receipt number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="0.00" step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="partyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Party Type</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handlePartyTypeChange(value);
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select party type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="agent">Agent</SelectItem>
                        <SelectItem value="supplier">Supplier</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="broker">Broker</SelectItem>
                        <SelectItem value="transporter">Transporter</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="partyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Party</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select party" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {parties.map((party) => (
                          <SelectItem key={party.id} value={party.id}>
                            {party.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="receiptMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receipt Mode</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select receipt mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="billNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bill Number (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter bill number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="billAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bill Amount (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="0.00" step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="referenceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Number (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter reference number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} placeholder="Enter any additional notes" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4">
              {initialData && currentReceipt && (
                <Button type="button" onClick={handlePrintReceipt} variant="outline">
                  <Printer className="mr-2 h-4 w-4" /> Print Receipt
                </Button>
              )}
              <Button type="submit" size="lg">
                {initialData ? "Update Receipt" : "Create Receipt"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
      
      <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Receipt Created</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Receipt #{currentReceipt?.receiptNumber} has been created successfully.</p>
            <p className="mt-2">Would you like to print the receipt?</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handlePrintReceipt}>
              <Printer className="mr-2 h-4 w-4" /> Print Receipt
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReceiptForm;
