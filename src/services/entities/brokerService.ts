
import { Broker } from '../types';
import { getEntities, addEntity, updateEntity, deleteEntity } from '../utils/entityUtils';

const STORAGE_KEY = 'brokers';

export const getBrokers = (): Broker[] => {
  return getEntities<Broker>(STORAGE_KEY);
};

export const addBroker = (broker: Broker): void => {
  addEntity<Broker>(STORAGE_KEY, broker);
};

export const updateBroker = (updatedBroker: Broker): void => {
  updateEntity<Broker>(STORAGE_KEY, updatedBroker);
};

export const deleteBroker = (id: string): void => {
  deleteEntity<Broker>(STORAGE_KEY, id);
};

// For backward compatibility
export const getSalesBrokers = getBrokers;

