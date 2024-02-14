/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  encryptDataField,
  decryptNodeResponse,
} from "@swisstronik/swisstronik.js";
// import {ethers} from "ethers";
import Web3, { Web3BaseWalletAccount } from "web3";
import qs from "qs";

const query = document.location.search.substring(1);
const params = qs.parse(query);

const IS_SWISSTRONIK_NETWORK =
  import.meta.env.VITE_IS_SWISSTRONIK_NETWORK === "TRUE";

const NODE_HTTP_URL = import.meta.env.VITE_NODE_HTTP_URL as string;

const providerParam = params.provider as "metamask" | "raw-keys";

const web3 = new Web3(
  providerParam === "metamask" ? (window as any).ethereum : NODE_HTTP_URL
);

// const provider = new ethers.JsonRpcProvider(NODE_HTTP_URL);

export const sendShieldedQuery = async (destination: string, data: string) => {
  let encryptedData: string;
  let usedEncryptionKey: Uint8Array;

  // Encrypt the call data using SwisstronikJS's encryption function
  if (IS_SWISSTRONIK_NETWORK) {
    [encryptedData, usedEncryptionKey] = await encryptDataField(
      NODE_HTTP_URL,
      data
    );
  }

  // Execute the query/call using the provider
  const response = await web3.eth.call({
    to: destination,
    data: IS_SWISSTRONIK_NETWORK ? encryptedData! : data,
  });

  // Decrypt the response using SwisstronikJS's decryption function
  if (IS_SWISSTRONIK_NETWORK) {
    const decryptedResponse = await decryptNodeResponse(
      NODE_HTTP_URL,
      response,
      usedEncryptionKey!
    );

    return "0x" + Buffer.from(decryptedResponse).toString("hex");
  }

  return response;
};

// Function to send a shielded transaction using the provided signer, destination, data, and value
export const sendShieldedTransaction = async (
  signer: Web3BaseWalletAccount,
  destination: string,
  data: string,
  value: string
) => {
  let encryptedData: string;

  // Encrypt transaction data
  if (IS_SWISSTRONIK_NETWORK) {
    [encryptedData] = await encryptDataField(NODE_HTTP_URL, data);
  }

  if (providerParam === "metamask") {
    return web3.eth.sendTransaction({
      from: signer.address,
      to: destination,
      value,
      data: IS_SWISSTRONIK_NETWORK ? encryptedData! : data,
    });
  }

  const gasPrice = await web3.eth.getGasPrice();

  const signed = await signer.signTransaction({
    from: signer.address,
    to: destination,
    value,
    data: IS_SWISSTRONIK_NETWORK ? encryptedData! : data,
    gasPrice,
  });

  return web3.eth.sendSignedTransaction(signed.rawTransaction);
};
