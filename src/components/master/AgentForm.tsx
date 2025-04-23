
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { Agent } from "@/services/types";

const agentSchema = z.object({
  name: z.string().min(1, "Agent name is required"),
  commission: z.coerce.number().min(0, "Commission cannot be negative").optional(),
});

type AgentFormValues = z.infer<typeof agentSchema>;

interface AgentFormProps {
  onClose: () => void;
  initialData?: any;
}

const AgentForm: React.FC<AgentFormProps> = ({ onClose, initialData }) => {
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: initialData?.name || "",
      commission: initialData?.commission || 1,
    },
  });

  const onSubmit = (data: AgentFormValues) => {
    const newAgent: Agent = {
      id: initialData?.id || uuidv4(),
      name: data.name,
      commissionRate: data.commission,
      balance: initialData?.balance || 0,
    };
    console.log("Agent form data:", newAgent);
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="commission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commission (%)</FormLabel>
              <FormControl>
                <Input {...field} type="number" step="0.01" />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};

export default AgentForm;
