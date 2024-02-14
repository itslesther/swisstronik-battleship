import { Component } from "react";
import { Provider } from "react-redux";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
//
import GameShow from "./containers/game-show";
import GameCreate from "./containers/game-create";
import { Store } from "./data/store";

const router = createBrowserRouter(
  //   [
  //   {
  //     path: "/",
  //     element: GameCreate,
  //   },
  //   {
  //     path: "/games/:game",
  //     element: GameShow,
  //   },
  // ]
  createRoutesFromElements(
    <Route path="/">
      <Route path="/" element={<GameCreate />}></Route>
      <Route path="/games/:game" element={<GameShow />}/>
    </Route>
  )
);

export default class App extends Component<{ store: Store }> {
  render() {
    return (
      <Provider store={this.props.store}>
        <RouterProvider router={router} />
      </Provider>
    );
  }
}
