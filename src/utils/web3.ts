import Web3 from "web3";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function createWeb3(provider: any) {
  return new Web3(provider);
}
