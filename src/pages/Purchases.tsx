import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Navigation from "@/components/Navigation";
import NewPurchaseForm from "@/components/NewPurchaseForm";
import PurchaseTable from "@/components/purchases/PurchaseTable";
import PurchaseFilters from "@/components/purchases/PurchaseFilters";
import BulkAddToInventory from "@/components/purchases/BulkAddToInventory";
import { usePurchaseList } from "@/hooks/purchases/usePurchaseList";

const Purchases = () => {
  const {
    purchases,
    agents,
    suppliers,
    transporters,
    brokers,
    searchTerm,
    setSearchTerm,
    filterLocation,
    setFilterLocation,
    filterAgent,
    setFilterAgent,
    dateRange,
    setDateRange,
    isAddingToInventory,
    sortColumn,
    sortDirection,
    handleSort,
    entityToDelete,
    showDeleteDialog,
    setShowDeleteDialog,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    entityToEdit,
    handleDelete,
    handleAdd,
    handleUpdate,
    handleBulkAddToInventory
  } = usePurchaseList();

  const getPurchaseFormFields = () => {
    return [
      {
        name: 'date',
        label: 'Date',
        type: 'date',
        required: true,
      },
      {
        name: 'lotNumber',
        label: 'Lot Number',
        type: 'text',
        required: true,
      },
      {
        name: 'partyId',
        label: 'Supplier',
        type: 'select',
        options: suppliers.map(supplier => ({ value: supplier.id, label: supplier.name })),
        required: true,
      },
      {
        name: 'agentId',
        label: 'Agent',
        type: 'select',
        options: agents.map(agent => ({ value: agent.id, label: agent.name })),
        required: false,
      },
      {
        name: 'quantity',
        label: 'Quantity',
        type: 'number',
        required: true,
      },
      {
        name: 'netWeight',
        label: 'Net Weight',
        type: 'number',
        required: true,
      },
      {
        name: 'rate',
        label: 'Rate',
        type: 'number',
        required: true,
      },
      {
        name: 'totalAmount',
        label: 'Total Amount',
        type: 'number',
        required: true,
      },
      {
        name: 'transporterId',
        label: 'Transporter',
        type: 'select',
        options: transporters.map(transporter => ({ value: transporter.id, label: transporter.name })),
        required: false,
      },
      {
        name: 'transportRate',
        label: 'Transport Rate',
        type: 'number',
        required: false,
      },
      {
        name: 'transportAmount',
        label: 'Transport Amount',
        type: 'number',
        required: false,
      },
      {
        name: 'brokerId',
        label: 'Broker',
        type: 'select',
        options: brokers.map(broker => ({ value: broker.id, label: broker.name })),
        required: false,
      },
      {
        name: 'brokerageType',
        label: 'Brokerage Type',
        type: 'select',
        options: [{ value: 'percentage', label: 'Percentage' }, { value: 'fixed', label: 'Fixed' }],
        required: false,
      },
      {
        name: 'brokerageValue',
        label: 'Brokerage Value',
        type: 'number',
        required: false,
      },
      {
        name: 'brokerageAmount',
        label: 'Brokerage Amount',
        type: 'number',
        required: false,
      },
      {
        name: 'expenses',
        label: 'Expenses',
        type: 'number',
        required: false,
      },
      {
        name: 'totalAfterExpenses',
        label: 'Total After Expenses',
        type: 'number',
        required: true,
      },
      {
        name: 'location',
        label: 'Location',
        type: 'text',
        required: true,
      },
      {
        name: 'notes',
        label: 'Notes',
        type: 'text',
        required: false,
      },
    ];
  };

  return (
    <div className="min-h-screen">
      <Navigation title="Purchases" showBackButton={true} />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Purchases</h1>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-1" /> Add Purchase
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Purchase</DialogTitle>
              </DialogHeader>
              <NewPurchaseForm 
                onSubmit={handleAdd} 
                fields={getPurchaseFormFields()}
                agents={agents}
                suppliers={suppliers}
                transporters={transporters}
                brokers={brokers}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <PurchaseFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterLocation={filterLocation}
          onLocationChange={setFilterLocation}
          filterAgent={filterAgent}
          onAgentChange={setFilterAgent}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          agents={agents}
        />

        {purchases.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No purchases found.</p>
        ) : (
          <>
            <div className="mb-4">
              <BulkAddToInventory
                purchases={purchases}
                onAddToInventory={handleBulkAddToInventory}
                disabled={isAddingToInventory}
              />
            </div>
            <PurchaseTable
              purchases={purchases}
              onDelete={(id) => {
                setShowDeleteDialog(true);
                setEntityToDelete(id);
              }}
              onEdit={(purchase) => {
                setEntityToEdit(purchase);
                setIsEditDialogOpen(true);
              }}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </>
        )}
        
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this purchase? This action cannot be undone.
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
              <DialogTitle>Edit Purchase</DialogTitle>
            </DialogHeader>
            {entityToEdit && (
              <NewPurchaseForm 
                onSubmit={handleUpdate} 
                initialData={entityToEdit}
                fields={getPurchaseFormFields()}
                agents={agents}
                suppliers={suppliers}
                transporters={transporters}
                brokers={brokers}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Purchases;
