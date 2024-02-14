import { Component } from "react";
import { connect } from "react-redux";
import { Link, NavigateFunction } from "react-router-dom";
//
import Game from "../components/game";
import * as sel from "../data/selectors";
import { Dispatch, RootState } from "../data/store";
import qs from "qs";

const query = document.location.search.substring(1);
const params = qs.parse(query);
const accountIndex = Number(params.account);
const providerParam = params.provider as "metamask" | "raw-keys";

// import Cookies from "universal-cookie";

// const cookies = new Cookies(null, { path: "/" });

class Layout extends Component<Props> {
  _showGame = (_gameId: number) => {
    const gameId = Number(_gameId);
    this.props.getGame(gameId);

    this.props.navigate(`/games/${gameId}?account=${accountIndex}&provider=${providerParam}`);
  };

  render() {
    const { children, myGames, openGames } = this.props;

    return (
      <div className="container u-cf">
        <div className="u-fl">
          {children}
        </div>
        <div style={{ marginLeft: 525 }}>
          <div className="u-mb">
            <h3>My games</h3>
            <p className="new_game_lable">
              <Link to={`/?account=${accountIndex}&provider=${providerParam}`}>Create new game</Link>
            </p>
            {myGames.length === 0 && <p>No games</p>}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {myGames.map((game: any) => (
              <Game key={game.id!} {...game!} onClick={this._showGame} />
            ))}
          </div>

          <div className="u-mb">
            <h3>Open games</h3>
            {openGames.length === 0 && <p>No open games</p>}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {openGames.map((game: any) => (
              <Game key={game.id} {...game} onClick={this._showGame} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

// @connect
const mapState = (state: RootState) => ({
  myGames: sel.getMyGames(state),
  openGames: sel.getOpenGames(state),
});

const mapDispatch = (dispatch: Dispatch) => ({
  getGame: dispatch.games.getGame,
  joinGame: dispatch.games.joinGame,
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = StateProps &
  DispatchProps & { children: React.ReactNode; navigate: NavigateFunction };

// eslint-disable-next-line react-refresh/only-export-components
export default connect(mapState, mapDispatch)(Layout);
