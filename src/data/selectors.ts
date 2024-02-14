import { createSelector } from "reselect";
import _orderBy from "lodash/orderBy";
//
import * as Bs from "../utils/battleship";
import { _replaceAt } from "../utils/immutable";
import { RootState } from "./store";

const gamesById = (state: RootState) => state.games.byId;
const gamesAll = (state: RootState) => state.games.all;
const gamesActive = (state: RootState) => state.games.active;
const gamesTargets = (state: RootState) => state.games.targets;
const gamesOceans = (state: RootState) => state.games.oceans;
const gamesAttacks = (state: RootState) => state.games.attacks;
const ethAccount = (state: RootState) => state.eth.account;
const shipsByGameId = (state: RootState) => state.ships.byGameId;

export const getGame = createSelector(
  [gamesById, gamesActive],
  (games, gameId) => games[gameId!]
);

export const getGameShips = createSelector(
  [shipsByGameId, gamesActive],
  (ships, gameId) => ships[gameId!]
);

export const getGameTarget = createSelector(
  [gamesTargets, getGame, gamesAttacks, ethAccount],
  (targets, game, attacks, account) => {
    if (!game) {
      return undefined;
    }

    let target = targets[Number(game.id)] as (number | "?")[];

    if (!target) {
      return undefined;
    }

    if (game.turn !== account?.address && Number(game.status) > 1) {
      target = _replaceAt(target, Number(game.targetIndex), "?" as const);
    }

    for (const attack of attacks[Number(game.id)] || []) {
      target = _replaceAt(target, Number(attack.index), attack.result);
    }

    return target;
  }
);

export const getGameOcean = createSelector(
  [gamesOceans, gamesActive],
  (oceans, gameId) => oceans[gameId!]
);

export const getGames = createSelector([gamesById, gamesAll], (games, all) =>
  all.map((id) => games[id])
);

export const getMyGames = createSelector(
  [getGames, ethAccount],
  (games, account) =>
    _orderBy(
      games.filter(
        (game) => game.owner === account?.address || game.challenger === account?.address
      ),
      ["id"],
      ["desc"]
    )
);

export const getOpenGames = createSelector(
  [getGames, ethAccount],
  (games, account) =>
    _orderBy(
      games.filter(
        (game) => game.owner !== account?.address && Number(game.status) === 0
      ),
      ["id"],
      ["desc"]
    )
);

//
//
// -
const size = (state: RootState) => state.games.gridSize;
const ships = (state: RootState) => state.games.ships;
const target = (state: RootState) => state.games.target;
const ocean = (state: RootState) => state.games.ocean;
const targetIndex = (state: RootState) => state.games.targetIndex;
const oceanIndex = (state: RootState) => state.games.oceanIndex;

export const isStarted = createSelector([target], (grid: number[]) =>
  grid.some((val) => val !== 0)
);

export const isPending = createSelector(
  [isStarted, targetIndex],
  (started, index) => started && index !== null
);

export const isTargetHit = createSelector(
  [target, targetIndex],
  (grid, index) => Bs.isHit(grid[index])
);

export const isTargetMiss = createSelector(
  [target, targetIndex],
  (grid, index) => Bs.isMiss(grid[index])
);

export const getTargetPosition = createSelector(
  [size, targetIndex],
  (size, index) => (index !== null ? Bs.getPositionName(size, index) : null)
);

export const getOceanPosition = createSelector(
  [size, oceanIndex],
  (size, index) => (index !== null ? Bs.getPositionName(size, index) : null)
);

export const isOceanHit = createSelector([ships, oceanIndex], (grid, index) =>
  Bs.isShip(grid[index])
);

const targetHits = createSelector([target], (grid) => Bs.countHits(grid));

const oceanHits = createSelector([ocean], (grid) => Bs.countHits(grid));

export const isTargetWin = createSelector([size, targetHits], (size, hits) =>
  Bs.isWin(size, hits)
);

export const isOceanWin = createSelector([size, oceanHits], (size, hits) =>
  Bs.isWin(size, hits)
);
