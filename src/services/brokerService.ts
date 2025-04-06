
import { Broker } from './types';

// Broker functions
export const getBrokers = (): Broker[] => {
  const brokers = localStorage.getItem('brokers');
  return brokers ? JSON.parse(brokers) : [];
};

export const addBroker = (broker: Broker): void => {
  const brokers = getBrokers();
  brokers.push(broker);
  localStorage.setItem('brokers', JSON.stringify(brokers));
};

export const updateBroker = (updatedBroker: Broker): void => {
  const brokers = getBrokers();
  const index = brokers.findIndex(b => b.id === updatedBroker.id);
  if (index !== -1) {
    brokers[index] = updatedBroker;
    localStorage.setItem('brokers', JSON.stringify(brokers));
  }
};

export const deleteBroker = (id: string): void => {
  const brokers = getBrokers();
  const updatedBrokers = brokers.filter(b => b.id !== id);
  localStorage.setItem('brokers', JSON.stringify(updatedBrokers));
};
