
import { useState } from "react";

export const useNewEntityStates = () => {
  const [newPartyName, setNewPartyName] = useState<string>("");
  const [newPartyAddress, setNewPartyAddress] = useState<string>("");
  const [newBrokerName, setNewBrokerName] = useState<string>("");
  const [newBrokerAddress, setNewBrokerAddress] = useState<string>("");
  const [newBrokerRate, setNewBrokerRate] = useState<number>(1);
  const [newTransporterName, setNewTransporterName] = useState<string>("");
  const [newTransporterAddress, setNewTransporterAddress] = useState<string>("");

  return {
    newPartyName,
    setNewPartyName,
    newPartyAddress,
    setNewPartyAddress,
    newBrokerName,
    setNewBrokerName,
    newBrokerAddress,
    setNewBrokerAddress,
    newBrokerRate,
    setNewBrokerRate,
    newTransporterName,
    setNewTransporterName,
    newTransporterAddress,
    setNewTransporterAddress,
  };
};
