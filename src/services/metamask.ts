import { ethers } from "ethers";
import { Product_Contract_Factory_ABI, Product_Contract_Factory_Address } from "../config/productFactoryKeys";
import { Product_Contract_ABI, Product_Contract_Address } from "../config/productKeys";

export async function loginMetaMask() {
  if (window?.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "goerli");
    provider.send("eth_requestAccounts", []).then(() => {
      provider.listAccounts().then((accounts) => {
        const signer = provider.getSigner(accounts[0]);
        console.log(signer._address);
        
        window.location.reload();
      });
    });
  }
}

export async function isMetaMaskConnected() {
  if (window?.ethereum) {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    if (accounts.length > 0) {
      return true;
    }
  }
  return false;
}

export async function getMetaMaskAccount() {
  const provider = new ethers.providers.Web3Provider(window?.ethereum, "goerli");
  // return the first account, if has
  return provider.listAccounts().then((accounts) => {
    if (accounts.length === 0) {
      loginMetaMask();
    }
    return accounts[0];
  });
}

export async function getMetaMaskContract(account: string) {
  const provider = new ethers.providers.Web3Provider(window?.ethereum, "goerli");
  const signer = provider.getSigner(account);
  return new ethers.Contract(
    Product_Contract_Factory_Address,
    Product_Contract_Factory_ABI,
    signer
  );
}

export async function getMetaMaskProductContract(account: string) {
  const provider = new ethers.providers.Web3Provider(window?.ethereum, "goerli");
  const signer = provider.getSigner(account);
  return new ethers.Contract(
    Product_Contract_Address,
    Product_Contract_ABI,
    signer
  );
}

export async function getMetaMaskInfo() {
  const account = await getMetaMaskAccount();
  const contract = await getMetaMaskContract(account);
  return { account, contract };
}

export async function listenToEvent(contractInstance: { once: (arg0: any, arg1: { filter: any; }, arg2: (error: any, event: any) => void) => void; }, eventName: any, filterOptions: any) {
  return new Promise((resolve, reject) => {
    contractInstance.once(eventName, { filter: filterOptions }, (error, event) => {
      if (!error) {
        resolve(event)
      } else {
        reject(error)
      }
    })
  })
}
