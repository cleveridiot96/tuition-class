
import { Agent } from '../types';
import { getEntities, addEntity, updateEntity, deleteEntity } from '../utils/entityUtils';
import { saveStorageItem } from '../storageUtils';

const STORAGE_KEY = 'agents';

export const getAgents = (): Agent[] => {
  return getEntities<Agent>(STORAGE_KEY);
};

export const addAgent = (agent: Agent): void => {
  addEntity<Agent>(STORAGE_KEY, agent);
};

export const updateAgent = (updatedAgent: Agent): void => {
  updateEntity<Agent>(STORAGE_KEY, updatedAgent);
};

export const deleteAgent = (id: string): void => {
  deleteEntity<Agent>(STORAGE_KEY, id);
};

export const updateAgentBalance = (agentId: string, changeAmount: number): void => {
  const agents = getAgents();
  const agentIndex = agents.findIndex(agent => agent.id === agentId);
  
  if (agentIndex !== -1) {
    agents[agentIndex].balance = (agents[agentIndex].balance || 0) + changeAmount;
    saveStorageItem(STORAGE_KEY, agents);
  }
};

// For backward compatibility
export const getPurchaseAgents = getAgents;
