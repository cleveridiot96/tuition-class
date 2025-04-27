
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EnhancedSearchableSelect } from '@/components/ui/enhanced-select';
import { SelectOption } from '@/components/ui/enhanced-select/types';
import { DateField } from "./fields/DateField";
import { LotField } from "./fields/LotField";
import { CustomerField } from "./fields/CustomerField";
import { TransportField } from "./fields/TransportField";
import { BrokerField } from "./fields/BrokerField";

interface SalesFormFieldsProps {
  form: any;
  inventory: any[];
  customers: any[];
  brokers: any[];
  transporters: any[];
  maxQuantity: number;
  isCutBill: boolean;
  initialData: any;
  selectedLot: any;
  selectedBroker: any;
  handleLotChange: (lotNumber: string) => void;
  handleBrokerChange: (brokerId: string) => void;
  setIsCutBill: (enableCustomAmount: boolean) => void;
}

const SalesFormFields: React.FC<SalesFormFieldsProps> = ({
  form,
  inventory,
  customers,
  brokers,
  transporters,
  maxQuantity,
  isCutBill,
  initialData,
  selectedLot,
  selectedBroker,
  handleLotChange,
  handleBrokerChange,
  setIsCutBill,
}) => {
  // Convert data to options format for searchable selects
  const customerOptions: SelectOption[] = customers.map(c => ({ 
    value: c.id, 
    label: c.name 
  }));
  
  const transporterOptions: SelectOption[] = [
    { value: "", label: "None" },
    ...transporters.map(t => ({ value: t.id, label: t.name }))
  ];
  
  const inventoryOptions: SelectOption[] = inventory.map(item => ({ 
    value: item.lotNumber, 
    label: `${item.lotNumber} (${item.remainingQuantity} bags)` 
  }));
  
  const brokerOptions: SelectOption[] = [
    { value: "", label: "None" },
    ...brokers.map(b => ({ 
      value: b.id, 
      label: `${b.name} (${b.commissionRate || 0}%)` 
    }))
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DateField form={form} />
        
        <FormField
          control={form.control}
          name="billNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bill Number</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <div className="flex items-center justify-between">
                <FormLabel>Bill Amount</FormLabel>
                <label className="text-xs flex items-center">
                  <input
                    type="checkbox"
                    checked={isCutBill}
                    onChange={(e) => setIsCutBill(e.target.checked)}
                    className="mr-1"
                  />
                  Cut Bill
                </label>
              </div>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  disabled={!isCutBill}
                  value={field.value ?? ""}
                  className={isCutBill ? "bg-yellow-50 border-yellow-300" : ""}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : null;
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LotField 
          form={form}
          options={inventoryOptions}
          handleLotChange={handleLotChange}
          initialData={initialData}
        />
        
        <CustomerField
          form={form}
          options={customerOptions}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Quantity (Bags){" "}
                {maxQuantity > 0 && (
                  <span className="text-xs text-gray-500">Max: {maxQuantity}</span>
                )}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  max={maxQuantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10) || 0;
                    const limitedValue = Math.min(value, maxQuantity || Infinity);
                    field.onChange(limitedValue);

                    if (selectedLot) {
                      const weightPerUnit = selectedLot.netWeight / selectedLot.quantity;
                      form.setValue("netWeight", limitedValue * weightPerUnit);
                    }
                  }}
                  value={field.value || 0}
                />
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
                <Input type="number" {...field} readOnly value={field.value || 0} />
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
              <FormLabel>Rate (per kg)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...field} 
                  value={field.value || 0} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <TransportField
        form={form}
        options={transporterOptions}
      />

      <BrokerField 
        form={form}
        options={brokerOptions}
        handleBrokerChange={handleBrokerChange}
        selectedBroker={selectedBroker}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default SalesFormFields;
