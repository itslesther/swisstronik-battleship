/* eslint-disable @typescript-eslint/no-explicit-any */
// import Web3 from "web3";
import { sendShieldedQuery } from "./swisstronikUtils";
import BattleshipAbi from "../utils/Battleship.abi";
// import { ethers } from "ethers";
import Web3, { AbiInput } from "web3";

type ContractQueryMethods =
  | "games"
  | "getPlayerGames"
  | "getGameTarget"
  | "getGameOcean";

const contractCall = async (
  methodName: ContractQueryMethods,
  ...args: any[]
) => {
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const NODE_HTTP_URL = import.meta.env.VITE_NODE_HTTP_URL as string;

  const web3 = new Web3(NODE_HTTP_URL);
  const contract = new web3.eth.Contract(BattleshipAbi, contractAddress);
  const data = contract.methods[methodName](...args).encodeABI();

  console.log("query.methodName", methodName);
  const responseMessage = await sendShieldedQuery(contractAddress, data);

  return web3.eth.abi.decodeParameters(
    (BattleshipAbi.find((x) => x.name === methodName) as any)
      ?.outputs as AbiInput[],
    responseMessage
  );
};

export const games = async (gameId: number) => {
  return contractCall("games", gameId);
};

export const getPlayerGames = async (account: string) => {
  return (await contractCall("getPlayerGames", account))[0] as bigint[];
};

export const getGameTarget = async (gameId: number, account: string) => {
  return (await contractCall("getGameTarget", gameId, account))[0] as bigint[];
};

export const getGameOcean = async (gameId: number, account: string) => {
  return (await contractCall("getGameOcean", gameId, account))[0] as bigint[];
};
