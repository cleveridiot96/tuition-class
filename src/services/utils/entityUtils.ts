
import { getStorageItem, saveStorageItem } from '../storageUtils';

export const getEntities = <T>(key: string): T[] => {
  return getStorageItem<T[]>(key) || [];
};

export const addEntity = <T extends { id: string }>(key: string, entity: T): void => {
  const entities = getEntities<T>(key);
  entities.push(entity);
  saveStorageItem(key, entities);
};

export const updateEntity = <T extends { id: string }>(key: string, updatedEntity: T): void => {
  const entities = getEntities<T>(key);
  const index = entities.findIndex(entity => entity.id === updatedEntity.id);
  if (index !== -1) {
    entities[index] = updatedEntity;
    saveStorageItem(key, entities);
  }
};

export const deleteEntity = <T extends { id: string; isDeleted?: boolean }>(key: string, id: string): void => {
  const entities = getEntities<T>(key);
  const index = entities.findIndex(entity => entity.id === id);
  if (index !== -1) {
    entities[index] = { ...entities[index], isDeleted: true };
    saveStorageItem(key, entities);
  }
};

