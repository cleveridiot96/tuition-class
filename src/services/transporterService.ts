
import { Transporter } from './types';
import { getStorageItem, saveStorageItem } from './storageUtils';

export const getTransporters = (): Transporter[] => {
  return getStorageItem<Transporter>('transporters');
};

export const addTransporter = (transporter: Transporter): void => {
  const transporters = getTransporters();
  transporters.push(transporter);
  saveStorageItem('transporters', transporters);
};

export const updateTransporter = (updatedTransporter: Transporter): void => {
  const transporters = getTransporters();
  const index = transporters.findIndex(transporter => transporter.id === updatedTransporter.id);
  if (index !== -1) {
    transporters[index] = updatedTransporter;
    saveStorageItem('transporters', transporters);
  }
};

export const deleteTransporter = (id: string): void => {
  const transporters = getTransporters();
  const index = transporters.findIndex(transporter => transporter.id === id);
  if (index !== -1) {
    transporters.splice(index, 1);
    saveStorageItem('transporters', transporters);
  }
};
