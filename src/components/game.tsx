import { PureComponent } from "react";
import cx from "classnames";
//
import "./game.css";
import * as Bs from "../utils/battleship";

export default class Game extends PureComponent<Props> {
  _onClick = () => this.props.onClick(this.props.id!);

  render() {
    const { gridSize, owner, challenger } = this.props;

    const status = Bs.getStatus(this.props.status);
    const className = cx("game", `game--${status}`);

    return (
      <div className={className} onClick={this._onClick}>
        <div className="game__status">
          <span className={cx("label", `label--${status}`)}>{status}</span>
        </div>

        <div className="game__grid">
          <div className="label label--open">{gridSize}</div>
        </div>

        <div className="game__vs">
          <span className="game__vsplayer">{owner}</span>
          <small>vs</small>
          <span className="game__vsplayer">
            {challenger || "0x0000000000000000000000000000000000000000"}
          </span>
        </div>
      </div>
    );
  }
}

type Props = {
  id?: number;
  gridSize: number;
  owner: string;
  challenger: string;
  status: number;
  onClick: (id: number) => void;
};