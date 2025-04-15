import { v4 as uuidv4 } from 'uuid';
import { getStorageItem, saveStorageItem } from './storageUtils';
import { Agent } from './types';

export function getAgents(): Agent[] {
  return getStorageItem('agents', []);
}

export const addAgent = (agent: Agent): void => {
  const agents = getAgents();
  agents.push(agent);
  saveStorageItem('agents', agents);
};

export const updateAgent = (updatedAgent: Agent): void => {
  const agents = getAgents();
  const index = agents.findIndex(agent => agent.id === updatedAgent.id);
  if (index !== -1) {
    agents[index] = updatedAgent;
    saveStorageItem('agents', agents);
  }
};

export const deleteAgent = (id: string): void => {
  const agents = getAgents();
  const index = agents.findIndex(agent => agent.id === id);
  if (index !== -1) {
    agents.splice(index, 1);
    saveStorageItem('agents', agents);
  }
};

export const updateAgentBalance = (id: string, amount: number, isCredit = false): void => {
  const agents = getAgents();
  const index = agents.findIndex(agent => agent.id === id);
  
  if (index !== -1) {
    if (isCredit) {
      agents[index].balance -= amount;
    } else {
      agents[index].balance += amount;
    }
    saveStorageItem('agents', agents);
  }
};
