/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
require("@nomicfoundation/hardhat-toolbox");
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const dotenv = require("dotenv");
dotenv.config();

const PRIVATE_KEYS = process.env.VITE_ACCOUNT_PRIVATE_KEYS.replace(/\s+/g, "").split(
  ","
);
/** @type import('hardhat/config').HardhatUserConfig */
// eslint-disable-next-line no-undef
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.4.22",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.4.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://json-rpc.testnet.swisstronik.com",
        enabled: true,
      },
      accounts: PRIVATE_KEYS.map((key) => ({
        privateKey: key,
        balance: "1000000000000000000000",
      })),
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: PRIVATE_KEYS,
    },
    swisstronikTestnet: {
      url: "https://json-rpc.testnet.swisstronik.com",
      accounts: PRIVATE_KEYS,
    },
  },
};
