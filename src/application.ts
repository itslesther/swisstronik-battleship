/* eslint-disable @typescript-eslint/no-explicit-any */
import BattleshipAbi from "./utils/Battleship.abi";
import { Web3, Contract, Web3BaseWalletAccount } from "web3";
import { RegisteredSubscription } from "web3-eth";
import { Store } from "./data/store";
// import { Game } from "./data/models/games";
import { contractQueries } from "./contractInteraction";
import { ethers } from "ethers";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const NODE_HTTP_URL = import.meta.env.VITE_NODE_HTTP_URL as string;

type ContractEvent =
  | "GameCreated"
  | "GameJoined"
  | "Attack"
  | "AttackResult"
  | "GameFinished";

export default class Application {
  web3: Web3<RegisteredSubscription>;
  dispatch: Store["dispatch"];
  account: Web3BaseWalletAccount | null;
  accountIndex: number;
  contract!: Contract<typeof BattleshipAbi>;
  providerParam: "metamask" | "raw-keys";

  constructor(
    web3: Web3<RegisteredSubscription>,
    store: Store,
    accountIndex: number,
    providerParam: "metamask" | "raw-keys"
  ) {
    this.web3 = web3;
    this.dispatch = store.dispatch;
    this.account = null;
    this.accountIndex = accountIndex;
    this.providerParam = providerParam;
  }

  async init() {
    if (this.providerParam === "metamask") {
      (window as any).ethereum.on("accountsChanged", async () => {
        window.location.reload();
        // await this.initAccount();
      });
      // (window as any).ethereum.on("chainChanged", () => {
      //   console.log("chainChanged");
      // });
    }

    await this.initAccount();
    await this.initContract();

    this.dispatch.eth.ready(this.web3);
  }

  async initContract() {
    const contract = new this.web3.eth.Contract(BattleshipAbi, contractAddress);

    this.contract = contract;
    this.dispatch.eth.setContract(this.contract);

    this.trackEvents();
  }

  formatEventValues(eventName: ContractEvent, data: any[]) {
    const returnValues = (
      (BattleshipAbi.find((x) => x.name === eventName) as any).inputs as any[]
    ).reduce((acc, input, index) => {
      acc[input.name] = data[index];
      return acc;
    }, {});

    return returnValues;
  }

  async trackEvents() {
    this.trackEvent("GameCreated");
    this.trackEvent("GameJoined");
    this.trackEvent("Attack");
    this.trackEvent("AttackResult");
    this.trackEvent("GameFinished");
  }

  trackEvent(eventName: ContractEvent) {
    this.registerEvent(eventName);
    this.getPastEvent(eventName);
  }

  async getPastEvent(eventName: ContractEvent) {
    let provider: any;

    if (this.providerParam === "metamask") {
      // provider = new ethers.providers.Web3Provider((window as any).ethereum);
      provider = new ethers.BrowserProvider((window as any).ethereum);

    } else {
    // provider = new ethers.providers.JsonRpcProvider(NODE_HTTP_URL);
    provider = new ethers.JsonRpcProvider(NODE_HTTP_URL);
    }
    const battleship = new ethers.Contract(
      contractAddress,
      BattleshipAbi,
      provider
    );

    const events = await battleship.queryFilter(eventName);

    events.forEach((event) => {
      console.log("Past Event:", eventName);
      const returnValues = this.formatEventValues(
        eventName,
        (event as any).args
      );
      // console.log("returnValues", returnValues);
      this[`on${eventName}`](returnValues);
    });
  }

  async registerEvent(eventName: ContractEvent) {
    let provider: any;

    // if (this.providerParam === "metamask") {
    //   // provider = new ethers.providers.Web3Provider((window as any).ethereum);
    //   provider = new ethers.BrowserProvider((window as any).ethereum);

    // } else {
    // provider = new ethers.providers.JsonRpcProvider(NODE_HTTP_URL);
    provider = new ethers.JsonRpcProvider(NODE_HTTP_URL);
    // }

    const battleship = new ethers.Contract(
      contractAddress,
      BattleshipAbi,
      provider
    );
    try {
      battleship.addListener(
        eventName,
        // { fromBlock: 'latest' },
        (...data: any[]) => {
          console.log("Event:", eventName);
          try {
            const returnValues = this.formatEventValues(eventName, data);

            // console.log("returnValues", returnValues);
            this[`on${eventName}`](returnValues);
          } catch (error) {
            console.error("error", eventName, error);
          }
        }
      );
    } catch (error) {
      console.error("error", eventName, error);
    }

    // const event = this.contract.events[eventName](filter);
    // event.on("data", (data) => {
    //   console.log("Event:", eventName);
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   this[`on${eventName}`](data.returnValues as any);
    // });
    // event.on("error", (err: Error) => {
    //   console.error("error", eventName, err);
    // });
  }

