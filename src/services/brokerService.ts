
import { Broker } from './types';
import { getStorageItem, saveStorageItem } from './storageUtils';

export const getBrokers = (): Broker[] => {
  return getStorageItem<Broker>('brokers');
};

export const addBroker = (broker: Broker): void => {
  const brokers = getBrokers();
  brokers.push(broker);
  saveStorageItem('brokers', brokers);
};

export const updateBroker = (updatedBroker: Broker): void => {
  const brokers = getBrokers();
  const index = brokers.findIndex(broker => broker.id === updatedBroker.id);
  if (index !== -1) {
    brokers[index] = updatedBroker;
    saveStorageItem('brokers', brokers);
  }
};

export const deleteBroker = (id: string): void => {
  const brokers = getBrokers();
  const index = brokers.findIndex(broker => broker.id === id);
  if (index !== -1) {
    brokers.splice(index, 1);
    saveStorageItem('brokers', brokers);
  }
};
