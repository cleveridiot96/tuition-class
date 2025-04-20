
import { Agent, Transporter, Purchase } from "@/services/types";

export interface PurchaseFormState {
  lotNumber: string;
  date: string;
  location: string;
  agentId: string;
  transporterId: string;
  transportCost: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    rate: number;
  }[];
  notes: string;
  expenses: number;
  totalAfterExpenses: number;
}

export interface FormHeaderProps {
  lotNumber: string;
  date: string;
  location: string;
  locations: string[];
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

export interface AgentSectionProps {
  agents: Agent[];
  agentId: string;
  onSelectChange: (name: string, value: string) => void;
  onAddAgentClick: () => void;
  showAddAgentDialog: boolean;
  setShowAddAgentDialog: (show: boolean) => void;
  onAgentAdded: (agent: Agent) => void;
}

export interface TransportSectionProps {
  transporters: Transporter[];
  transporterId: string;
  transportCost: string;
  onSelectChange: (name: string, value: string) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddTransporterClick: () => void;
  showAddTransporterDialog: boolean;
  setShowAddTransporterDialog: (show: boolean) => void;
  onTransporterAdded: (transporter: Transporter) => void;
}
