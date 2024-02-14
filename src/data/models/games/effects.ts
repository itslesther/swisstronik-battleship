/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Bs from "../../../utils/battleship";
import * as sel from "../../../data/selectors";
import { Dispatch, RootState } from "../../store";
import { Game } from ".";
import { NavigateFunction } from "react-router-dom";
import {
  contractMutations,
  contractQueries,
} from "../../../contractInteraction";
import BattleshipAbi from "../../../utils/Battleship.abi";
import qs from "qs";
const query = document.location.search.substring(1);
const params = qs.parse(query);
const accountIndex = Number(params.account);

export default (dispatch: Dispatch) => ({
  //
  // Create game
  async createGame(
    {
      gridSize,
      ships,
      navigate,
    }: { gridSize: number; ships: number[]; navigate: NavigateFunction },
    state: RootState
  ) {
    const { account, web3 } = state.eth;
    // const { account, contract, web3 } = state.eth;

    const [secret, salt] = Bs.obfuscate(web3!, ships);

    // "GameCreated" event
    // const tx = await contract?.methods.createGame(gridSize, secret).send({
    //   from: account!,
    // });

    const tx = await contractMutations.createGame(gridSize, secret!).send({
      signer: account!,
    });

    const args = web3?.eth.abi.decodeLog(
      (BattleshipAbi.find((x) => x.name === "GameCreated") as any).inputs,
      tx.logs[0].data as any,
      tx.logs[0].topics as any
    );

    // const args = tx?.events?.GameCreated.returnValues;

    const gameId = Number(args?.gameId);

    dispatch.ships.setShips({ gameId, ships, salt: salt! });

    navigate(`/games/${gameId}?account=${accountIndex}`);
  },

  //
  // Join game
  async joinGame(
    { gameId, ships }: { gameId: number; ships: number[] },
    state: RootState
  ) {
    const { account, web3 } = state.eth;
    // const { account, contract, web3 } = state.eth;

    const [secret, salt] = Bs.obfuscate(web3!, ships);

    // await contract?.methods.joinGame(gameId, secret).send({
    //   from: account!,
    // });

    await contractMutations.joinGame(gameId, secret!).send({
      signer: account!,
    });

    dispatch.ships.setShips({ gameId, ships, salt: salt! });
  },

  //
  // Get game
  async getGame(gameId: number, state: RootState) {
    const { account } = state.eth;
    // const { account, contract } = state.eth;
    const { byId: gamesById, targets } = state.games;

    const game = gamesById[gameId];

    let gridSize: number;

    if (!game) {
      // Game
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (await contractQueries.games(gameId)) as any;
      // const result = await contract?.methods.games(gameId).call();

      dispatch.games.updateGame({
        ...(result as Game),
        gameId,
      });

      gridSize = Number(result?.gridSize);
    } else {
      gridSize = Number(game.gridSize);
    }

    let target: number[];
    let ocean: number[];

    if (!targets[gameId]) {
      const [_target, _ocean] = await Promise.all([
        contractQueries.getGameTarget(gameId, account?.address as string),
        contractQueries.getGameOcean(gameId, account?.address as string),
        // contract?.methods.getGameTarget(gameId, account).call(),
        // contract?.methods.getGameOcean(gameId, account).call(),
      ]);

      // Target grid
      if (_target?.length) {
        target = _target.map((bigNum) => Number(bigNum));
      } else {
        target = Bs.createGrid(gridSize, true);
      }

      dispatch.games.setTarget({ gameId, grid: target });

      // Ocean grid
      if (_ocean?.length) {
        ocean = _ocean.map((bigNum) => Number(bigNum));
      } else {
        ocean = Bs.createGrid(gridSize, true);
      }

      dispatch.games.setOcean({ gameId, grid: ocean });
    }
  },

  defend(
    { gameId, index }: { gameId: number; index: number },
    state: RootState
  ) {
    const ships = state.ships.byGameId[gameId];

    if (ships) {
      dispatch.games.setDefense({ gameId, index, hit: ships[index] > 1 });
    }
  },

  //
  // Attack
  async attack(index: number, state: RootState) {
    dispatch.games.attacking(index);

    const game = sel.getGame(state);
    const { account } = state.eth;
    // const { account, contract } = state.eth;

    if (Number(game.status) > 1) {
      const defense = state.games.defenses[game.id!];
      const position = Bs.getPositionName(Number(game.gridSize), defense.index);

      let hit = defense.hit;

      // Cheat?
      if (hit) {
        const message = `
          You were HIT on ${position}
          (Press OK to accept, Cancel to cheat)
        `;

        if (!confirm(message)) {
          // Do cheat...
          hit = !hit;

          dispatch.games.setDefense({
            gameId: game.id!,
            index: Number(game.targetIndex),
            hit,
          });
        }
      }

      // contract?.methods
      //   .counterAttack(game.id, index, hit)
      //   .send({ from: account! });

      await contractMutations.counterAttack(game.id!, index, hit).send({
        signer: account!,
      });
    } else {
      // contract?.methods
      //   .attack(game.id, index)
      //   .send({ from: account! });

      await contractMutations.attack(game.id!, index).send({
        signer: account!,
      });
    }
  },
});
