
import React, { useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import DashboardMenu from "@/components/DashboardMenu";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { exportDataBackup, importDataBackup, seedInitialData } from "@/services/storageService";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Seed initial data when the app first loads
    seedInitialData();
  }, []);
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = importDataBackup(content);
      
      if (success) {
        toast({
          title: "डेटा इम्पोर्ट सफल",
          description: "सभी डेटा सफलतापूर्वक इम्पोर्ट किया गया",
        });
      } else {
        toast({
          title: "इम्पोर्ट विफल",
          description: "डेटा इम्पोर्ट करने में समस्या आई",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-ag-brown-dark">
            किसान खाता सहायक
          </h2>
          <p className="text-lg text-ag-brown mt-2">
            आपका कृषि व्यापार प्रबंधन सॉफ्टवेयर
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button
              onClick={exportDataBackup}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download size={20} />
              बैकअप (Backup)
            </Button>
            <Button
              onClick={handleImportClick}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Upload size={20} />
              रिस्टोर (Restore)
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
        <DashboardMenu />
        
        <div className="mt-8 p-4 bg-white rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold text-ag-brown-dark mb-2">ऑफलाइन मोड (Offline Mode)</h3>
          <p className="text-ag-brown">
            यह ऐप पूरी तरह से ऑफ़लाइन काम करता है। आपका सारा डेटा आपके कंप्यूटर में सुरक्षित है।
            नियमित रूप से बैकअप लें।
          </p>
          <p className="text-ag-brown mt-2">
            This app works completely offline. All your data is securely stored on your computer.
            Remember to take regular backups.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
