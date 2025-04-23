
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Package, Download } from "lucide-react";
import { createPortableVersion } from "@/utils/portableAppUtils";
import { toast } from "sonner";

const PortableAppButton = () => {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePortable = async () => {
    setIsCreating(true);
    try {
      // Use the createPortableVersion function from portableAppUtils
      const result = await createPortableVersion();
      
      if (result) {
        toast.success("Portable App Created", {
          description: "Extract the ZIP file and open index.html to use your app anywhere!"
        });
      } else {
        toast.error("Failed to create portable version");
      }
    } catch (error) {
      console.error("Error creating portable version:", error);
      toast.error("An unexpected error occurred");
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
      {isCreating ? <Package size={16} className="animate-spin mr-2" /> : <Download size={16} />}
      {isCreating ? "Creating..." : "Export Portable Version"}
    </Button>
  );
};

export default PortableAppButton;
