// import { _unshift } from "../../utils/immutable";
import { Web3, Contract, Web3BaseWalletAccount } from "web3";
import { RegisteredSubscription } from "web3-eth";
import BattleshipAbi from "../../utils/Battleship.abi";
import { createModel } from "@rematch/core";
import type { RootModel } from ".";
import { contractQueries } from "../../contractInteraction";

export type EthState = {
  ready: boolean;
  account: Web3BaseWalletAccount | null;
  balance: string | null;
  contract: Contract<typeof BattleshipAbi> | null;
  web3: Web3<RegisteredSubscription> | null;
};

const initialState: EthState = {
  ready: false,
  account: null,
  balance: null,
  contract: null,
  web3: null,
};

export default createModel<RootModel>()({
  state: initialState,
  reducers: {
    setWeb3: (state, web3: EthState["web3"]) =>
      ({
        ...state,
        web3,
        ready: true,
      } as EthState),

    setAccount: (
      state,
      { account, balance }: Pick<EthState, "account" | "balance">
    ) =>
      ({
        ...state,
        account,
        balance,
      } as EthState),

    setContract: (state, contract: EthState["contract"]) => ({
      ...state,
      contract,
    }),
  },
  effects: (dispatch) => ({
    async ready(web3: EthState["web3"], state) {
      dispatch.eth.setWeb3(web3);

      const { account } = state.eth;
      // const { contract, account } = state.eth;

      const gameIds = await contractQueries.getPlayerGames(account?.address as string);

      gameIds?.map((bigId) => {
        const gameId = Number(bigId);

        return contractQueries.games(gameId)
          .then(
            (result) =>
              dispatch.games.updateGame({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(result as any),
                gameId,
              })
          );
      });
    },
  }),
});
