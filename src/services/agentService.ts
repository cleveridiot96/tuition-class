
import { Agent } from './types';
import { getStorageItem, saveStorageItem } from './storageUtils';

export const getAgents = (): Agent[] => {
  return getStorageItem<Agent[]>('agents') || [];
};

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
    agents[index] = { ...agents[index], isDeleted: true };
    saveStorageItem('agents', agents);
  }
};

export const updateAgentBalance = (agentId: string, changeAmount: number): void => {
  const agents = getAgents();
  const agentIndex = agents.findIndex(agent => agent.id === agentId);
  
  if (agentIndex !== -1) {
    agents[agentIndex].balance = (agents[agentIndex].balance || 0) + changeAmount;
    saveStorageItem('agents', agents);
  }
};
