import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  getAgents,
  getSuppliers,
  getTransporters,
  getBrokers,
  addSupplier,
  addBroker,
  addTransporter,
  checkDuplicateLot,
  getPurchases,
  getLocations,
} from '@/services/storageService';

// Import our new components
import AddPartyDialog from "@/components/purchases/AddPartyDialog";
import AddBrokerDialog from "@/components/purchases/AddBrokerDialog";
import AddTransporterDialog from "@/components/purchases/AddTransporterDialog";
import DuplicateLotDialog from "@/components/purchases/DuplicateLotDialog";
import SimilarPartyDialog from "@/components/purchases/SimilarPartyDialog";
import BrokerageDetails from "@/components/purchases/BrokerageDetails";
import PurchaseSummary from "@/components/purchases/PurchaseSummary";
import { purchaseFormSchema, PurchaseFormData } from "@/components/purchases/PurchaseFormSchema";
import { useFormCalculations } from "@/components/purchases/useFormCalculations";
import { usePartyManagement } from "@/components/purchases/usePartyManagement";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-searchable-select";

interface PurchaseFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const PurchaseForm = ({ onSubmit, initialData }: PurchaseFormProps) => {
  const [agents, setAgents] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [showBrokerage, setShowBrokerage] = useState<boolean>(false);
  const [showDuplicateLotDialog, setShowDuplicateLotDialog] = useState<boolean>(false);
  const [duplicateLotInfo, setDuplicateLotInfo] = useState<any>(null);
  
