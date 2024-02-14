import { createModel } from "@rematch/core";
import { RootModel } from ".";

export type ShipsState = {
  salts: Record<number, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  byGameId: Record<number, number[]>;
};

const initialState = {
  salts: {},
  byGameId: {},
} as ShipsState;

// const effects = dispatch => ({});

export default createModel<RootModel>()({
  state: initialState,
  reducers: {
    setShips(
      state,
      { gameId, ships, salt }: { gameId: number; ships: number[]; salt: string }
    ) {
      return {
        ...state,
        salts: {
          ...state.salts,
          [gameId]: salt,
        },
        byGameId: {
          ...state.byGameId,
          [gameId]: ships,
        },
      };
    },
  },
});
