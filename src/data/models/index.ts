import { Models } from "@rematch/core";
import eth from "./eth";
import games from "./games";
import ships from "./ships";

export default {
  eth,
  games,
  ships
};

export interface RootModel extends Models<RootModel> {
  eth: typeof eth;
  games: typeof games;
  ships: typeof ships;
}
