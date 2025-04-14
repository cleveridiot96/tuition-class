
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Package, Download } from "lucide-react";
import { createPortableVersion } from "@/utils/portableAppUtils";
import { toast } from "sonner";

const PortableAppButton = () => {
  const [isCreating, setIsCreating] = React.useState(false);

  const handleCreatePortable = async () => {
    setIsCreating(true);
    try {
      await createPortableVersion();
      toast.success("Portable version created successfully! Extract the ZIP file to your USB drive or any storage device and open index.html to use the app anywhere.");
    } catch (error) {
      console.error("Error creating portable version:", error);
      toast.error("Failed to create portable version. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  React.useEffect(() => {
    const handlePortableCreated = (event: CustomEvent) => {
      if (event.detail?.success) {
        toast.success("Portable version created successfully! Extract the ZIP file to your USB drive or any storage device and open index.html to use the app anywhere.");
      } else {
        toast.error("Failed to create portable version. Please try again.");
        console.error("Error details:", event.detail?.error);
      }
    };

    window.addEventListener('portable-version-created', handlePortableCreated as EventListener);
    
    return () => {
      window.removeEventListener('portable-version-created', handlePortableCreated as EventListener);
    };
  }, []);

  return (
    <Button 
      onClick={handleCreatePortable}
      disabled={isCreating}
      className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-lg py-6 px-8 android-ripple"
      size="lg"
    >
      {isCreating ? <Package className="animate-pulse" size={24} /> : <Download size={24} />}
      {isCreating ? "Creating Portable Version..." : "Create USB Drive Version"}
    </Button>
  );
};

export default PortableAppButton;
