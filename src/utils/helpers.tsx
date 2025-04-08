
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";

/**
 * Format date consistently across the application
 * @param dateString The date string to format
 * @returns Formatted date string in DD/MM/YY format
 */
export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'dd/MM/yy');
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};

/**
 * Detect if quantity represents bags or boxes based on weight pattern
 * @param quantity The quantity value
 * @returns "bag" or "box" string
 */
export const detectPackageType = (quantity: number): "bag" | "box" => {
  // If quantity is divisible by 50 with no remainder, it's likely bags (50kg standard)
  if (quantity % 50 === 0) {
    return "bag";
  }
  // If quantity is divisible by 25 but not by 50, it's likely boxes (25kg standard)
  else if (quantity % 25 === 0) {
    return "box";
  }
  // Default to bag if we can't determine
  else {
    return "bag";
  }
};

/**
 * Format currency in Indian Rupee format
 * @param amount Amount to format
 * @param decimals Number of decimal places (default 2)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, decimals: number = 2): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: decimals,
  }).format(amount);
};

/**
 * React hook to confirm deletion with a custom message
 * @returns Object with confirm function
 */
export const useConfirmDelete = () => {
  const { toast } = useToast();

  const confirm = (itemName: string, onConfirm: () => void) => {
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      onConfirm();
    } else {
      toast({
        title: "Deletion cancelled",
        description: `"${itemName}" was not deleted.`,
      });
    }
  };

  return { confirm };
};

/**
 * Convert a number to words in Hindi/English
 * @param number Number to convert
 * @returns String representation in words
 */
export const numberToWords = (number: number): string => {
  const ones = [
    "", "एक", "दो", "तीन", "चार", "पांच", "छह", "सात", "आठ", "नौ",
    "दस", "ग्यारह", "बारह", "तेरह", "चौदह", "पंद्रह", "सोलह", "सत्रह", "अट्ठारह", "उन्नीस"
  ];
  
  const tens = [
    "", "", "बीस", "तीस", "चालीस", "पचास", "साठ", "सत्तर", "अस्सी", "नब्बे"
  ];
  
  const numString = number.toString();
  
  if (number < 20) {
    return ones[number];
  } else if (number < 100) {
    const ten = Math.floor(number / 10);
    const one = number % 10;
    return one ? `${tens[ten]}-${ones[one]}` : tens[ten];
  } else {
    return numString; // Return as is for larger numbers
  }
};

/**
 * Extract sale ID from URL search params
 * @returns Sale ID if present in URL
 */
export const getSaleIdFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get('edit');
};
