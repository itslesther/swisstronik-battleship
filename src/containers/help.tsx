import { PureComponent } from "react";
import { connect } from "react-redux";
//
import * as sel from "../data/selectors";
import { RootState } from "../data/store";

class Help extends PureComponent<Props> {
  getMessage() {
    const { position, hit, miss, won, lost } = this.props;

    if (won) {
      return `You won !`;
    }

    if (lost) {
      return `You lost...`;
    }

    if (hit) {
      return `Hit ! (${position})`;
    }

    if (miss) {
      return `Miss... (${position})`;
    }

    if (position) {
      return `Pending attack (${position})`;
    }

    return "Your turn";
  }

  render() {
    return (
      <div className="u-mb">
        <h3>Help</h3>
        <p>{this.getMessage()}</p>
      </div>
    );
  }
}

// @connect
const mapState = (state: RootState) => ({
  position: sel.getTargetPosition(state),
  hit: sel.isTargetHit(state),
  miss: sel.isTargetMiss(state),
  won: sel.isTargetWin(state),
  lost: sel.isOceanWin(state),
});

type StateProps = ReturnType<typeof mapState>;
type Props = StateProps;

// eslint-disable-next-line react-refresh/only-export-components
export default connect(mapState, null)(Help);
