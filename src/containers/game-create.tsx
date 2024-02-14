/* eslint-disable react-refresh/only-export-components */
import { connect } from "react-redux";
import Layout from "./layout";
import GameForm from "../components/game-form";
import { Dispatch } from "../data/store";
import { useNavigate } from "react-router-dom";

function GameCreate(props: Props) {
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _createGame = (data: any) => {
    props.createGame({ ...data, navigate });
  };

  return (
    <Layout navigate={navigate}>
      <GameForm onSubmit={_createGame} />
    </Layout>
  );
}

const mapDispatch = (dispatch: Dispatch) => ({
  createGame: dispatch.games.createGame,
});

type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = DispatchProps;

export default connect(null, mapDispatch)(GameCreate);
