
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { createPortableVersion } from "@/utils/portableAppUtils";

const PortableAppButton = () => {
  const [isCreating, setIsCreating] = React.useState(false);

  const handleCreatePortable = async () => {
    setIsCreating(true);
    try {
      await createPortableVersion();
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
