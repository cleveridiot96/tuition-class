
import { Agent } from './types';

// Agent functions
export const getAgents = (): Agent[] => {
  const agents = localStorage.getItem('agents');
  return agents ? JSON.parse(agents) : [];
};

export const addAgent = (agent: Agent): void => {
  const agents = getAgents();
  agents.push(agent);
  localStorage.setItem('agents', JSON.stringify(agents));
};

export const updateAgent = (updatedAgent: Agent): void => {
  const agents = getAgents();
  const index = agents.findIndex(a => a.id === updatedAgent.id);
  if (index !== -1) {
    agents[index] = updatedAgent;
    localStorage.setItem('agents', JSON.stringify(agents));
  }
};

export const deleteAgent = (id: string): void => {
  const agents = getAgents();
  const updatedAgents = agents.filter(a => a.id !== id);
  localStorage.setItem('agents', JSON.stringify(updatedAgents));
};

export const updateAgentBalance = (id: string, amount: number): void => {
  const agents = getAgents();
  const agent = agents.find(a => a.id === id);
  if (agent) {
    agent.balance += amount;
    localStorage.setItem('agents', JSON.stringify(agents));
  }
};
