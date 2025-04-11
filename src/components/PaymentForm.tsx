
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRow
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import NewEntityForm from "@/components/NewEntityForm";
import {
  getAgents,
  getSuppliers,
  getBrokers,
  getCustomers,
  getTransporters,
  getPurchases,
  getSales
} from "@/services/storageService";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  partyType: z.string().min(1, "Party type is required"),
  partyId: z.string().min(1, "Party is required"),
  paymentMode: z.string().min(1, "Payment mode is required"),
  billNumber: z.string().optional(),
  billAmount: z.coerce.number().min(0, "Bill amount must be valid"),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
  isAgainstTransaction: z.boolean().default(false),
  transactionId: z.string().optional(),
  isOnAccount: z.boolean().default(false)
});

type FormData = z.infer<typeof formSchema>;

export interface PaymentFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const PaymentForm = ({ onSubmit, onCancel, initialData }: PaymentFormProps) => {
  const [parties, setParties] = useState<any[]>([]);
  const [partyType, setPartyType] = useState<string>(initialData?.partyType || "agent");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showTransactions, setShowTransactions] = useState<boolean>(initialData?.isAgainstTransaction || false);
  const [isOnAccount, setIsOnAccount] = useState<boolean>(initialData?.isOnAccount || false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      date: initialData.date || format(new Date(), 'yyyy-MM-dd'),
      partyType: initialData.partyType || "agent",
      partyId: initialData.partyId || "",
      paymentMode: initialData.paymentMode || "cash",
      billAmount: initialData.billAmount || 0,
      isAgainstTransaction: initialData.isAgainstTransaction || false,
      transactionId: initialData.transactionId || "",
      isOnAccount: initialData.isOnAccount || false
    } : {
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: 0,
      partyType: "agent",
      partyId: "",
      paymentMode: "cash",
      billNumber: "",
      billAmount: 0,
      referenceNumber: "",
      notes: "",
      isAgainstTransaction: false,
      transactionId: "",
      isOnAccount: false
    }
  });

  // Load party data when party type changes
  useEffect(() => {
    loadParties(partyType);
  }, [partyType]);

  // Load related transactions when party changes
  useEffect(() => {
    const partyId = form.watch("partyId");
    if (partyId && showTransactions) {
      loadTransactions(partyId, partyType);
    }
  }, [form.watch("partyId"), showTransactions, partyType]);

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

  const loadTransactions = (partyId: string, partyType: string) => {
    try {
      let relatedTransactions = [];
      
      // Get transactions based on party type
      if (partyType === 'supplier' || partyType === 'agent') {
        const purchases = getPurchases().filter(p => !p.isDeleted);
        relatedTransactions = purchases.filter(p => 
          (partyType === 'agent' && p.agentId === partyId) || 
          (partyType === 'supplier' && p.partyId === partyId)
        ).map(p => ({
          id: p.id,
          date: p.date,
          type: 'purchase',
          number: p.lotNumber,
          amount: p.totalAfterExpenses
        }));
      } else if (partyType === 'customer') {
        const sales = getSales().filter(s => !s.isDeleted);
        relatedTransactions = sales.filter(s => s.customerId === partyId).map(s => ({
          id: s.id,
          date: s.date,
          type: 'sale',
          number: s.billNumber || s.lotNumber,
          amount: s.totalAmount
        }));
      }
      
      setTransactions(relatedTransactions);
    } catch (error) {
      console.error("Error loading transactions:", error);
      setTransactions([]);
    }
  };

  const handlePartyTypeChange = (value: string) => {
    setPartyType(value);
    form.setValue("partyType", value);
    form.setValue("transactionId", "");
    setTransactions([]);
  };

  const handleTransactionToggle = (checked: boolean) => {
    setShowTransactions(checked);
    form.setValue("isAgainstTransaction", checked);
    if (!checked) {
      form.setValue("transactionId", "");
    }
  };

  const handleOnAccountToggle = (checked: boolean) => {
    setIsOnAccount(checked);
    form.setValue("isOnAccount", checked);
  };

  const handleFormSubmit = (data: FormData) => {
    // Get party name for record
    const selectedParty = parties.find(p => p.id === data.partyId);
    
    // Get transaction details if selected
    let transactionDetails = null;
    if (data.isAgainstTransaction && data.transactionId) {
      transactionDetails = transactions.find(t => t.id === data.transactionId);
    }
    
    // Format data for submission
    const submitData = {
      ...data,
      partyName: selectedParty?.name || "",
      transactionDetails: transactionDetails,
      id: initialData?.id || Date.now().toString()
    };
    
    // Submit the data
    onSubmit(submitData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormRow columns={2}>
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
        </FormRow>
        
        <FormRow columns={2}>
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
                    {parties.length > 0 ? (
                      parties.map((party) => (
                        <SelectItem key={party.id} value={party.id}>
                          {party.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="no-parties">No parties found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormRow>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="againstTransaction" 
              checked={showTransactions}
              onCheckedChange={handleTransactionToggle}
            />
            <label
              htmlFor="againstTransaction"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Payment against specific transaction
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="onAccount" 
              checked={isOnAccount}
              onCheckedChange={handleOnAccountToggle}
            />
            <label
              htmlFor="onAccount"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Payment on account
            </label>
          </div>
        </div>
        
        {showTransactions && (
          <FormField
            control={form.control}
            name="transactionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Transaction</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transaction" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <SelectItem key={transaction.id} value={transaction.id}>
                          {`${transaction.type === 'purchase' ? 'Lot' : 'Bill'} ${transaction.number} - ₹${transaction.amount.toFixed(2)} (${format(new Date(transaction.date), 'dd/MM/yyyy')})`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="no-transactions">No transactions found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormRow columns={2}>
          <FormField
            control={form.control}
            name="paymentMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Mode</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment mode" />
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
                <FormLabel optional>Bill Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter bill number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormRow>
        
        <FormRow columns={2}>
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
                <FormLabel optional>Reference Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter reference number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormRow>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel optional>Notes</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} placeholder="Enter any additional notes" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update Payment" : "Make Payment"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentForm;
