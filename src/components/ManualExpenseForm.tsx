
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { useToast } from '@/hooks/use-toast';

import {
  addManualExpense,
  ManualExpense,
  getAccounts,
  Account,
} from '@/services/accountingService';

const formSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  paymentMode: z.string().min(1, 'Payment mode is required'),
  category: z.string().min(1, 'Category is required'),
  reference: z.string().optional(),
  partyId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ManualExpenseFormProps {
  onSubmit?: (data: ManualExpense) => void;
  onCancel?: () => void;
}

const expenseCategories = [
  'Office Expense',
  'Salary',
  'Rent',
  'Utilities',
  'Travel',
  'Miscellaneous',
  'Other',
];

const ManualExpenseForm: React.FC<ManualExpenseFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: 0,
      description: '',
      paymentMode: 'cash',
      category: 'Office Expense',
      reference: '',
      partyId: '',
    },
  });

  React.useEffect(() => {
    // Load non-system accounts for optional party selection
    const partyAccounts = getAccounts().filter(
      account => !account.isSystemAccount && !account.isDeleted
    );
    setAccounts(partyAccounts);
  }, []);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      form.setValue('date', format(date, 'yyyy-MM-dd'));
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    try {
      // Find party name if partyId is provided
      let partyName;
      if (data.partyId) {
        const party = accounts.find(a => a.id === data.partyId);
        partyName = party?.name;
      }

      // Create expense object
      const expense: ManualExpense = {
        id: Date.now().toString(),
        date: data.date,
        amount: data.amount,
        description: data.description,
        paymentMode: data.paymentMode as 'cash' | 'bank',
        category: data.category,
        reference: data.reference,
        partyId: data.partyId,
        partyName,
      };

      // Add manual expense and trigger ledger entries
      const savedExpense = addManualExpense(expense);

      toast({
        title: 'Expense Added',
        description: `₹${data.amount} expense has been recorded.`,
      });

      // Reset form
      form.reset({
        date: format(new Date(), 'yyyy-MM-dd'),
        amount: 0,
        description: '',
        paymentMode: 'cash',
        category: 'Office Expense',
        reference: '',
        partyId: '',
      });

      // Call parent onSubmit if provided
      if (onSubmit) {
        onSubmit(savedExpense);
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: 'Error',
        description: 'Failed to add expense. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <DatePicker
                    date={selectedDate}
                    setDate={handleDateChange}
                    className="w-full"
                  />
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
                  <Input type="number" {...field} min="0" step="0.01" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    <SelectItem value="bank">Bank</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expense Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {expenseCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
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
            name="reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Bill/Voucher number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="partyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Party (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a party (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter expense details"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Add Expense</Button>
        </div>
      </form>
    </Form>
  );
};

export default ManualExpenseForm;
