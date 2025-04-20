
import { Transporter } from '../types';
import { getEntities, addEntity, updateEntity, deleteEntity } from '../utils/entityUtils';

const STORAGE_KEY = 'transporters';

export const getTransporters = (): Transporter[] => {
  return getEntities<Transporter>(STORAGE_KEY);
};

export const addTransporter = (transporter: Transporter): void => {
  addEntity<Transporter>(STORAGE_KEY, transporter);
};

export const updateTransporter = (updatedTransporter: Transporter): void => {
  updateEntity<Transporter>(STORAGE_KEY, updatedTransporter);
};

export const deleteTransporter = (id: string): void => {
  deleteEntity<Transporter>(STORAGE_KEY, id);
};

