
import { Broker } from './types';
import { getStorageItem, saveStorageItem } from './storageUtils';

// Renamed from getBrokers to getSalesBrokers for clarity
export const getSalesBrokers = (): Broker[] => {
  return getStorageItem<Broker[]>('brokers') || [];
};

export const addBroker = (broker: Broker): void => {
  const brokers = getSalesBrokers();
  brokers.push(broker);
  saveStorageItem('brokers', brokers);
};

export const updateBroker = (updatedBroker: Broker): void => {
  const brokers = getSalesBrokers();
  const index = brokers.findIndex(broker => broker.id === updatedBroker.id);
  if (index !== -1) {
    brokers[index] = updatedBroker;
    saveStorageItem('brokers', brokers);
  }
};

export const deleteBroker = (id: string): void => {
  const brokers = getSalesBrokers();
  const index = brokers.findIndex(broker => broker.id === id);
  if (index !== -1) {
    brokers[index] = { ...brokers[index], isDeleted: true };
    saveStorageItem('brokers', brokers);
  }
};

export const updateBrokerBalance = (brokerId: string, changeAmount: number): void => {
  const brokers = getSalesBrokers();
  const brokerIndex = brokers.findIndex(broker => broker.id === brokerId);
  
  if (brokerIndex !== -1) {
    brokers[brokerIndex].balance = (brokers[brokerIndex].balance || 0) + changeAmount;
    saveStorageItem('brokers', brokers);
  }
};

// For backward compatibility
export const getBrokers = getSalesBrokers;
