
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Agent } from '@/services/types';
import { GlassmorphismButton } from '@/components/ui/glassmorphism-button';

interface AgentFormProps {
  onAgentAdded: (agent: Agent) => void;
  onCancel: () => void;
  initialValues?: Partial<Agent>;
}

const AgentForm: React.FC<AgentFormProps> = ({ onAgentAdded, onCancel, initialValues }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: initialValues?.name || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Agent name is required",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const newAgent: Agent = {
        id: initialValues?.id || uuidv4(),
        name: formData.name.trim(),
        balance: initialValues?.balance || 0,
      };

      onAgentAdded(newAgent);
      
      toast({
        title: "Success",
        description: initialValues ? "Agent updated successfully" : "Agent added successfully",
      });
    } catch (error) {
      console.error("Error adding agent:", error);
      toast({
        title: "Error",
        description: "Failed to save agent",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Agent Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter agent name"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <GlassmorphismButton type="button" variant="blue" onClick={onCancel}>
          Cancel
        </GlassmorphismButton>
        <GlassmorphismButton type="submit" variant="purple" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialValues ? "Update Agent" : "Add Agent"}
        </GlassmorphismButton>
      </div>
    </form>
  );
};

export default AgentForm;