  const defaultValues = initialData ? {
    date: initialData.date || format(new Date(), 'yyyy-MM-dd'),
    lotNumber: initialData.lotNumber || "",
    quantity: initialData.quantity || 0,
    brokerId: initialData.brokerId || "",
    party: initialData.party || "",
    location: initialData.location || "",
    netWeight: initialData.netWeight || 0,
    rate: initialData.rate || 0,
    transporterId: initialData.transporterId || "",
    transportRate: initialData.transportRate || 0,
    expenses: initialData.expenses || 0,
    brokerageType: initialData.brokerageType || "percentage",
    brokerageValue: initialData.brokerageType === "percentage" ? 
      (initialData.brokerageAmount ? (initialData.brokerageAmount / initialData.totalAmount * 100) : 1) : 
      initialData.brokerageAmount || 0,
    notes: initialData.notes || "",
  } : {
    date: format(new Date(), 'yyyy-MM-dd'),
    lotNumber: "",
    quantity: 0,
    brokerId: "",
    party: "",
    location: "",
    netWeight: 0,
    rate: 0,
    transporterId: "",
    transportRate: 0,
    expenses: 0,
    brokerageType: "percentage",
    brokerageValue: 1,
    notes: "",
  };
  
  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: defaultValues
  });

  useEffect(() => {
    loadData();
    
    if (initialData?.brokerId) {
      setShowBrokerage(true);
    }
  }, [initialData]);

  const loadData = () => {
    setAgents(getAgents());
    setSuppliers(getSuppliers());
    setTransporters(getTransporters());
    setBrokers(getBrokers());
    setLocations(getLocations());
  };

  const { 
    totalAmount, totalAfterExpenses, ratePerKgAfterExpenses, 
    transportCost, brokerageAmount 
  } = useFormCalculations({ 
    form, showBrokerage, initialData 
  });

  const partyManagement = usePartyManagement({ form, loadData });

  const handleFormSubmit = (data: PurchaseFormData) => {
    const isDuplicateLot = checkDuplicateLot(data.lotNumber);

    if (isDuplicateLot && !initialData) {
      const existingPurchase = getPurchases().find(p => p.lotNumber === data.lotNumber && !p.isDeleted);
      if (existingPurchase) {
        setDuplicateLotInfo(existingPurchase);
        setShowDuplicateLotDialog(true);
        return;
      }
    }
    
    if (data.party && !suppliers.some(s => s.name === data.party)) {
      const newCustomer = {
        id: Date.now().toString(),
        name: data.party,
        address: "",
        balance: 0
      };
      addCustomer(newCustomer);
    }
    
    submitFormData(data);
  };

  const submitFormData = (data: PurchaseFormData) => {
    const submitData = {
      ...data,
      broker: data.brokerId ? brokers.find(b => b.id === data.brokerId)?.name || "" : "",
      transporter: transporters.find(t => t.id === data.transporterId)?.name || "",
      totalAmount,
      transportCost,
      expenses: data.expenses,
      brokerageAmount: showBrokerage && data.brokerId ? brokerageAmount : 0,
      brokerageType: data.brokerageType || "percentage",
      totalAfterExpenses,
      ratePerKgAfterExpenses,
      id: initialData?.id || Date.now().toString()
    };
    
    onSubmit(submitData);
  };

  const continueDespiteDuplicate = () => {
    setShowDuplicateLotDialog(false);
    const data = form.getValues();
    submitFormData(data);
  };

  const supplierOptions = suppliers.map(supplier => ({
    value: supplier.name,
    label: supplier.name
  }));

  const brokerOptions = brokers.map(broker => ({
    value: broker.id,
    label: broker.name
  }));

  const transporterOptions = transporters.map(transporter => ({
    value: transporter.id,
    label: transporter.name
  }));

  const locationOptions = locations.map(location => ({
    value: location,
    label: location
  }));

  const handleAddSupplier = (name: string) => {
    if (!name.trim()) return;
    
    const newSupplier = {
      id: Date.now().toString(),
      name: name.trim(),
      address: "",
      balance: 0
    };
    
    addSupplier(newSupplier);
    loadData();
    toast.success(`Supplier "${name}" added to master list`);
  };

  const handleAddBroker = (name: string) => {
    if (!name.trim()) return;
    
    const newBroker = {
      id: Date.now().toString(),
      name: name.trim(),
      address: "",
      commissionRate: 1
    };
    
    addBroker(newBroker);
    loadData();
    toast.success(`Broker "${name}" added to master list`);
  };

  const handleAddTransporter = (name: string) => {
    if (!name.trim()) return;
    
    const newTransporter = {
      id: Date.now().toString(),
      name: name.trim(),
      address: ""
    };
    
    addTransporter(newTransporter);
    loadData();
    toast.success(`Transporter "${name}" added to master list`);
  };

  const extractBagsFromLotNumber = (lotNumber: string) => {
    const match = lotNumber.match(/\/(\d+)/);
    if (match && match[1]) {
      const bags = parseInt(match[1], 10);
      if (!isNaN(bags)) {
        form.setValue('quantity', bags);
        return true;
      }
    }
    return false;
  };

  return (
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
              name="party"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Party</FormLabel>
                  <FormControl>
                    <EnhancedSearchableSelect 
                      options={supplierOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      onAddNew={handleAddSupplier}
                      placeholder="Select or type party name"
                      masterType="supplier"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="brokerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Broker (Optional)</FormLabel>
                  <FormControl>
                    <EnhancedSearchableSelect 
                      options={brokerOptions}
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowBrokerage(!!value);
                      }}
                      onAddNew={handleAddBroker}
                      placeholder="Select broker (optional)"
                      masterType="broker"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lotNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lot Number (Vakkal)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter lot number"
                      onChange={(e) => {
                        field.onChange(e);
                        extractBagsFromLotNumber(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity (Bags)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="netWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Net Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="0.00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate per kg (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="0.00" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <EnhancedSearchableSelect 
                      options={locationOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select location"
                      masterType="location"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="transporterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transporter</FormLabel>
                  <FormControl>
                    <EnhancedSearchableSelect 
                      options={transporterOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      onAddNew={handleAddTransporter}
                      placeholder="Select transporter"
                      masterType="transporter"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="transportRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transport Rate per kg (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="0.00" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <label className="text-sm font-medium">Transport Cost (₹)</label>
              <Input 
                type="number" 
                value={transportCost.toFixed(2)} 
                readOnly
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">Transport Rate × Net Weight</p>
            </div>
            
            <FormField
              control={form.control}
              name="expenses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Expenses (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="0.00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="md:col-span-2">
              {showBrokerage && (
                <BrokerageDetails 
                  form={form} 
                  brokerageAmount={brokerageAmount} 
                  totalAmount={totalAmount}
                />
              )}
            </div>
          </div>
          
          <PurchaseSummary 
            totalAmount={totalAmount}
            transportCost={transportCost}
            brokerageAmount={brokerageAmount}
            showBrokerage={showBrokerage}
            expenses={form.watch("expenses") || 0}
            totalAfterExpenses={totalAfterExpenses}
            ratePerKgAfterExpenses={ratePerKgAfterExpenses}
          />
          
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
          
          <div className="flex justify-end">
            <Button type="submit" size="lg">
              {initialData ? "Update Purchase" : "Add Purchase"}
            </Button>
          </div>
        </form>
      </Form>

      <AddPartyDialog
        open={partyManagement.showAddPartyDialog}
        onOpenChange={partyManagement.setShowAddPartyDialog}
        newPartyName={partyManagement.newPartyName}
        setNewPartyName={partyManagement.setNewPartyName}
        newPartyAddress={partyManagement.newPartyAddress}
        setNewPartyAddress={partyManagement.setNewPartyAddress}
        handleAddNewParty={partyManagement.handleAddNewParty}
      />

      <AddBrokerDialog
        open={partyManagement.showAddBrokerDialog}
        onOpenChange={partyManagement.setShowAddBrokerDialog}
        newBrokerName={partyManagement.newBrokerName}
        setNewBrokerName={partyManagement.setNewBrokerName}
        newBrokerAddress={partyManagement.newBrokerAddress}
        setNewBrokerAddress={partyManagement.setNewBrokerAddress}
        newBrokerRate={partyManagement.newBrokerRate}
        setNewBrokerRate={partyManagement.setNewBrokerRate}
        handleAddNewBroker={partyManagement.handleAddNewBroker}
      />

      <AddTransporterDialog
        open={partyManagement.showAddTransporterDialog}
        onOpenChange={partyManagement.setShowAddTransporterDialog}
        newTransporterName={partyManagement.newTransporterName}
        setNewTransporterName={partyManagement.setNewTransporterName}
        newTransporterAddress={partyManagement.newTransporterAddress}
        setNewTransporterAddress={partyManagement.setNewTransporterAddress}
        handleAddNewTransporter={partyManagement.handleAddNewTransporter}
      />

      <DuplicateLotDialog
        open={showDuplicateLotDialog}
        onOpenChange={setShowDuplicateLotDialog}
        duplicateLotInfo={duplicateLotInfo}
        continueDespiteDuplicate={continueDespiteDuplicate}
      />

      <SimilarPartyDialog
        open={partyManagement.showSimilarPartyDialog}
        onOpenChange={partyManagement.setShowSimilarPartyDialog}
        similarParty={partyManagement.similarParty}
        enteredPartyName={partyManagement.enteredPartyName}
        useSuggestedParty={partyManagement.useSuggestedParty}
      />
    </Card>
  );
};

export default PurchaseForm;