  async initAccount() {
    this.account = await this.getAccount();
    const balance = await this.getBalance(this.account.address);

    this.dispatch.eth.setAccount({ account: this.account, balance });
  }

  async getAccount() {
    try {
      if (this.providerParam === "metamask") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        const accounts = await this.web3.eth.getAccounts();

        if (!accounts.length) {
          alert(`
            No ETH account detected !
  
            - Is Metamask installed ?
            - Is Metamask configured to work with Ganache ?
          `);

          throw new Error("No accounts detected");
        }

        return {
          address: accounts[this.accountIndex],
        } as Web3BaseWalletAccount;
      } else {
        const PRIVATE_KEYS = (
          import.meta.env.VITE_ACCOUNT_PRIVATE_KEYS as string
        )
          .replace(/\s+/g, "")
          .split(",");

        PRIVATE_KEYS.forEach((privateKey) => {
          this.web3.eth.accounts.wallet.add(privateKey);
        });

        const accounts = this.web3.eth.accounts.wallet;

        if (!accounts.length) {
          alert(`
            No ETH account detected !
  
            - Is Metamask installed ?
            - Is Metamask configured to work with Ganache ?
          `);

          throw new Error("No accounts detected");
        }

        return accounts[this.accountIndex];
      }
    } catch (error) {
      console.error("Failed to get account", error);
      throw error;
    }
  }

  async getBalance(account: string) {
    const balance = await this.web3.eth.getBalance(account);
    return balance.toString();
  }

  // event GameCreated(uint gameId, address indexed owner, uint8 gridSize, uint bet);
  onGameCreated(result: {
    gameId: bigint;
    owner: string;
    gridSize: bigint;
    bet: bigint;
  }) {
    this.onEvent(result);
  }

  // event GameJoined(uint gameId, address indexed owner, address indexed challenger, uint bet);
  onGameJoined(result: {
    gameId: bigint;
    owner: string;
    challenger: string;
    bet: bigint;
  }) {
    // Only IF owner of the game
    if (
      this.account?.address === result.owner ||
      this.account?.address === result.challenger
    ) {
      this.onEvent(result);
    }
  }

  // event Attack(uint gameId, address indexed attacker, address indexed defender, uint index);
  onAttack(result: {
    gameId: bigint;
    attacker: string;
    defender: string;
    index: bigint;
  }) {
    // Only IF was NOT attacker
    if (this.account?.address === result.defender) {
      this.dispatch.games.defend({
        gameId: Number(result.gameId),
        index: Number(result.index),
      });
    }

    this.onEvent(result);
  }

  // event AttackResult(uint gameId, address indexed attacker, address indexed opponent, uint index, bool hit);
  onAttackResult(result: {
    gameId: bigint;
    attacker: string;
    opponent: string;
    index: bigint;
    hit: boolean;
  }) {
    // Only IF was attacker
    if (this.account?.address === result.attacker) {
      this.dispatch.games.setAttack({
        gameId: Number(result.gameId),
        index: Number(result.index),
        hit: result.hit,
      });
    }

    this.onEvent(result);
  }

  //event GameFinished(uint gameId, address indexed winner, address indexed opponent, bool void);
  onGameFinished(result: {
    gameId: bigint;
    winner: string;
    opponent: string;
    void: boolean;
  }) {
    if (
      this.account?.address === result.winner ||
      this.account?.address === result.opponent
    ) {
      this.onEvent(result);
    }
  }

  async onEvent(result: { gameId: bigint }) {
    const gameId = Number(result.gameId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const game = (await contractQueries.games(gameId)) as any;
    this.dispatch.games.updateGame({
      ...game,
      gameId,
    });
  }
}
