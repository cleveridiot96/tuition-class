import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw, FileDown, FileUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import {
  getTotalSalesValue,
  getTotalPurchaseValue,
  getTotalInventoryValue,
  getLastBackupTime,
  getBackupList,
} from "@/services/storageService";
import { createCompleteBackup } from "@/services/backup/backupService";
import { toast } from "sonner";
import BackupRestoreDialog from "./backup/BackupRestoreDialog";
import PortableAppButton from "./dashboard/PortableAppButton";

const DashboardSummary = () => {
  const navigate = useNavigate();
  const [totalSales, setTotalSales] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [totalInventory, setTotalInventory] = useState(0);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [backupList, setBackupList] = useState<string[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showBackupRestoreDialog, setShowBackupRestoreDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      setTotalSales(getTotalSalesValue());
      setTotalPurchases(getTotalPurchaseValue());
      setTotalInventory(getTotalInventoryValue());
      setLastBackup(getLastBackupTime());
      setBackupList(getBackupList());
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    try {
      const backupResult = createCompleteBackup();
      if (backupResult) {
        setLastBackup(getLastBackupTime());
        setBackupList(getBackupList());
        toast.success("Backup Created", {
          description: `Backup created successfully on ${format(new Date(), 'MMM dd, yyyy hh:mm a')}.`
        });
      } else {
        toast.error("Backup Failed", {
          description: "There was an error creating the backup."
        });
      }
    } catch (error) {
      console.error("Backup error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4 bg-white shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Button onClick={() => navigate("/sales")} className="flex items-center justify-between">
            <span>Go to Sales</span>
            <ArrowRight size={16} />
          </Button>
          <Button onClick={() => navigate("/purchases")} className="flex items-center justify-between">
            <span>Go to Purchases</span>
            <ArrowRight size={16} />
          </Button>
          <Button onClick={() => navigate("/inventory")} className="flex items-center justify-between">
            <span>Manage Inventory</span>
            <ArrowRight size={16} />
          </Button>
          <Button onClick={() => navigate("/cashbook")} className="flex items-center justify-between">
            <span>Manage Cashbook</span>
            <ArrowRight size={16} />
          </Button>
          <Button onClick={() => navigate("/reports")} className="flex items-center justify-between">
            <span>View Reports</span>
            <ArrowRight size={16} />
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-4 bg-white shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500">Total Sales Value</p>
            <p className="text-2xl font-bold">₹{totalSales.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500">Total Purchase Value</p>
            <p className="text-2xl font-bold">₹{totalPurchases.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500">Total Inventory Value</p>
            <p className="text-2xl font-bold">₹{totalInventory.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4 bg-white shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Backup &amp; Restore</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between mt-4">
            <div className="flex space-x-2">
              <Button
                onClick={handleCreateBackup}
                disabled={isBackingUp}
                className="flex items-center gap-2"
              >
                {isBackingUp ? <RefreshCw size={16} className="animate-spin" /> : <FileUp size={16} />}
                {isBackingUp ? "Backing Up..." : "Create Backup"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowBackupRestoreDialog(true)}
                className="flex items-center gap-2"
              >
                <FileDown size={16} /> Restore Backup
              </Button>
            </div>
            <PortableAppButton />
          </div>
          <div className="mt-4">
            {lastBackup ? (
              <p className="text-sm text-gray-500">
                Last Backup: {lastBackup}
              </p>
            ) : (
              <p className="text-sm text-gray-500">No backups created yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <BackupRestoreDialog
        open={showBackupRestoreDialog}
        setOpen={setShowBackupRestoreDialog}
        backupList={backupList}
        onBackupRestored={() => {
          loadData();
          setShowBackupRestoreDialog(false);
        }}
      />
    </div>
  );
};

export default DashboardSummary;
