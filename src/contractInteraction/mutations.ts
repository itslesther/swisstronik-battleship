import { sendShieldedTransaction } from "./swisstronikUtils";
import BattleshipAbi from "../utils/Battleship.abi";
import Web3, { Web3BaseWalletAccount } from "web3";

type ContractMutationMethods =
  | "createGame"
  | "joinGame"
  | "counterAttack"
  | "attack";

type TransactionParams = {
  signer: Web3BaseWalletAccount;
  value?: string;
};

const NODE_HTTP_URL = import.meta.env.VITE_NODE_HTTP_URL as string;
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const contractMutation = async (
  methodName: ContractMutationMethods,
  params: TransactionParams,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => {

  const web3 = new Web3(NODE_HTTP_URL);
  const contract = new web3.eth.Contract(BattleshipAbi, CONTRACT_ADDRESS);
  const data = contract.methods[methodName](...args).encodeABI();

  console.log("mutation.methodName", methodName);

  return sendShieldedTransaction(
    params.signer,
    CONTRACT_ADDRESS,
    data,
    params.value || "0"
  );
};

export const createGame = (gridSize: number, secret: string) => {
  return {
    send: async (params: TransactionParams) => {
      return contractMutation("createGame", params, gridSize, secret);
    },
  };
};

export const joinGame = (gameId: number, secret: string) => {
  return {
    send: async (params: TransactionParams) => {
      return contractMutation("joinGame", params, gameId, secret);
    },
  };
};

export const attack = (gameId: number, index: number) => {
  return {
    send: async (params: TransactionParams) => {
      return contractMutation("attack", params, gameId, index);
    },
  };
};

export const counterAttack = (gameId: number, index: number, hit: boolean) => {
  return {
    send: async (params: TransactionParams) => {
      return contractMutation("counterAttack", params, gameId, index, hit);
    },
  };
};
