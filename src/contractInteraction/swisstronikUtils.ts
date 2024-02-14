import {
  encryptDataField,
  decryptNodeResponse,
} from "@swisstronik/swisstronik.js";
// import { Web3 } from "web3";
// import { RegisteredSubscription } from "web3-eth";
// import {ethers} from "ethers";
import Web3, { Web3BaseWalletAccount } from "web3";

export const sendShieldedQuery = async (
  // web3: Web3<RegisteredSubscription>,
  destination: string,
  data: string
) => {
  const NODE_HTTP_URL = import.meta.env.VITE_NODE_HTTP_URL as string;

  // Obtain the RPC link from the network configuration

  // Encrypt the call data using SwisstronikJS's encryption function
  const [encryptedData, usedEncryptionKey] = await encryptDataField(
    NODE_HTTP_URL,
    data
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  // Execute the query/call using the provider
  const web3 = new Web3(NODE_HTTP_URL);
  const response = await web3.eth.call({
    to: destination,
    // data,
    data: encryptedData,
  });

  // const provider = new ethers.JsonRpcProvider(NODE_HTTP_URL);

  // const response = await provider.call({
  //   to: destination,
  //   data
  //   // data: encryptedData,
  // });

  // return response;
  // Decrypt the response using SwisstronikJS's decryption function
  const decryptedResponse = await decryptNodeResponse(
    NODE_HTTP_URL,
    response,
    usedEncryptionKey
  );

  return "0x" + Buffer.from(decryptedResponse).toString("hex");
};

// Function to send a shielded transaction using the provided signer, destination, data, and value
export const sendShieldedTransaction = async (
  // signer,
  signer: Web3BaseWalletAccount,
  destination: string,
  data: string,
  value: string
) => {
  const NODE_HTTP_URL = import.meta.env.VITE_NODE_HTTP_URL as string;

  // Execute the query/call using the provider
  const web3 = new Web3(NODE_HTTP_URL);

  // Get the RPC link from the network configuration

  // Encrypt transaction data
  const [encryptedData] = await encryptDataField(NODE_HTTP_URL, data);

  // Construct and sign transaction with encrypted data
  // return await signer.sendTransaction({
  //   from: signer.address,
  //   to: destination,
  //   data
  //   // data: encryptedData,
  //   value,
  // });

  const signed = await signer.signTransaction({
    from: signer.address,
    to: destination,
    // data,
    value,
    data: encryptedData,
    gas: "1000000",
    gasPrice: "10000000000",
  });

  return web3.eth.sendSignedTransaction(signed.rawTransaction);

  //   return web3.eth.sendTransaction({
  //     from,
  //     to: destination,
  //     // data,
  //     value,
  //     data: encryptedData,
  //   });
};
