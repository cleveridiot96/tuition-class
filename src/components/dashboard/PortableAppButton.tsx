
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { createPortableVersion } from "@/utils/portableAppUtils";
import { toast } from "sonner";

const PortableAppButton = () => {
  const [isCreating, setIsCreating] = React.useState(false);

  const handleCreatePortable = async () => {
    setIsCreating(true);
    try {
      await createPortableVersion();
      toast.success("Portable version created successfully. You can now copy this folder to a USB drive or any computer.");
    } catch (error) {
      console.error("Error creating portable version:", error);
      toast.error("Failed to create portable version. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button 
      onClick={handleCreatePortable}
      disabled={isCreating}
      className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-lg py-6 px-8 android-ripple"
      size="lg"
    >
      <Package size={24} />
      {isCreating ? "Creating..." : "Create Portable Version"}
    </Button>
  );
};

export default PortableAppButton;
