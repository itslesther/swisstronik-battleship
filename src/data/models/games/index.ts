import reducers from "./reducers";
import effects from "./effects";
import { createModel } from "@rematch/core";
import { RootModel } from "..";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type GameState = {
  active: number | null;
  all: number[];
  byId: Record<number, Game>;
  targets: Record<number, number[]>;

  oceans: Record<number, number[]>;
  attacks: Record<number, { index: number; result: number }[]>;
  defenses: Record<number, { index: number; hit: boolean }>;
  [key: string]: any;
};

enum GameStatus {
  OPEN,
  READY,
  STARTED,
  FINISHED,
  DONE,
}

export type Game = {
  id?: number;
  status: GameStatus;
  gridSize: bigint | number;
  targetIndex: bigint | number;
  owner: string;
  challenger: string;
  turn: string;
  winner: string;
  funds: bigint | number;
  gameId?: number;
};

const initialState = {
  active: null,
  all: [],
  byId: {},
  targets: {},
  oceans: {},
  attacks: {},
  defenses: {},
} as GameState;

export default createModel<RootModel>()({
  state: initialState,
  reducers,
  effects,
});
