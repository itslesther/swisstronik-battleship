import Web3 from "web3";

const NODE_HTTP_URL = import.meta.env.VITE_NODE_HTTP_URL as string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function createWeb3() {
  return new Web3(NODE_HTTP_URL);
}
