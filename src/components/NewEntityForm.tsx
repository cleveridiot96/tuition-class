
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import stringSimilarity from "string-similarity";

interface NewEntityFormProps {
  onSubmit: (data: any) => void;
  entityType: "customer" | "broker" | "transporter";
  existingNames: string[];
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  gst: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const NewEntityForm = ({ onSubmit, entityType, existingNames }: NewEntityFormProps) => {
  const { toast } = useToast();
  const [similarNameWarning, setSimilarNameWarning] = useState<string | null>(null);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contactPerson: "",
      phone: "",
      address: "",
      gst: "",
      notes: "",
    },
  });

  const checkForSimilarNames = (name: string) => {
    if (!name || existingNames.length === 0) return null;
    
    const similarityThreshold = 0.8; // Adjust as needed
    
    const matches = stringSimilarity.findBestMatch(
      name.toLowerCase(),
      existingNames.map(n => n.toLowerCase())
    );
    
    if (matches.bestMatch.rating > similarityThreshold) {
      return `Similar to "${existingNames[matches.bestMatchIndex]}" (${Math.round(matches.bestMatch.rating * 100)}% match)`;
    }
    
    return null;
  };

  const handleFormSubmit = (data: FormData) => {
    // Final check for duplicates
    const exactDuplicate = existingNames.some(
      name => name.toLowerCase() === data.name.toLowerCase()
    );
    
    if (exactDuplicate) {
      toast({
        title: "Error",
        description: `A ${entityType} with this exact name already exists`,
        variant: "destructive",
      });
      return;
    }
    
    const similarityWarning = checkForSimilarNames(data.name);
    if (similarityWarning) {
      // Just warn the user but allow submission
      toast({
        title: "Warning",
        description: `Name is ${similarityWarning}. Proceeding anyway.`,
      });
    }
    
    onSubmit({
      ...data,
      id: `${entityType}_${Date.now()}`, // Create a unique ID with prefix
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span className="text-red-500">*</span> Name
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder={`Enter ${entityType} name`} 
                  onChange={(e) => {
                    field.onChange(e);
                    setSimilarNameWarning(checkForSimilarNames(e.target.value));
                  }}
                />
              </FormControl>
              {similarNameWarning && (
                <p className="text-sm text-amber-500">{similarNameWarning}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter contact person" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter phone number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter address" rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="gst"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GST Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter GST number" />
              </FormControl>
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
                <Textarea {...field} placeholder="Enter additional notes" rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit">
            Add {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewEntityForm;
