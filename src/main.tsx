import React from "react";
import ReactDOM from "react-dom/client";
// import Cookies from "universal-cookie";
import qs from "qs";

import App from "./App";
import store from "./data/store";
// import detectEthereumProvider from "@metamask/detect-provider";
import createWeb3 from "./utils/web3";
import Application from "./application";

// const cookies = new Cookies(null, { path: "/" });
const query = document.location.search.substring(1);
const params = qs.parse(query);

// if (params.provider) {
//   // cookies.set("provider", params.provider);
// }

if(typeof params.account === "undefined") {
  alert("Please provide an account (index) via the url query parameter 'account'");
  throw new Error("No account provided");
}

// if (typeof params.account !== "undefined") {
//   cookies.set("account", params.account);
// }

// if (!cookies.get("account")) {
//   cookies.set("account", "0");
// }

// METAMASK IS DESABLED SINCE WE NEED TO USE 2 ACCOUNTS AT THE SAME TIME FOR THE GAME
// METAMASK ONLY ALLOWS ONE ACCOUNT TO BE SELECTED
// IF WE SWITCH FROM ONE METAMASK ACCOUNT TO ANOTHER, WE'D LOSE THE GAME STATE
// THE GAME DOESN'T GET PAST CONTRACT EVENTS
// SO WE CAN'T RELOAD THE WEBSITE WHILE PLAYING THE GAME EITHER SINCE 
// WE'D LOSE THE GAME STATE

// const ganache = cookies.get("provider") === "ganache";
const ganache = true;

const accountIndex = Number(params.account);
// let provider;

// if (ganache) {
//   accountIndex = parseInt(cookies.get("account"));
// } else {
//   // Metamask returns only one account
//   accountIndex = 0;
//   provider = await detectEthereumProvider({ mustBeMetaMask: true });
// }

const web3 = createWeb3();
const app = new Application(web3, store, accountIndex, ganache);

await app.init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App store={store} />
  </React.StrictMode>
);
