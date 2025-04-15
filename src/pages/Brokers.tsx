
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import BrokerForm from '@/components/BrokerForm';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  RefreshCw,
  HandCoins
} from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getBrokers, addBroker, updateBroker, deleteBroker } from '@/services/brokerService';
import { Badge } from '@/components/ui/badge';
import { Broker } from '@/services/types';

const BrokersPage = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBroker, setEditingBroker] = useState<Broker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [brokerToDelete, setBrokerToDelete] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadBrokers();
  }, []);

  const loadBrokers = () => {
    setIsRefreshing(true);
    try {
      const brokersData = getBrokers();
      setBrokers(brokersData);
    } catch (error) {
      console.error("Error loading brokers:", error);
      toast.error("Failed to load brokers");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddBroker = (brokerData: Broker) => {
    try {
      addBroker(brokerData);
      loadBrokers();
      setIsAddDialogOpen(false);
      toast.success("Broker added successfully");
    } catch (error) {
      console.error("Error adding broker:", error);
      toast.error("Failed to add broker");
    }
  };

  const handleEditBroker = (broker: Broker) => {
    setEditingBroker(broker);
    setIsEditDialogOpen(true);
  };

  const handleUpdateBroker = (updatedBroker: Broker) => {
    try {
      updateBroker(updatedBroker);
      loadBrokers();
      setIsEditDialogOpen(false);
      setEditingBroker(null);
      toast.success("Broker updated successfully");
    } catch (error) {
      console.error("Error updating broker:", error);
      toast.error("Failed to update broker");
    }
  };

  const handleDeleteBroker = (id: string) => {
    setBrokerToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteBroker = () => {
    if (brokerToDelete) {
      try {
        deleteBroker(brokerToDelete);
        loadBrokers();
        setIsDeleteDialogOpen(false);
        setBrokerToDelete(null);
        toast.success("Broker deleted successfully");
      } catch (error) {
        console.error("Error deleting broker:", error);
        toast.error("Failed to delete broker");
      }
    }
  };

  const filteredBrokers = brokers.filter(broker =>
    broker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Navigation title="Brokers" showBackButton={true} />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Brokers</h1>
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Search brokers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:w-64"
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={loadBrokers}
              disabled={isRefreshing}
              title="Refresh data"
            >
              <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle size={18} className="mr-2" />
                  Add Broker
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Broker</DialogTitle>
                </DialogHeader>
                <BrokerForm onSubmit={handleAddBroker} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Broker List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrokers.map((broker) => (
                  <TableRow key={broker.id}>
                    <TableCell>{broker.name}</TableCell>
                    <TableCell>{broker.phone}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditBroker(broker)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteBroker(broker.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Broker</DialogTitle>
            </DialogHeader>
            {editingBroker && (
              <BrokerForm
                onSubmit={handleUpdateBroker}
                initialData={editingBroker}
              />
            )}
          </DialogContent>
        </Dialog>
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this broker? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteBroker} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default BrokersPage;
