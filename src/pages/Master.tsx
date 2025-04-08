import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import NewEntityForm from '@/components/NewEntityForm';
import { 
  getAgents, addAgent, deleteAgent, updateAgent,
  getCustomers, addCustomer, deleteCustomer, updateCustomer,
  getBrokers, addBroker, deleteBroker, updateBroker,
  getTransporters, addTransporter, deleteTransporter, updateTransporter,
  getSuppliers, addSupplier, deleteSupplier, updateSupplier 
} from '@/services/storageService';
import { Edit, Trash2, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const Master = () => {
  const [activeTab, setActiveTab] = useState('agents');
  const [agents, setAgents] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [transporters, setTransporters] = useState([]);
  const [entityToDelete, setEntityToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentEntityType, setCurrentEntityType] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [entityToEdit, setEntityToEdit] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAgents(getAgents());
    setSuppliers(getSuppliers());
    setCustomers(getCustomers());
    setBrokers(getBrokers());
    setTransporters(getTransporters());
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const confirmDelete = (id, type) => {
    setEntityToDelete(id);
    setCurrentEntityType(type);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    if (!entityToDelete || !currentEntityType) return;

    switch (currentEntityType) {
      case 'agent':
        deleteAgent(entityToDelete);
        break;
      case 'supplier':
        deleteSupplier(entityToDelete);
        break;
      case 'customer':
        deleteCustomer(entityToDelete);
        break;
      case 'broker':
        deleteBroker(entityToDelete);
        break;
      case 'transporter':
        deleteTransporter(entityToDelete);
        break;
      default:
        break;
    }

    loadData();
    toast.success(`${currentEntityType.charAt(0).toUpperCase() + currentEntityType.slice(1)} deleted successfully`);
    setShowDeleteDialog(false);
    setEntityToDelete(null);
    setCurrentEntityType('');
  };

  const handleAdd = (data) => {
    switch (activeTab) {
      case 'agents':
        addAgent({
          id: `agent-${Date.now()}`,
          name: data.name,
          address: data.address,
          balance: 0
        });
        break;
      case 'suppliers':
        addSupplier({
          id: `supplier-${Date.now()}`,
          name: data.name,
          address: data.address,
          balance: 0
        });
        break;
      case 'customers':
        addCustomer({
          id: `customer-${Date.now()}`,
          name: data.name,
          address: data.address,
          balance: 0
        });
        break;
      case 'brokers':
        addBroker({
          id: `broker-${Date.now()}`,
          name: data.name,
          address: data.address,
          commissionRate: data.commissionRate || 1,
          balance: 0
        });
        break;
      case 'transporters':
        addTransporter({
          id: `transporter-${Date.now()}`,
          name: data.name,
          address: data.address,
          balance: 0
        });
        break;
      default:
        break;
    }

    loadData();
    setIsAddDialogOpen(false);
    toast.success(`${activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(0, -1).slice(1)} added successfully`);
  };

  const openEditDialog = (entity, type) => {
    setEntityToEdit(entity);
    setCurrentEntityType(type);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data) => {
    if (!entityToEdit || !currentEntityType) return;

    const updatedEntity = {
      ...entityToEdit,
      name: data.name,
      address: data.address,
    };

    if (currentEntityType === 'broker' && data.commissionRate !== undefined) {
      updatedEntity.commissionRate = data.commissionRate;
    }

    switch (currentEntityType) {
      case 'agent':
        updateAgent(updatedEntity);
        break;
      case 'supplier':
        updateSupplier(updatedEntity);
        break;
      case 'customer':
        updateCustomer(updatedEntity);
        break;
      case 'broker':
        updateBroker(updatedEntity);
        break;
      case 'transporter':
        updateTransporter(updatedEntity);
        break;
      default:
        break;
    }

    loadData();
    toast.success(`${currentEntityType.charAt(0).toUpperCase() + currentEntityType.slice(1)} updated successfully`);
    setIsEditDialogOpen(false);
    setEntityToEdit(null);
    setCurrentEntityType('');
  };

  const getEntityFormFields = (type) => {
    const commonFields = [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'Enter name',
        required: true,
      },
      {
        name: 'address',
        label: 'Address',
        type: 'text',
        placeholder: 'Enter address',
        required: false,
      },
    ];

    if (type === 'broker') {
      return [
        ...commonFields,
        {
          name: 'commissionRate',
          label: 'Default Commission Rate (%)',
          type: 'number',
          placeholder: 'Enter default commission rate',
          required: false,
        },
      ];
    }

    return commonFields;
  };

  return (
    <div className="min-h-screen">
      <Navigation title="Master Data" showBackButton={true} />
      
      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue="agents" value={activeTab} onValueChange={handleTabChange}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="brokers">Brokers</TabsTrigger>
              <TabsTrigger value="transporters">Transporters</TabsTrigger>
            </TabsList>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus size={18} className="mr-1" /> Add {activeTab.slice(0, -1)}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(0, -1).slice(1)}</DialogTitle>
                </DialogHeader>
                <NewEntityForm 
                  onSubmit={handleAdd} 
                  fields={getEntityFormFields(activeTab.slice(0, -1))}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <TabsContent value="agents">
            <Card>
              <CardContent className="p-6">
                <EntityTable 
                  entities={agents} 
                  onDelete={(id) => confirmDelete(id, 'agent')}
                  onEdit={(entity) => openEditDialog(entity, 'agent')}
                  type="agent"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="suppliers">
            <Card>
              <CardContent className="p-6">
                <EntityTable 
                  entities={suppliers} 
                  onDelete={(id) => confirmDelete(id, 'supplier')}
                  onEdit={(entity) => openEditDialog(entity, 'supplier')}
                  type="supplier"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers">
            <Card>
              <CardContent className="p-6">
                <EntityTable 
                  entities={customers} 
                  onDelete={(id) => confirmDelete(id, 'customer')}
                  onEdit={(entity) => openEditDialog(entity, 'customer')}
                  type="customer"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="brokers">
            <Card>
              <CardContent className="p-6">
                <EntityTable 
                  entities={brokers} 
                  onDelete={(id) => confirmDelete(id, 'broker')}
                  onEdit={(entity) => openEditDialog(entity, 'broker')}
                  type="broker"
                  showCommissionRate
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transporters">
            <Card>
              <CardContent className="p-6">
                <EntityTable 
                  entities={transporters} 
                  onDelete={(id) => confirmDelete(id, 'transporter')}
                  onEdit={(entity) => openEditDialog(entity, 'transporter')}
                  type="transporter"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this {currentEntityType}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Edit {currentEntityType ? currentEntityType.charAt(0).toUpperCase() + currentEntityType.slice(1) : ''}
              </DialogTitle>
            </DialogHeader>
            {entityToEdit && (
              <NewEntityForm 
                onSubmit={handleUpdate} 
                initialData={entityToEdit}
                fields={getEntityFormFields(currentEntityType)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const EntityTable = ({ entities, onDelete, onEdit, type, showCommissionRate = false }) => {
  if (!entities || entities.length === 0) {
    return <p className="text-center py-8 text-gray-500">No entries found.</p>;
  }
  
  return (
    <ScrollArea className="h-[calc(100vh-250px)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Name</TableHead>
            <TableHead className="w-2/5">Address</TableHead>
            {showCommissionRate && <TableHead className="w-1/6">Commission Rate (%)</TableHead>}
            <TableHead className="w-1/6">Balance (₹)</TableHead>
            <TableHead className="w-1/6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entities.map((entity) => (
            <TableRow key={entity.id}>
              <TableCell className="font-medium">{entity.name}</TableCell>
              <TableCell>{entity.address || '-'}</TableCell>
              {showCommissionRate && <TableCell>{entity.commissionRate || 0}%</TableCell>}
              <TableCell>₹{entity.balance?.toFixed(2) || '0.00'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(entity)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onDelete(entity.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default Master;
