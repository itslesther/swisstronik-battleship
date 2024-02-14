import { Component } from "react";
//
import * as Bs from "../utils/battleship";
import Grid from "./grid";

const gridSizes = Bs.getGridSizes();

export default class GameForm extends Component<Props> {
  static defaultProps = {
    buttonText: "Create new game"
  };

  state = {
    gridSize: 3,
    ships: Bs.createGrid(3),
    ocean: Bs.createGrid(3, true),
    disabled: false
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _setSize = (ev: any) => {
    const gridSize = parseInt(ev.target.value, 10);

    this.setState({
      gridSize,
      ships: Bs.createGrid(gridSize),
      ocean: Bs.createGrid(gridSize, true)
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _randomize = () => {
    const { gridSize } = this.state;

    this.setState({
      ships: Bs.createGrid(gridSize)
    });
  };

  _onSubmit = () => {
    const { gridSize, ships } = this.state;

    this.setState({ disabled: true });

    this.props.onSubmit({ gridSize, ships });
  };

  render() {
    const { buttonText } = this.props;
    const { gridSize, ocean, ships, disabled } = this.state;

    return (
      <div>
        <div className="u-mb">
          <h3>Grid size</h3>
          {gridSizes.map(size => (
            <label key={size} className="radio">
              <input
                type="radio"
                value={size}
                onChange={this._setSize}
                checked={size === gridSize}
              />
              {Bs.getGridSizeLabel(size)}
            </label>
          ))}
        </div>
        <div className="u-mb">
          <h3>Ships placement</h3>
          <Grid size={gridSize} mod="ocean" positions={ocean} ships={ships} />
        </div>
        <p>
          <a onClick={this._randomize} className="u-link">
            Randomize ships ↺
          </a>
        </p>
        <button className="button" onClick={this._onSubmit} disabled={disabled}>
          {buttonText}
        </button>
      </div>
    );
  }
}

type Props = {
  buttonText?: string;
  onSubmit: (data: { gridSize: number; ships: number[] }) => void;
};