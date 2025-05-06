
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Customer, Broker, Transporter, Sale } from '@/services/types';
import { getCustomers, getBrokers, getTransporters, getLocations } from '@/services/storageService';
import ItemsTable from '../shared/ItemsTable';
import FormSummary from '../shared/FormSummary';
import SalesFormHeader from './components/SalesFormHeader';
import PartiesSection from './components/PartiesSection';
import { useSalesForm } from './hooks/useSalesForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MultiItemSalesFormProps {
  onCancel: () => void;
  onSubmit: (sale: Sale) => void;
  initialSale?: Sale;
  onPrint?: () => void;
}

const MultiItemSalesForm: React.FC<MultiItemSalesFormProps> = ({
  onCancel,
  onSubmit,
  initialSale,
  onPrint
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  const {
    formState,
    selectedBroker,
    isSubmitting,
    setSelectedBroker,
    handleInputChange,
    handleSelectChange,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    calculateSubtotal,
    calculateBrokerageAmount,
    calculateTotal,
    handleSubmit
  } = useSalesForm({ onSubmit, initialSale });

  useEffect(() => {
    // Load actual data from storage
    const loadData = () => {
      try {
        const loadedCustomers = getCustomers() || [];
        const loadedBrokers = getBrokers() || [];
        const loadedTransporters = getTransporters() || [];
        const loadedLocations = getLocations() || ['Mumbai', 'Chiplun', 'Sawantwadi'];
        
        setCustomers(loadedCustomers);
        setBrokers(loadedBrokers);
        setTransporters(loadedTransporters);
        setLocations(loadedLocations);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (formState.brokerId) {
      const broker = brokers.find(broker => broker.id === formState.brokerId);
      setSelectedBroker(broker || null);
    }
  }, [formState.brokerId, brokers]);

  return (
    <div className="w-full max-w-full mx-auto bg-white rounded-lg shadow-md">
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="p-6 max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-800">{initialSale ? 'Edit Sale' : 'Add New Sale'}</h2>
            <p className="text-gray-600 text-sm mt-1">Fill in the sale details</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="header" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="header" className="text-base py-3">Sale Details</TabsTrigger>
                <TabsTrigger value="parties" className="text-base py-3">Parties</TabsTrigger>
                <TabsTrigger value="items" className="text-base py-3">Items</TabsTrigger>
                <TabsTrigger value="summary" className="text-base py-3">Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="header" className="p-4 border rounded-lg">
                <SalesFormHeader
                  lotNumber={formState.lotNumber}
                  date={formState.date}
                  location={formState.location}
                  billNumber={formState.billNumber}
                  billAmount={formState.billAmount}
                  locations={locations}
                  onInputChange={handleInputChange}
                  onSelectChange={handleSelectChange}
                />
              </TabsContent>

              <TabsContent value="parties" className="p-4 border rounded-lg">
                <PartiesSection
                  customers={customers}
                  brokers={brokers}
                  transporters={transporters}
                  customerId={formState.customerId}
                  brokerId={formState.brokerId}
                  transporterId={formState.transporterId}
                  transportCost={formState.transportCost}
                  onSelectChange={handleSelectChange}
                  onInputChange={handleInputChange}
                />
              </TabsContent>

              <TabsContent value="items" className="p-4 border rounded-lg">
                <div className="overflow-x-auto">
                  <ItemsTable
                    items={formState.items}
                    onItemChange={handleItemChange}
                    onRemoveItem={handleRemoveItem}
                    onAddItem={handleAddItem}
                  />
                </div>
              </TabsContent>

              <TabsContent value="summary" className="p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      className="w-full p-3 rounded-md border text-base"
                      rows={4}
                      value={formState.notes}
                      onChange={(e) => handleInputChange(e)}
                      placeholder="Enter notes..."
                    />
                  </div>

                  <FormSummary
                    subtotal={calculateSubtotal()}
                    transportCost={parseFloat(formState.transportCost || '0')}
                    brokerageAmount={calculateBrokerageAmount()}
                    showBrokerage={!!selectedBroker}
                    total={calculateTotal()}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex flex-col sm:flex-row justify-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-8 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto text-base py-6">
                Cancel
              </Button>
              {initialSale && onPrint && (
                <Button type="button" variant="outline" onClick={onPrint} className="w-full sm:w-auto text-base py-6">
                  Print
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-base py-6">
                {isSubmitting ? 'Saving...' : initialSale ? 'Update Sale' : 'Save Sale'}
              </Button>
            </div>
          </form>
        </div>
      </ScrollArea>
    </div>
  );
};

export default MultiItemSalesForm;
