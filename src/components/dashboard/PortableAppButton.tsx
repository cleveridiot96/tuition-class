
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { createPortableVersion } from "@/utils/portableAppUtils";
import { toast } from "@/hooks/use-toast";

const PortableAppButton = () => {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePortable = async () => {
    setIsCreating(true);
    try {
      const result = await createPortableVersion();
      if (result) {
        toast({
          title: "Portable App Created",
          description: "Just unzip and open index.html to use your app anywhere!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create portable version",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button 
      onClick={handleCreatePortable}
      disabled={isCreating}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
    >
      <Package size={16} />
      {isCreating ? "Creating..." : "Create Portable Version"}
    </Button>
  );
};

export default PortableAppButton;
