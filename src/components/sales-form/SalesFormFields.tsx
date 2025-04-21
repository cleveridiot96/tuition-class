
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
}) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      <FormField
        control={form.control}
        name="lotNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lot Number</FormLabel>
            <Select
              onValueChange={handleLotChange}
              value={field.value}
              disabled={!!initialData}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select lot number" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {inventory.map((item) => (
                  <SelectItem key={item.id} value={item.lotNumber}>
                    {item.lotNumber} ({item.remainingQuantity} bags)
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
        name="customerId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Customer</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
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
                  const limitedValue = Math.min(value, maxQuantity || 0);
                  field.onChange(limitedValue);

                  if (selectedLot) {
                    const weightPerUnit = selectedLot.netWeight / selectedLot.quantity;
                    form.setValue("netWeight", limitedValue * weightPerUnit);
                  }
                }}
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
              <Input type="number" {...field} readOnly />
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
              <Input type="number" step="0.01" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="transporterId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Transporter</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select transporter" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {transporters.map((transporter) => (
                  <SelectItem key={transporter.id} value={transporter.id}>
                    {transporter.name}
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
        name="transportCost"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Transport Cost</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
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
            <FormLabel>Broker</FormLabel>
            <Select
              onValueChange={handleBrokerChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select broker" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {brokers.map((broker) => (
                  <SelectItem key={broker.id} value={broker.id}>
                    {broker.name} ({broker.commissionRate}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    <FormField
      control={form.control}
      name="brokerageAmount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Brokerage Amount</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              {...field}
              readOnly={!!selectedBroker}
            />
          </FormControl>
          {selectedBroker && (
            <div className="text-xs text-gray-500">
              Auto-calculated at {selectedBroker.commissionRate}%
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);

export default SalesFormFields;
