/* eslint-disable react-refresh/only-export-components */
import React, { useEffect } from "react";
import { connect } from "react-redux";
//
import * as Bs from "../utils/battleship";
import * as sel from "../data/selectors";
import Layout from "./layout";
import Grid from "../components/grid";
import Alert from "../components/alert";
import { Dispatch, RootState } from "../data/store";
import { useNavigate } from "react-router-dom";

function GameShow(props: Props) {
  const navigate = useNavigate();

  const [stateShips, setStateShips] = React.useState([] as number[]);

  useEffect(() => {
    const { game } = props;

    const gameId = window.location.pathname.replace("/games/", "");

    if (!game) {
      props.getGame(parseInt(gameId, 10));
    }
  }, [props]);

  const _joinGame = () => {
    const { game } = props;

    props.joinGame({ gameId: game.id!, ships: stateShips });
  };

  const _randomize = () => {
    const { game } = props;

    setStateShips(Bs.createGrid(Number(game.gridSize) ));

  };

  const renderLoading = () => {
    return (
      <Layout navigate={navigate}>
        <p>Loading game...</p>
      </Layout>
    );
  };

  function getShips() {
    if (stateShips.length) {
      return stateShips;
    }

    return props.ships || [];
  }

  const { account, game, target, ocean, attack} = props;
  
  if (!game) {
    return renderLoading();
  }

  const ships = getShips();
  const status = Bs.getStatus(Number(game.status));

  const open = Number(game.status) === 0;
  const finished = Number(game.status) === 3;
  const playable = Number(game.status) > 0;
  const owned = game.owner === account?.address;
  const myTurn = game.turn === account?.address;

  const joinable = !owned && open;

  let help = null;

  if (playable && !finished) {
    if (myTurn) {
      help = <Alert success>Your turn!</Alert>;
    } else {
      help = <Alert info>Not your turn</Alert>;
    }
  } else if (owned && open) {
    help = <Alert info>Nobody joined your game yet</Alert>;
  } else if (finished) {
    help = <Alert info>TODO: Reveal</Alert>;
  }

  return (
    <Layout navigate={navigate}>
      <h1>
        Game #{game.id}
        <span className={`label label--${status}`}>{status}</span>
      </h1>
      <pre className="u-mb">{owned ? game.challenger : game.owner}</pre>
      {playable && (
        <Grid
          className="u-mb-small"
          size={game.gridSize as number}
          mod="target"
          positions={target}
          onAttack={attack}
          disabled={!myTurn || finished}
        />
      )}
      <Grid
        className="u-mb"
        size={game.gridSize as number}
        mod="ocean"
        positions={ocean}
        ships={ships}
      />
      {joinable && (
        <div className="u-mb">
          <p>
            <a onClick={_randomize} className="u-link">
              Randomize ships ↺
            </a>
          </p>
          <button onClick={_joinGame} disabled={!ships.length}>
            Join game
          </button>
        </div>
      )}
      {help !== null && help}
    </Layout>
  );
}

//@connect
const mapState = (state: RootState) => ({
  account: state.eth.account,
  game: sel.getGame(state),
  ships: sel.getGameShips(state),
  target: sel.getGameTarget(state),
  ocean: sel.getGameOcean(state),
});

const mapDispatch = (dispatch: Dispatch) => ({
  attack: dispatch.games.attack,
  getGame: dispatch.games.getGame,
  joinGame: dispatch.games.joinGame,
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = StateProps & DispatchProps;

export default connect(mapState, mapDispatch)(GameShow);
