import { v4 as uuidv4 } from 'uuid';
import { getStorageItem, saveStorageItem } from './storageUtils';
import { Broker } from './types';

export function getBrokers(): Broker[] {
  return getStorageItem('brokers', []);
}

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
