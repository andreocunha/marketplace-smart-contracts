import React, { createContext, useState } from "react";

interface MetaMaskContextData {
  connectedAddress: string | null;
  contractInstance: any | null;
  setConnectedAddress: (connectedAddress: string | null) => void;
  setContractInstance: (contractInstance: any | null) => void;
}

const initialState: MetaMaskContextData = {
  connectedAddress: null,
  contractInstance: null,
  setConnectedAddress: () => {},
  setContractInstance: () => {},
};

const MetaMaskContext = createContext<MetaMaskContextData>(initialState);

const MetaMaskProvider: React.FC = ({ children } : any) => {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [contractInstance, setContractInstance] = useState<any | null>(null);

  const value = { connectedAddress, contractInstance, setConnectedAddress, setContractInstance };

  return <MetaMaskContext.Provider value={value}>{children}</MetaMaskContext.Provider>;
};

export { MetaMaskContext, MetaMaskProvider };
