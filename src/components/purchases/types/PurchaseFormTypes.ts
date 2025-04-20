
import { Agent, Purchase, Transporter } from "@/services/types";

export interface FormMethods {
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleItemChange: (index: number, field: string, value: any) => void;
  handleRemoveItem: (index: number) => void;
  handleAddItem: () => void;
  calculateSubtotal: () => number;
  calculateTotal: () => number;
}

export interface FormUtils {
  agents: Agent[];
  transporters: Transporter[];
  locations: string[];
  showAddAgentDialog: boolean;
  setShowAddAgentDialog: (show: boolean) => void;
  showAddTransporterDialog: boolean;
  setShowAddTransporterDialog: (show: boolean) => void;
  handleAgentAdded: (agent: Agent) => void;
  handleTransporterAdded: (transporter: Transporter) => void;
  handleBrokerageTypeChange: (type: string) => void;
  handleBrokerageRateChange: (value: number) => void;
}

