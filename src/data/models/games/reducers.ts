import _uniq from "lodash/uniq";
import _assign from "lodash/assign";
import { _replaceAt, _push } from "../../../utils/immutable";
import { Game, GameState } from ".";

export default {
  attacking(state: GameState, index: number) {
    const gameId = state.active as number;
    const grid = _replaceAt(state.targets[gameId], index, "?" as const);

    return _setGrid("targets", state, gameId, grid);
  },

  setAttack(
    state: GameState,
    { gameId, index, hit }: { gameId: number; index: number; hit: boolean }
  ) {
    const attacks = state.attacks[gameId] || [];

    return {
      ...state,
      attacks: {
        ...state.attacks,
        [gameId]: _push(attacks, { index, result: hit ? 1 : -1 }),
      },
    };
  },

  "games/createGame": (state: GameState) => ({
    ...state,
    active: null,
  }),

  "games/getGame": (state: GameState, gameId: number) => ({
    ...state,
    active: gameId,
  }),

  updateGame(state: GameState, result: Game) {
    const game = _mapGame(result);
    // const game = Array.isArray(result) ? _arrGame(result) : _mapGame(result);
    const oldGame = state.byId[game.id];
    const all = _push(state.all, game.id);

    return {
      ...state,
      all: _uniq(all),
      byId: {
        ...state.byId,
        [game.id]: _assign({}, oldGame, game),
      },
    };
  },

  setOcean(
    state: GameState,
    { gameId, grid }: { gameId: number; grid: number[] }
  ) {
    return _setGrid("oceans", state, gameId, grid);
  },

  setTarget(
    state: GameState,
    { gameId, grid }: { gameId: number; grid: number[] }
  ) {
    return _setGrid("targets", state, gameId, grid);
  },

  setDefense(
    state: GameState,
    { gameId, index, hit }: { gameId: number; index: number; hit: boolean }
  ) {
    const newState = {
      ...state,
      defenses: {
        ...state.defenses,
        [gameId]: { index, hit },
      },
    };

    const ocean = state.oceans[gameId];

    if (ocean) {
      const grid = _replaceAt(ocean, index, hit ? 1 : -1);

      return _setGrid("oceans", newState, gameId, grid as unknown as number[]);
    }

    return newState;
  },
};

// Local helpers
function _mapGame(result: Game) {
  return {
    id: Number(result.gameId),
    status: Number(result.status),
    gridSize: Number(result.gridSize),
    targetIndex: Number(result.targetIndex),
    // id: result.gameId.toNumber ? result.gameId.toNumber() : result.gameId,
    // status: result.status.toNumber(),
    // gridSize: result.gridSize.toNumber(),
    // targetIndex: result.targetIndex.toNumber(),
    owner: result.owner,
    challenger: result.challenger,
    turn: result.turn,
  };
}

// function _arrGame(result) {
//   const [gameId, status, gridSize, targetIndex, owner, challenger, turn] =
//     result;

//   return _mapGame({
//     gameId,
//     status,
//     gridSize,
//     targetIndex,
//     owner,
//     challenger,
//     turn,
//   });
// }

function _setGrid(
  type: 'targets' | 'oceans',
  state: GameState,
  gameId: number,
  grid: (number | string)[]
) {
  return {
    ...state,
    [type]: { ...state[type], [gameId]: grid },
  };
}
