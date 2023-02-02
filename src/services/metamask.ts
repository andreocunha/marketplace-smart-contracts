import { BigNumber, ethers } from "ethers";
import { Product_Contract_Factory_ABI, Product_Contract_Factory_Address } from "../config/productFactoryKeys";
import { Product_Contract_ABI, Product_Contract_Address } from "../config/productKeys";

export async function loginMetaMask() {
  if (window?.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "goerli");
    provider.send("eth_requestAccounts", []).then(() => {
      provider.listAccounts().then((accounts) => {
        const signer = provider.getSigner(accounts[0]);
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

export async function getContractProductInstance(contractAddress: string) {
  const provider = new ethers.providers.Web3Provider(window?.ethereum, "goerli");
  const account = await getMetaMaskAccount();
  const signer = provider.getSigner(account);
  return new ethers.Contract(
    contractAddress,
    Product_Contract_ABI,
    signer
  );
}

export async function getContractProductFactoryInstance() {
  const provider = new ethers.providers.Web3Provider(window?.ethereum, "goerli");
  const account = await getMetaMaskAccount();
  const signer = provider.getSigner(account);
  return new ethers.Contract(
    Product_Contract_Factory_Address,
    Product_Contract_Factory_ABI,
    signer
  );
}

export async function getProductInfoByAddress(contractAddress: string) {
  const contract = await getContractProductFactoryInstance();
  const product = await contract.getProduct(contractAddress);
  return {
    name: product[0],
    description: product[1],
    price: BigNumber.from(product[2]).toString(),
    imageUrl: product[3],
    seller_address: product[4],
    buyer_address: product[5],
    isSold: product[6],
    address: contractAddress,
  }
}