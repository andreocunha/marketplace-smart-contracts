import { ethers } from "ethers";
import { Turing_Dapp_Contract_Address, Turing_Dapp_Contract_ABI } from "../config/keys";

export async function loginMetaMask(setConnectedAddress: any, setContractInstance: any) {
  /* 1. Enable ethereum connection */
  /* 3. Prompt user to sign in to MetaMask */
  const provider = new ethers.providers.Web3Provider(window.ethereum, "goerli");
  provider.send("eth_requestAccounts", []).then(() => {
    provider.listAccounts().then((accounts) => {
      const signer = provider.getSigner(accounts[0]);
      console.log(signer._address)
      setConnectedAddress(signer._address)

      /* 3.1 Criação da instância do contrato inteligente */
      const newTuringDappContract = new ethers.Contract(
        Turing_Dapp_Contract_Address, 
        Turing_Dapp_Contract_ABI, 
        signer
      )
      setContractInstance(newTuringDappContract)
      // console.log(newTuringDappContract)
      // console.log(newTuringDappContract.signer)
    });
  });
}

export async function isMetaMaskConnected() {
  return (window as any).ethereum.isConnected();
}

export async function getMetaMaskAccount() {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "goerli");
  // return the first account, if has
  return provider.listAccounts().then((accounts) => {
    return accounts[0];
  });
}

export async function getMetaMaskContract(account: string) {
  const provider = new ethers.providers.Web3Provider(window?.ethereum, "goerli");
  const signer = provider.getSigner(account);
  return new ethers.Contract(
    Turing_Dapp_Contract_Address,
    Turing_Dapp_Contract_ABI,
    signer
  );
}

export async function getMetaMaskInfo() {
  const account = await getMetaMaskAccount();
  const contract = await getMetaMaskContract(account);
  return { account, contract };
}