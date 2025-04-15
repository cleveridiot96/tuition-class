
import { useState, useEffect } from "react";
import { useToast } from '@/hooks/use-toast';
import { getCashBookEntries, initializeAccounting, getTodayCashTransactions } from "@/services/ledger";

const useCashBook = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [todaySummary, setTodaySummary] = useState({ cashIn: 0, cashOut: 0 });

  useEffect(() => {
    loadCashbookData();
  }, []);

  const loadCashbookData = () => {
    setIsLoading(true);
    
    try {
      initializeAccounting();
      
      const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : undefined;
      const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;
      
      const cashbookEntries = getCashBookEntries(formattedStartDate, formattedEndDate);
      setEntries(cashbookEntries);
      
      const { cashIn, cashOut } = getTodayCashTransactions();
      setTodaySummary({ cashIn, cashOut });
      
      console.log("Cashbook entries loaded:", cashbookEntries.length);
    } catch (error) {
      console.error("Error loading cashbook data:", error);
      toast({
        title: "Error",
        description: "Failed to load cashbook data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = () => {
    loadCashbookData();
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setTimeout(() => {
      loadCashbookData();
    }, 0);
  };

  const handleManualExpenseAdded = () => {
    setExpenseDialogOpen(false);
    loadCashbookData();
    toast({
      title: "Success",
      description: "Manual expense has been added to cashbook",
    });
  };

  const handlePaymentAdded = () => {
    setPaymentDialogOpen(false);
    loadCashbookData();
    toast({
      title: "Success",
      description: "Payment has been added to cashbook",
    });
  };

  const handleReceiptAdded = () => {
    setReceiptDialogOpen(false);
    loadCashbookData();
    toast({
      title: "Success",
      description: "Receipt has been added to cashbook",
    });
  };

  return {
    entries,
    startDate,
    endDate,
    isLoading,
    todaySummary,
    expenseDialogOpen,
    paymentDialogOpen,
    receiptDialogOpen,
    setStartDate,
    setEndDate,
    setExpenseDialogOpen,
    setPaymentDialogOpen,
    setReceiptDialogOpen,
    loadCashbookData,
    resetFilters,
    handleFilterChange,
    handleManualExpenseAdded,
    handlePaymentAdded,
    handleReceiptAdded
  };
};

export default useCashBook;
