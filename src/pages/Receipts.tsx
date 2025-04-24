
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import {
  getReceipts,
  saveStorageItem,
  getCustomers,
  getBrokers,
} from '@/services/storageService';
import { Receipt } from '@/services/types';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const Receipts = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank'>('cash');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [brokerId, setBrokerId] = useState('');
  const [brokerName, setBrokerName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingReceiptId, setEditingReceiptId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [partyId, setPartyId] = useState('');
  const [partyName, setPartyName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    const storedReceipts = getReceipts();
    setReceipts(storedReceipts);

    const storedCustomers = getCustomers();
    setCustomers(storedCustomers);

    const storedBrokers = getBrokers();
    setBrokers(storedBrokers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount) {
      toast.error('Amount is required.');
      return;
    }

    const receiptNumber = `RCP-${receipts.length + 1}`;

    if (isEditing && editingReceiptId) {
      const updatedReceipts = receipts.map(receipt =>
        receipt.id === editingReceiptId
          ? { ...receipt, date, amount: parseFloat(amount), paymentMethod, reference, notes, customerId, customerName, brokerId, brokerName, partyId, partyName }
          : receipt
      );
      saveStorageItem('receipts', updatedReceipts);
      setReceipts(updatedReceipts);
      toast.success('Receipt updated successfully!');
    } else {
      const newReceipt = {
        id: uuidv4(),
        date,
        receiptNumber,
        amount: parseFloat(amount),
        paymentMethod,
        reference,
        notes,
        customerId,
        customerName: customerName || '',
        partyId,
        partyName,
        mode: paymentMethod // Use paymentMethod instead of adding partyType
      };
      const updatedReceipts = [...receipts, newReceipt];
      saveStorageItem('receipts', updatedReceipts);
      setReceipts(updatedReceipts);
      toast.success('Receipt added successfully!');
    }

    clearForm();
  };

  const handleEdit = (id: string) => {
    const receiptToEdit = receipts.find(receipt => receipt.id === id);
    if (receiptToEdit) {
      setIsEditing(true);
      setEditingReceiptId(id);
      setDate(receiptToEdit.date);
      setAmount(receiptToEdit.amount.toString());
      setPaymentMethod(receiptToEdit.paymentMethod as 'cash' | 'bank');
      setReference(receiptToEdit.reference || '');
      setNotes(receiptToEdit.notes || '');
      setCustomerId(receiptToEdit.customerId || '');
      setCustomerName(receiptToEdit.customerName || '');
      setBrokerId(receiptToEdit.brokerId || '');
      setBrokerName(receiptToEdit.brokerName || '');
      setPartyId(receiptToEdit.partyId || '');
      setPartyName(receiptToEdit.partyName || '');
    }
  };

  const handleDelete = (id: string) => {
    const updatedReceipts = receipts.filter(receipt => receipt.id !== id);
    saveStorageItem('receipts', updatedReceipts);
    setReceipts(updatedReceipts);
    toast.success('Receipt deleted successfully!');
  };

  const clearForm = () => {
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setAmount('');
    setPaymentMethod('cash');
    setReference('');
    setNotes('');
    setCustomerId('');
    setCustomerName('');
    setBrokerId('');
    setBrokerName('');
    setIsEditing(false);
    setEditingReceiptId(null);
    setPartyId('');
    setPartyName('');
  };

  const handlePaymentMethodChange = (value: string) => {
    if (value === 'cash' || value === 'bank') {
      setPaymentMethod(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navigation title="Receipts" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-blue-200 shadow">
          <CardHeader>
            <CardTitle className="text-blue-800">Receipts</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select 
                  value={paymentMethod} 
                  onValueChange={handlePaymentMethodChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reference">Reference</Label>
                <Input
                  type="text"
                  id="reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  type="text"
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="customerId">Customer</Label>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="brokerId">Broker</Label>
                <Select value={brokerId} onValueChange={setBrokerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select broker" />
                  </SelectTrigger>
                  <SelectContent>
                    {brokers.map(broker => (
                      <SelectItem key={broker.id} value={broker.id}>
                        {broker.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="md-ripple bg-blue-500 text-white hover:bg-blue-700">
                {isEditing ? 'Update Receipt' : 'Add Receipt'}
              </Button>
              {isEditing && (
                <Button type="button" variant="secondary" onClick={clearForm}>
                  Cancel Edit
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
        <Card className="mt-4 bg-gradient-to-br from-blue-100 to-blue-200 border-blue-200 shadow">
          <CardHeader>
            <CardTitle className="text-blue-800">Receipts List</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-400px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Receipt Number</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Broker</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell>{format(new Date(receipt.date), 'dd MMM yyyy')}</TableCell>
                      <TableCell>{receipt.receiptNumber}</TableCell>
                      <TableCell>{receipt.amount}</TableCell>
                      <TableCell>{receipt.paymentMethod}</TableCell>
                      <TableCell>{receipt.customerName}</TableCell>
                      <TableCell>{receipt.brokerName}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(receipt.id)}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(receipt.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Receipts;
