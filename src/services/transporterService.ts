
import { Transporter } from './types';

// Transporter functions
export const getTransporters = (): Transporter[] => {
  const transporters = localStorage.getItem('transporters');
  return transporters ? JSON.parse(transporters) : [];
};

export const addTransporter = (transporter: Transporter): void => {
  const transporters = getTransporters();
  transporters.push(transporter);
  localStorage.setItem('transporters', JSON.stringify(transporters));
};

export const updateTransporter = (updatedTransporter: Transporter): void => {
  const transporters = getTransporters();
  const index = transporters.findIndex(t => t.id === updatedTransporter.id);
  if (index !== -1) {
    transporters[index] = updatedTransporter;
    localStorage.setItem('transporters', JSON.stringify(transporters));
  }
};

export const deleteTransporter = (id: string): void => {
  const transporters = getTransporters();
  const updatedTransporters = transporters.filter(t => t.id !== id);
  localStorage.setItem('transporters', JSON.stringify(updatedTransporters));
};
