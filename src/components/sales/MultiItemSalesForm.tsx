
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Customer, Broker, Transporter, Sale } from '@/services/types';
import ItemsTable from '../shared/ItemsTable';
import FormSummary from '../shared/FormSummary';
import SalesFormHeader from './components/SalesFormHeader';
import PartiesSection from './components/PartiesSection';
import { useSalesForm } from './hooks/useSalesForm';

interface MultiItemSalesFormProps {
  onCancel: () => void;
  onSubmit: (sale: Sale) => void;
  initialSale?: Sale;
}

const MultiItemSalesForm: React.FC<MultiItemSalesFormProps> = ({
  onCancel,
  onSubmit,
  initialSale
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
    const mockGetLocations = () => ['Location A', 'Location B'];
    const mockGetCustomers = () => [
      { id: '1', name: 'Customer A', balance: 0 },
      { id: '2', name: 'Customer B', balance: 0 }
    ];
    const mockGetBrokers = () => [
      { id: '1', name: 'Broker A', commissionRate: 5, balance: 0 },
      { id: '2', name: 'Broker B', commissionRate: 10, balance: 0 }
    ];
    const mockGetTransporters = () => [
      { id: '1', name: 'Transporter A', balance: 0 },
      { id: '2', name: 'Transporter B', balance: 0 }
    ];

    setLocations(mockGetLocations());
    setCustomers(mockGetCustomers());
    setBrokers(mockGetBrokers());
    setTransporters(mockGetTransporters());
  }, []);

  useEffect(() => {
    if (formState.brokerId) {
      const broker = brokers.find(broker => broker.id === formState.brokerId);
      setSelectedBroker(broker || null);
    }
  }, [formState.brokerId, brokers]);

  return (
    <div className="w-full max-w-full px-2 sm:px-4 md:px-6 mx-auto overflow-x-hidden">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        <SalesFormHeader
          lotNumber={formState.lotNumber}
          date={formState.date}
          location={formState.location}
          locations={locations}
          onInputChange={handleInputChange}
          onSelectChange={handleSelectChange}
        />

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

        <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
          <ItemsTable
            items={formState.items}
            onItemChange={handleItemChange}
            onRemoveItem={handleRemoveItem}
            onAddItem={handleAddItem}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <textarea
              id="notes"
              name="notes"
              className="w-full p-2 rounded-md border"
              rows={3}
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

        <div className="flex flex-col sm:flex-row justify-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-6">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? 'Saving...' : initialSale ? 'Update Sale' : 'Save Sale'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MultiItemSalesForm;
